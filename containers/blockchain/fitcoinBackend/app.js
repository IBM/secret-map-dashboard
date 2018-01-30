/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
'use strict';
const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const cors = require("cors");
const peer = require('./utils/peer');
const amqp = require('amqplib/callback_api');
const utils = require('./utils/util');
import config from './set-up/config';
(async () => {
  try {
    await peer.initiateClient();
  } catch(e) {
    console.log('Fatal error initiating organization clients!');
    console.log(e);
    process.exit(-1);
  }
  /*const app = express();
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(function(req, res, next) {
    req.client = peer.clients[0];
    next();
  });
  app.use("/api", require("./routes/api").router);
  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: {}
      }
    });
  });
  const port = process.env.PORT || process.env.VCAP_APP_PORT || 3001;
  app.listen(port, function() {
    console.log('Server running on port: %d', port);
  });*/
  //console.log(config.rabbitmq);
  amqp.connect(config.rabbitmq, function(err, conn) {
    conn.createChannel(function(err, ch) {
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
        utils.execute(input.type, peer.clients[0], input.params).then(function(value) {
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
})();