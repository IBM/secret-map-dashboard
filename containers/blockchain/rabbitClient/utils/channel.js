const amqp = require('amqplib/callback_api');
export class RabbitClient {
  constructor(config) {
    this._config = config;
    this._channel = null;
    this._connection = null;
    this._queue = null;
  }
  async configureClient() {
    var self = this;
    try {
      //console.log("connecting to rabbit server : " + this._config.rabbitmq);
      self._connection = await new Promise(function (resolve, reject) {
        amqp.connect(self._config.rabbitmq, function (err, conn) {
          if(err) {
            console.log("Error in connecting rabbit queueserver");
            reject(err);
          } else {
            resolve(conn);
          }
        });
      });
      self._connection.on('error', function () {
        console.log('Connection failed');
        self.stop().then(function () {
          self._connection = null;
          return self.configureClient();
        }).then(function () {
          console.log('Channel reconfigured');
        }).catch(err => {
          console.log(err);
        });
      });
      self._channel = await new Promise(function (resolve, reject) {
        self._connection.createChannel(function (err, ch) {
          if(err) {
            console.log("Error in creating rabbit channel");
            reject(err);
          } else {
            resolve(ch);
          }
        });
      });
      self._queue = await new Promise(function (resolve, reject) {
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
    } catch(err) {
      console.log("Error in channel setup");
      console.log(err.message);
      await self.configureClient();
    }
  }
  async stop() {
    //console.log('stop');
    try {
      if(this._channel) {
        return await this._channel.close();
      } else {
        //console.warn('stopping but channel was not opened');
        return Promise.resolve();
      }
    } catch(e) {
      console.log("Error in closing channel");
    }
  }
}