import config from './config';
const amqp = require('amqplib/callback_api');
var redis = require("redis");
export async function queueRequest(corrId, requestQueue, params, count) {
  if(!count) {
    count = 1;
  }
  amqp.connect(config.rabbitmq, function (err, conn) {
    //amqp.connect('amqp://localhost:5672', function (err, conn) {
    if(err) {
      console.log(err);
      console.log(" Attempting to re-connect.to rabbit queueserver");
      if(count <= 5) {
        setTimeout(function () {
          console.log('now attempting reconnect after 10s ...');
          queueRequest(corrId, requestQueue, params, count + 1);
        }, 10000);
      } else {
        console.log("Rabbit cluster down. Please try after some time");
      }
      return;
    } else {
      conn.createChannel(function (err, ch) {
        ch.assertQueue('', {
          exclusive: true
        }, function (err, q) {
          var corr = corrId;
          params = typeof params !== "string" ? JSON.stringify(params) : params;
          console.log(' [x] Requesting %s', params);
          ch.consume(q.queue, function (msg) {
            if(msg.properties.correlationId === corr) {
              console.log("Received ACK. Closing connection");
              conn.close();
            }
          }, {
            noAck: true
          });
          ch.sendToQueue(requestQueue, new Buffer(params), {
            persistent: true,
            correlationId: corrId,
            messageId: "1",
            replyTo: q.queue
          });
          ch.close();
        });
      });
    }
    conn.on('error', function () {
      console.log('Connection failed');
      if(count <= 5) {
        setTimeout(function () {
          console.log('now attempting reconnect after 10s ...');
          queueRequest(corrId, requestQueue, params, count + 1);
        }, 10000);
      } else {
        console.log("Rabbit cluster down. Please try after some time");
      }
    });
  });
}
export function getRedisConnection() {
  var redisClient = redis.createClient(config.redis);
  //var redisClient = redis.createClient('redis://localhost:6379');
  redisClient.on("error", (err) => console.log("Error on redis client : " + err));
  return redisClient;
}