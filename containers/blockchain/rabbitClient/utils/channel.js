const amqp = require('amqplib/callback_api');
export class RabbitClient {
  constructor(config) {
    this._config = config;
    this._channel = null;
    this._connection = null;
    this._queue = null;
  }
  async configureClient() {
    console.log("connecting to rabbit server : " + this._config.rabbitmq);
    var self = this;
    this._connection = await new Promise(function (resolve, reject) {
      amqp.connect(self._config.rabbitmq, function (err, conn) {
        if(err) {
          console.log("Error in connecting rabbit queueserver");
          reject(err);
        } else {
          console.log("printing Connection in func");
          resolve(conn);
        }
      });
    });
    this._connection.on('error', function () {
      console.log('Connection failed');
      self.stop();
      self.configureClient();
    });
    this._channel = await new Promise(function (resolve, reject) {
      self._connection.createChannel(function (err, ch) {
        if(err) {
          console.log("Error in creating rabbit channel");
          reject(err);
        } else {
          resolve(ch);
        }
      });
    });
    this._queue = await new Promise(function (resolve, reject) {
      self._channel.assertQueue('', {
        exclusive: true
      }, function (err, q) {
        if(err) {
          console.log("Error in creating queue");
          reject(err);
        } else {
          resolve(q);
        }
      });
    });
  }
  async stop() {
    console.log('stop');
    if(this._channel) {
      return await this._channel.close();
    } else {
      console.warn('stopping but channel was not opened');
    }
  }
}