import config from '../set-up/config';
import invokeFunc from '../set-up/invoke';
import queryFunc from '../set-up/query';
const uuidv4 = require('uuid/v4');
const amqp = require('amqplib/callback_api');
//const amqp = require('amqplib');
var redis = require("redis");
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
export async function createConnection(clients) {
  var expiry = process.env.MESSAGEEXPIRY || 300;
  clients.map(peerClient => {
    var rabbitServerConnection = function (clientWorker) {
      amqp.connect(config.rabbitmq, function (err, conn) {
        console.log("connected to the server");
        var reconnect = function (clientWorker) {
          setTimeout(function () {
            console.log('now attempting reconnect ...');
            rabbitServerConnection(clientWorker);
          }, 10000);
        };
        conn.on('error', function () {
          console.log('Connection failed');
          reconnect(clientWorker);
        });
        if(err) {
          console.log('connection failed', err);
          reconnect(clientWorker);
        } else {
          conn.createChannel(function (err, ch) {
            var q = process.env.RABBITMQQUEUE || 'user_queue';
            var setValue = function (key, value) {
              var redisClient = getRedisConnection();
              redisClient.set(key, value, 'EX', expiry, () => redisClient.quit());
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
                setValue(msg.properties.correlationId, data);
                ch.ack(msg);
              };
              console.log("Processing request : " + JSON.stringify(input.params));
              execute(input.type, clientWorker, input.params).then(function (value) {
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
    };
    rabbitServerConnection(peerClient);
  });
}
/*function connect(clientWorker) {
  return new Promise(function (resolve, reject) {
    amqp.connect(config.rabbitmq).then(function (conn) {
      console.log("connected to the server");
      conn.on('error', function () {
        console.log('Connection failed');
        setTimeout(function () {
          console.log('now attempting reconnect ...');
          connect(clientWorker);
        }, 10000);
      });
      return conn.createChannel().then(function (ch) {
        console.log('channel created, lets connect exchanges');
        var q = process.env.RABBITMQQUEUE || 'user_queue';
        var setValue = function (key, value) {
          var redisClient = getRedisConnection();
          redisClient.set(key, value, 'EX', expiry, () => redisClient.quit());
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
            setValue(msg.properties.correlationId, data);
            ch.ack(msg);
          };
          console.log("Processing request : " + JSON.stringify(input.params));
          execute(input.type, peerClient, input.params).then(function (value) {
            reply(ch, msg, JSON.stringify(value));
          }).catch(err => {
            console.log("Failed message  : " + err.message);
            reply(ch, msg, JSON.stringify({
              message: "failed",
              error: err.message
            }));
          });
        });
        resolve(ch);
      })
    }, function connectionFailed(err) {
      console.log('connection failed', err);
      connect(clientWorker);
    }).catch(function (error) {
      console.log(error);
    });
  });
}*/
export function getRedisConnection() {
  var redisClient = redis.createClient(config.redis);
  redisClient.on("error", (err) => console.log("Error on redis client : " + err));
  return redisClient;
}