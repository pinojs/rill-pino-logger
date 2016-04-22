'use strict'

var rill = require('rill')
var logger = require('rill-logger')

var app = rill()
app.use(logger())

app.use((ctx) => {
  ctx.res.body = 'hello world'
  throw Error('bang!')
})

app.listen({port: 3000})
