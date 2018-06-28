const fs = require('fs')
const pull = require('pull-stream')
const zerr = require('zerr')
const mdm = require('mdmanifest')
const muxrpc = require('muxrpc')
const tcp = require('pull-net/server')

const commands = require('.')

const MissingArgError = zerr('BadArg', '"%" is required')
const BadTypeError = zerr('BadArg', '"%" must be a valid %')

const mdmanifest = fs.readFileSync(`${__dirname}/manifest.md`, 'utf8')
const manifest = mdm.manifest(mdmanifest)

const api = {
  usage: function (command, cb) {
    if (typeof command === 'function') {
      cb = command
      command = null
    }
    cb(null, mdm.usage(mdmanifest, command))
  },
  receive: function(opts) {
    return commands.receive(opts)
  }
}

const tcp_server = tcp( (client) => {
  const rpc_server = muxrpc(null, manifest)(api)
  const rpc_stream = rpc_server.createStream(/*console.log.bind(console, 'stream is closed')*/)
  pull(rpc_stream, client, rpc_stream)
})
tcp_server.listen(8099, '127.0.0.1')

/// -- httpd
/*
const http = require('http');
const ecstatic = require('ecstatic')
const ws = require('pull-ws/server')

const http_server = http.createServer(
   ecstatic({ root: __dirname + '/public' })
).listen(8080)
console.log('httpd Listening on :8080')
ws({
  server: http_server,
}, (client) => {
  const rpc_server = muxrpc(null, manifest)(api)
  const rpc_stream = rpc_server.createStream()
  pull(
    rpc_stream,
    //pull.through( (d)=> console.log(`to ws ${d}`) ),
    client,
    //pull.through( (d)=> console.log(`from ws ${d}`) ),
    rpc_stream
  )
})
*/
