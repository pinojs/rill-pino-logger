'use strict'

var rill = require('rill')

var app = rill()

app.use((ctx) => {
  ctx.res.body = 'hello world'
})

app.listen({port: 3000})
