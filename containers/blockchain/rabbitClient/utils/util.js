import config from './config';
/*var config = {
  rabbitmq: 'amqp://localhost:5672',
  redisHost: 'localhost',
  redisPort: 7000,
};*/
import {
  RabbitClient
} from './channel';
//const amqp = require('amqplib/callback_api');
var RedisClustr = require('redis-clustr');
const rabbitClient = new RabbitClient(config);
(async () => {
  try {
    await rabbitClient.configureClient();
    console.log("Rabbit client configured");
    //console.log(rabbitClient);
  } catch(e) {
    console.log(e);
    process.exit(-1);
  }
})();
export async function queueRequest(corrId, requestQueue, params) {
  params = typeof params !== "string" ? JSON.stringify(params) : params;
  console.log(' [x] Requesting %s', params);
  rabbitClient._channel.sendToQueue(requestQueue, new Buffer(params), {
    persistent: true,
    correlationId: corrId
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