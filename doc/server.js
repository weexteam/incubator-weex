var http = require('http');
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/', secret: 'deployweexwebsite' });
var spawn = require('child_process').spawn;

function run_cmd(cmd, args, callback) {
  var child = spawn(cmd, args);
  var resp = '';

  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback(resp) });
}

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777);

handler.on('push', function (event) {
  if (event.payload.ref == 'refs/heads/gh-pages') {
    run_cmd('sh', ['./deploy.sh'], function(text){ console.log(text) });
  } else {
    console.log('This push is not doc branch.');
  }
})

handler.on('error', function (event) {
  console.log('error');
})