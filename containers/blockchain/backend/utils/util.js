import config from '../set-up/config';
import invokeFunc from '../set-up/invoke';
import queryFunc from '../set-up/query';
const uuidv4 = require('uuid/v4');
const amqp = require('amqplib/callback_api');
var RedisClustr = require('redis-clustr');
async function invokeChaincode(type, client, values) {
  values = typeof values !== "string" ? values : JSON.parse(values);
  if(!values.userId) {
    throw new Error('Missing UserId');
  } else {
    if(!values.fcn) {
      throw new Error('Missing function name');
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""];
    }
    var func = null;
    if(type === "query") {
      func = queryFunc;
    } else {
      func = invokeFunc;
    }
    return func(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      if(type === "query") {
        return result;
      } else {
        return client.getTransactionDetails(result);
      }
    }).then((result) => {
      return {
        message: "success",
        result: result
      };
    }).catch(err => {
      throw err;
    });
  }
}
async function enrollUser(client) {
  var userId = uuidv4();
  return client.registerAndEnroll(userId).then((user) => {
    return invokeFunc(user._name, client, config.chaincodeId, config.chaincodeVersion, "createMember", [userId, client._peerConfig.userType]);
  }).then((result) => {
    return {
      message: "success",
      result: {
        user: userId,
        txId: result
      }
    };
  }).catch(err => {
    throw err;
  });
}
async function getBlocks(client, values) {
  if(!values) {
    values = {};
  }
  values = typeof values !== "string" ? values : JSON.parse(values);
  if(!values.currentBlock || (values.currentBlock && isNaN(values.currentBlock))) {
    values.currentBlock = -1;
  }
  if(!values.noOfLastBlocks || (values.noOfLastBlocks && isNaN(values.noOfLastBlocks))) {
    values.noOfLastBlocks = 10;
  }
  return client.getBlocks(Number(values.currentBlock), Number(values.noOfLastBlocks)).then((results) => {
    return {
      message: "success",
      result: results
    };
  }).catch(err => {
    throw err;
  });
}
async function execute(type, client, params) {
  try {
    switch(type) {
    case 'invoke':
    case 'query':
      return invokeChaincode(type, client, params);
    case 'enroll':
      return enrollUser(client);
    case 'blocks':
      return getBlocks(client, params);
    default:
      throw new Error('Invalid Function Call');
    }
  } catch(err) {
    throw err;
  }
}
export async function createConnection(client) {
  var expiry = process.env.MESSAGEEXPIRY || 300;
  amqp.connect(config.rabbitmq, function (err, conn) {
    console.log("connected to the server");
    if(err) {
      console.log('connection failed', err);
      setTimeout(function () {
        console.log('now attempting reconnect ...');
        createConnection(client);
      }, 5000);
    } else {
      conn.on('error', function () {
        console.log('Connection failed event');
        setTimeout(function () {
          console.log('now attempting reconnect ...');
          createConnection(client);
        }, 5000);
        conn.close();
      });
      conn.createChannel(function (err, ch) {
        var q = process.env.RABBITMQQUEUE || 'user_queue';
        var setValue = function (key, value) {
          try {
            var redisClient = getRedisConnection();
            redisClient.set(key, value, 'EX', expiry, () => redisClient.quit());
            //redisClient.set(key, value);
          } catch(err) {
            console.log("Error on redis client : " + err);
          }
        };
        console.log("creating server queue connection " + q);
        ch.assertQueue(q, {
          durable: true
        });
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        ch.consume(q, function reply(msg) {
          var input = JSON.parse(msg.content.toString());
          var reply = (ch, msg, data) => {
            /*ch.sendToQueue(msg.properties.replyTo, new Buffer("Execution completed"), {
              correlationId: msg.properties.correlationId,
              messageId: msg.properties.messageId,
              content_type: 'application/json'
            });*/
            setValue(msg.properties.correlationId, data);
            ch.ack(msg);
          };
          console.log("Processing request : " + JSON.stringify(input.params));
          execute(input.type, client, input.params).then(function (value) {
            reply(ch, msg, JSON.stringify(value));
          }).catch(err => {
            console.log("Failed message  : " + err.message);
            reply(ch, msg, JSON.stringify({
              message: "failed",
              error: err.message
            }));
          });
        });
      });
    }
  });
}
export function getRedisConnection() {
  return new RedisClustr({
    servers: [{
      host: config.redisHost,
      port: config.redisPort
    }]
  });
}