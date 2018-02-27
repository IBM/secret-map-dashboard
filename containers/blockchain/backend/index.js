var exec = require('child_process').exec;
var number = process.env.SCALECLIENT ? Number(process.env.SCALECLIENT) : 1;
for(var i = 0; i < number; i++) {
  exec('node ./startApp.js', function (error, stdout, stderr) {
    console.log('stdout: ', stdout);
    console.log('stderr: ', stderr);
    if(error !== null) {
      console.log('exec error: ', error);
    }
  });
  console.log("Starting child process : " + i);
}