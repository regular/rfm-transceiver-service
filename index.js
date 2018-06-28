const radio = require('rfm12b')()
const pull = require('pull-stream')
const looper = require('pull-looper')
const Notify = require('pull-notify')

const JEE_ID = 31 // get all messages to matter what recipient is specified
const GROUP_ID =19

radio.setJeeId(JEE_ID)
radio.setGroupId(GROUP_ID)
radio.setJeemodeAutoack(1)

Object.keys(radio).forEach(k => {
  if (k.slice(0,3) == 'get') {
    console.error(k, radio[k]())
  }
})

function receive(end, cb) {
  if(end) return cb && cb(end)
  radio.read( (err, data, meta) => {
    if (err) return cb(err)
    cb(null, {
      payload: data.toString('hex'),
      meta
    })
  })
}

const notify = Notify()

pull(
  receive,
  looper,
  pull.drain(notify, err => notify.end(err) )
)

module.exports.receive = function(opts) {
  return pull(
    notify.listen(),
    looper,
    pull.filter( ({meta}) => {
      if (opts.to && meta.to !== opts.to) return false
      if (opts.from && meta.from !== opts.from) return false
      return true
    })
    /*
    (function() {
      if (!opt.no_repeat) return pull.through()
      return (function(){
        let last = null
        return pull.filter( ({meta, payload}) => {
          let hash = payload + JSON.stringify(meta)
          let ret = last !== hash
          last = hash
          return ret
        })
      })()
    })()
    */
  )
}
