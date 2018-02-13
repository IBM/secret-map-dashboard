import config from './config';
const amqp = require('amqplib/callback_api');
var redis = require("redis");
export async function queueRequest(corrId, requestQueue, params) {
  amqp.connect(config.rabbitmq, function (err, conn) {
    //amqp.connect('amqp://localhost:5672', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertQueue('', {
        exclusive: true
      }, function (err, q) {
        var corr = corrId;
        params = typeof params !== "string" ? JSON.stringify(params) : params;
        console.log(' [x] Requesting %s', params);
        ch.consume(q.queue, function (msg) {
          if(msg.properties.correlationId === corr) {
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
  });
}
export function getRedisConnection() {
  var redisClient = redis.createClient(config.redis);
  //var redisClient = redis.createClient('redis://localhost:6379');
  redisClient.on("error", (err) => console.log("Error on redis client : " + err));
  return redisClient;
}