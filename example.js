// either transpile or run with --harmony-destructuring
'use strict'

var rill = require('rill')
var logger = require('./')

var app = rill()
app.use(logger())

app.use(({log, res, req}) => {
  log.info('something else')
  log.info('%j', {foo: 1})
  res.body = 'hello world'
})

app.listen({port: 3000})
