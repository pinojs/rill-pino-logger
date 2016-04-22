'use strict'

var pinoHttp = require('pino-http')

module.exports = logger

function logger (opts, stream) {
  var wrap = pinoHttp(opts, stream)
  function pino (ctx, next) {
    wrap(ctx.req.original, ctx.res.original)
    ctx.log = ctx.req.original.log
    return next().catch((e) => catchErr(e, ctx))
  }
  pino.logger = wrap.logger
  return pino
}

// overriding `onerror` is much faster that using try/catch
function catchErr (e, ctx) {
  ctx.log.error({
    res: ctx.res,
    err: {
      type: e.constructor.name,
      message: e.message,
      stack: e.stack
    },
    responseTime: ctx.res.responseTime
  }, 'request errored')
}
