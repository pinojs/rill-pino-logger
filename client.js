'use strict'
process.pid = 0
var logger = require('./logger.js')
var writer = {
  _writableState: true,
  write: function (s) {
    console.log(s)
  }
}

module.exports = function (opts, stream) {
  if (opts && opts._writableState) {
    stream = opts
    opts = null
  }
  stream = stream || writer
  if (opts && opts.extreme) {
    console.warn('extreme mode is not suitable for browsers, disabling extreme mode')
    opts.extreme = false
  }
  return logger(opts, stream)
}
