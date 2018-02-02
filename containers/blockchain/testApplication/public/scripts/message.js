/*eslint no-undef:0*/
class ReqEvents {
  constructor() {
    //const socket = new WebSocket('ws://localhost:8080');;
    //socket.on('block', (evt) => this.doSocketMessage(evt));
    this.ws = io.connect('http://localhost:3031/execute');
    var self = this;
    this.ws.on('connect', () => {
      console.log("Connected");
    });
    this.ws.on('executionResult', (data) => {
      //console.log(data);
      if(self.corrIds.has(data.corrId)) {
        self.corrIds.delete(data.corrId);
        self.update(data);
        //console.log(self.corrIds.size);
      }
    });
    self.corrIds = new Set();
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  requestServer(params) {
    var corrId = this.uuidv4();
    this.corrIds.add(corrId);
    params.corrId = corrId;
    this.ws.emit('exec', params);
  }
  update(eventData) {
    var rowData = "<tr class='anim highlight' style='width: 100%'><td><center>" + JSON.stringify(eventData) + "</center></td></tr>";
    $(rowData).hide().prependTo('#results_table tbody').fadeIn("slow").addClass('normal');
  }
}
var requestEvents = new ReqEvents();
/*
{
  type: "invoke",
  params: {
    "userId": "admin",
    "fcn": "move",
    "args": ["a", "b", "10"]
  }
}
*/
function amqpFunc() {
  var type = $('#type').val();
  var userId = $('#userId').val();
  var fcn = $('#fcn').val();
  var args = $('#argsValues').val().split(',');
  console.log(args);
  console.log(args.length);
  var input = {
    type: type,
    params: {
      userId: userId,
      fcn: fcn,
      args: args
    }
  };
  requestEvents.requestServer(input);
}