import config from '../set-up/config';
import invokeFunc from '../set-up/invoke';
import queryFunc from '../set-up/query';
const uuidv4 = require('uuid/v4');
const amqp = require('amqplib/callback_api');
async function invokeChaincode(type, client, params) {
  var values = typeof params !== "string" ? params : JSON.parse(params);
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
  //var data = typeof params !== "string" ? params : JSON.parse(params);
  var userId = uuidv4();
  return client.registerAndEnroll(userId).then((user) => {
    console.log("Successfully enrolled user " + userId);
    console.log(user);
    return invokeFunc(userId, client, config.chaincodeId, config.chaincodeVersion, "createMember", ["1"]);
  }).then((result) => {
    console.log("Enrolled User");
    console.log(result);
    return {
      message: "success",
      result: JSON.stringify({
        user: userId
      })
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
    default:
      throw new Error('Invalid Function Call');
    }
  } catch(err) {
    throw err;
  }
}
export async function createServer(clients) {
  clients.map(peerClient => {
    amqp.connect(config.rabbitmq, function (err, conn) {
      conn.createChannel(function (err, ch) {
        var q = process.env.RABBITMQQUEUE || 'user_queue';
        ch.assertQueue(q, {
          durable: true
        });
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        ch.consume(q, function reply(msg) {
          var input = JSON.parse(msg.content.toString());
          var reply = (ch, msg, data) => {
            ch.sendToQueue(msg.properties.replyTo, new Buffer(data), {
              correlationId: msg.properties.correlationId,
              messageId: msg.properties.messageId,
              content_type: 'application/json'
            });
            ch.ack(msg);
          };
          execute(input.type, peerClient, input.params).then(function (value) {
            reply(ch, msg, JSON.stringify(value));
          }).catch(err => {
            reply(ch, msg, JSON.stringify({
              message: "failed",
              error: err.message
            }));
          });
        });
      });
    });
  });
}
export async function queueRequest(params, executeEvent) {
  var requestQueue = process.env.RABBITMQQUEUE || 'user_queue';
  amqp.connect(config.rabbitmq, function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertQueue('', {
        exclusive: true
      }, function (err, q) {
        var corr = params.corrId;
        params = typeof params !== "string" ? JSON.stringify(params) : params;
        console.log(' [x] Requesting %s', params);
        ch.consume(q.queue, function (msg) {
          if(msg.properties.correlationId === corr) {
            msg.content = JSON.parse(msg.content.toString());
            msg.content.corrId = msg.properties.correlationId;
            if(msg.content.message === "success") {
              console.log(' [.] Query Result ');
              console.log(msg.content);
              executeEvent.emit('executionResult', msg.content);
              setTimeout(function () {
                conn.close();
              }, 500);
            } else if(msg.content.message === "failed" && msg.content.error.includes('READ_CONFLICT') && parseInt(msg.properties.messageId) < 3) {
              console.log("Error in query. Request Attempt No : " + (parseInt(msg.properties.messageId) + 1));
              console.log(' [x] Requesting %s', params);
              setTimeout(() => {
                ch.sendToQueue(requestQueue, new Buffer(params), {
                  correlationId: msg.properties.correlationId,
                  messageId: (parseInt(msg.properties.messageId) + 1).toString(),
                  replyTo: q.queue
                });
              }, 20000);
            } else {
              executeEvent.emit('executionResult', msg.content);
              conn.close();
            }
          }
        }, {
          noAck: true
        });
        ch.sendToQueue(requestQueue, new Buffer(params), {
          correlationId: corr,
          messageId: "1",
          replyTo: q.queue
        });
      });
    });
  });
}