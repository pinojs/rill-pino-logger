// either transpile or run with --harmony-destructuring
'use strict'

var rill = require('rill')
var logger = require('./')

var app = rill()
app.use(logger())

app.use(({res}) => {
  res.body = 'hello world'
  throw Error('BANG')
})

app.listen({port: 3000})
