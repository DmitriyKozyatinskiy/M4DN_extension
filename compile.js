const exec = require('child_process').exec;
const fs = require('fs-extra');
const zipFolder = require('zip-folder');

fs.emptyDir('./extension/build', function (err) {
  const child = exec('webpack -p --define process.env.NODE_ENV="\"production\"" --progress --colors', (error, stdout, stderr) => {
    zipFolder('./extension', './conqueror.zip', function () {});
  });
  child.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  child.stderr.on('data', function(data) {
    console.log(data.toString());
  });
});
