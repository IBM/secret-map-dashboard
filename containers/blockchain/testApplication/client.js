var amqp = require('amqplib/callback_api');

function requestServer(params) {
  amqp.connect('amqp://localhost:5672', function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue('', {
        exclusive: true
      }, function(err, q) {
        var corr = generateUuid();
        params = JSON.stringify(params)
        console.log(' [x] Requesting %s', params);
        ch.consume(q.queue, function(msg) {
          if(msg.properties.correlationId === corr) {
            msg.content = JSON.parse(msg.content.toString());
            if(msg.content.message === "success") {
              console.log(' [.] Query Result ');
              console.log(msg.content);
            } else if(msg.content.message === "failed" && msg.content.error.includes('READ_CONFLICT') && parseInt(msg.properties.messageId) < 3) {
              console.log("Error in query. Request Attempt No : " + (parseInt(msg.properties.messageId) + 1));
              //  console.log("Error in query. Queueing request");
              console.log(' [x] Requesting %s', params);
              setTimeout(() => {
                ch.sendToQueue('user_queue', new Buffer(params), {
                  correlationId: msg.properties.correlationId,
                  messageId: (parseInt(msg.properties.messageId) + 1).toString(),
                  replyTo: q.queue
                });
              }, 20000);
            }
          }
        }, {
          noAck: true
        });
        ch.sendToQueue('user_queue', new Buffer(params), {
          correlationId: corr,
          messageId: "1",
          replyTo: q.queue
        });
      });
    });
  });
}

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

function getValues() {
  requestServer({
    type: "query",
    params: {
      "userId": "admin",
      "fcn": "query",
      "args": ["a"]
    }
  });
  requestServer({
    type: "query",
    params: {
      "userId": "admin",
      "fcn": "query",
      "args": ["b"]
    }
  });
}
getValues();
requestServer({
  type: "invoke",
  params: {
    "userId": "admin",
    "fcn": "move",
    "args": ["a", "b", "10"]
  }
});
getValues();
requestServer({
  type: "invoke",
  params: {
    "userId": "admin",
    "fcn": "move",
    "args": ["a", "b", "10"]
  }
});
getValues();
requestServer({
  type: "invoke",
  params: {
    "userId": "admin",
    "fcn": "move",
    "args": ["a", "b", "10"]
  }
});
getValues();
requestServer({
  type: "invoke",
  params: {
    "userId": "admin",
    "fcn": "move",
    "args": ["a", "b", "10"]
  }
});
getValues();