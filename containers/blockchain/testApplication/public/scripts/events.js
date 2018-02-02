/*eslint no-undef:0*/
class Events {
  constructor() {
    //const socket = new WebSocket('ws://localhost:8080');;
    //socket.on('block', (evt) => this.doSocketMessage(evt));
    var ws = io.connect('http://localhost:3030/block');
    var self = this;
    // Load initial data
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener('load', () => this.loadData());
    this.xhr.open('GET', "http://localhost:3002/api/blocks?noOfLastBlocks=15", true);
    this.xhr.send(null);
    ws.on('block', (data) => {
      console.log(data);
      self.update(JSON.parse(data));
    });
    ws.on('connect', () => {
      console.log("Connected");
    });
  }
  //{"id":"17","fingerprint":"151e2fec76aacd117276","transactions":[{"type":"ENDORSER_TRANSACTION","timestamp":"Fri Jan 19 2018 15:38:22 GMT-0800 (PST)"}]}
  update(eventData) {
    var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
    $(rowData).hide().prependTo('#table_view tbody').fadeIn("slow").addClass('normal');
  }
  loadData() {
    var data = JSON.parse(this.xhr.responseText).result;
    data = (JSON.parse(data).result).sort((a, b) => a.id > b.id);
    data.forEach(function (eventData) {
      console.log(eventData);
      var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
      $(rowData).hide().prependTo('#table_view tbody').fadeIn("slow").addClass('normal');
    });
  }
}
new Events();