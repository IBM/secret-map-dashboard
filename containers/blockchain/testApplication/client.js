var amqp = require('amqplib/callback_api');
var start = Date.now();

function requestServer(params) {
  amqp.connect('amqp://localhost:5672', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertQueue('', {
        exclusive: true
      }, function (err, q) {
        var corr = generateUuid();
        params = JSON.stringify(params);
        console.log(' [x] Requesting %s', params);
        ch.consume(q.queue, function (msg) {
          if(msg.properties.correlationId === corr) {
            msg.content = JSON.parse(msg.content.toString());
            if(msg.content.message === "success") {
              console.log(' [.] Query Result ');
              console.log(msg.content);
              //conn.close();
              var millis = Date.now() - start;
              console.log("seconds elapsed = " + Math.floor(millis / 1000));
              setTimeout(function () {
                conn.close();
              }, 500);
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
var ids = ["c468865f-586d-4b28-8075-cccd1f43a720", "e731b569-9238-49f2-82f0-4b64bc0faeb3", "811fcd46-a14f-473e-967b-bed1f0c30ea4", "54f7544d-4153-42f7-abb1-71cc98425ce0", "69473598-4c35-41d5-b876-f52858f9b9b4"];
var base = 1000;

function generateCoins(ids, inc) {
  for(var i = 0; i < ids.length; i++) {
    requestServer({
      type: "invoke",
      params: {
        "userId": ids[i],
        "fcn": "generateFitcoins",
        "args": [ids[i], (base + inc).toString()]
      }
    });
  }
}

function getValues(ids) {
  for(var i = 0; i < ids.length; i++) {
    requestServer({
      type: "query",
      params: {
        "userId": ids[i],
        "fcn": "getState",
        "args": [ids[i]]
      }
    });
  }
}
/*
type:invoke
params:{"userId" : "c468865f-586d-4b28-8075-cccd1f43a720" , "fcn" : "generateFitcoins" , "args" : ["c468865f-586d-4b28-8075-cccd1f43a720","1000"]}

*/
getValues(ids);
generateCoins(ids, 4000);
getValues(ids);
generateCoins(ids, 5000);
getValues(ids);
generateCoins(ids, 6000);
getValues(ids);