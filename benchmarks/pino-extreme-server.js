'use strict'

var rill = require('rill')
var logger = require('../')

var app = rill()
app.use(logger({extreme: true}))

app.use((ctx) => {
  ctx.res.body = 'hello world'
})

app.listen({port: 3000})
