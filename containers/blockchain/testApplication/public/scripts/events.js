/*eslint no-undef:0*/
class Events {
  constructor() {
    //const socket = new WebSocket('ws://localhost:8080');;
    //socket.on('block', (evt) => this.doSocketMessage(evt));
    var self = this;
    self.block = io.connect('http://localhost:3030/block');
    self.execute = io.connect('http://localhost:3030/execute');
    self.block.on('block', (data) => {
      console.log(data);
      self.update(JSON.parse(data));
    });
    self.execute.on('executionResult', (data) => {
      console.log(data);
      console.log("here");
      if(self.corrIds.has(data.corrId)) {
        console.log("herere");
        self.corrIds.delete(data.corrId);
        if(data.corrId.startsWith("block")) {
          self.loadBlocks(data);
        } else {
          self.update(data);
        }
        //self.loadBlocks(data);
        //console.log(self.corrIds.size);
      }
    });
    self.corrIds = new Set();
    self.block.on('connect', () => {
      console.log("Connected");
    });
    self.requestBlocks();
  }
  requestBlocks() {
    var corrId = "block" + this.uuidv4();
    this.corrIds.add(corrId);
    this.execute.emit('exec', {
      type: 'blocks',
      corrId: corrId,
      params: {
        noOfLastBlocks: 20,
      }
    });
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  //{"id":"17","fingerprint":"151e2fec76aacd117276","transactions":[{"type":"ENDORSER_TRANSACTION","timestamp":"Fri Jan 19 2018 15:38:22 GMT-0800 (PST)"}]}
  update(eventData) {
    var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
    $(rowData).hide().prependTo('#table_view tbody').fadeIn("slow").addClass('normal');
  }
  loadBlocks(data) {
    data = data === "string" ? JSON.parse(JSON.parse(data).result) : JSON.parse(data.result);
    data = data.result.sort((a, b) => a.id > b.id);
    data.forEach(function (eventData) {
      console.log(eventData);
      var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
      $(rowData).hide().prependTo('#table_view tbody').fadeIn("slow").addClass('normal');
    });
  }
}
new Events();