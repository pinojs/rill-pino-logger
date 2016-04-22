# rill-pino-logger&nbsp;&nbsp;[![Build Status](https://travis-ci.org/davidmarkclements/rill-pino-logger.svg)](https://travis-ci.org/davidmarkclements/rill-pino-logger)


[pino](https://github.com/mcollina/pino) logging [rill](http://npm.im/rill) middleware

Currently the **only** production logger available for rill.

To our knowledge, `rill-pino-logger` is the [fastest](#benchmarks) JSON [rill](http://npm.im/rill) logger in town.

* [Benchmarks](#benchmarks)
* [Installation](#install)
* [Usage](#example)
* [Browser](#browser)
* [API](#api)
* [Acknowledgements](#acknowledgements)
* [License](#license)


## Benchmarks

Benchmarks log each request/response pair while returning
`'hello world'`, using
[autocannon](https://github.com/mcollina/autocannon) with 100
connections and pipelining set to 1 (rill can't handle pipelining): `autocannon -c 100 -p 1 http://localhost:3000`.

* `rill-logger`: 10529.82 req/sec
* `rill-pino-logger`: 11849 req/sec
* `rill-pino-logger` (extreme): 12623.64 req/sec
* rill w/out logger: 17834.55 req/sec

All benchmarks where taken on a Macbook Pro 2013 (2.6GHZ i7, 16GB of RAM). 

Benchmarking against `rill-logger` is an apples vs oranges situation. `rill-logger` is for development logging, and has extremely simple (non-JSON) output. However, there's currently no other rill loggers to compare against.

## Install

```
npm i rill-pino-logger --save
```

## Example

### Request logging

```js
'use strict'

var rill = require('rill')
var logger = require('rill-pino-logger')

var app = rill()
app.use(logger())

app.use(({log, res}) => {
  log.info('something else')
  res.body = 'hello world'
})

app.listen({port: 3000})

```
```
$ node --harmony-destructuring example.js | pino
[2016-04-22T11:49:01.388Z] INFO (29134 on MacBook-Pro-4.local): something else
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/7.43.0",
        "accept": "*/*"
      },
      "remoteAddress": "::1",
      "remotePort": 54687
    }
[2016-04-22T11:49:01.396Z] INFO (29134 on MacBook-Pro-4.local): request completed
    res: {
      "statusCode": 200,
      "header": "HTTP/1.1 200 OK\r\ncontent-type: text/plain; charset=UTF-8\r\ncontent-length: 11\r\nDate: Fri, 22 Apr 2016 11:49:01 GMT\r\nConnection: keep-alive\r\n\r\n"
    }
    responseTime: 8
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/7.43.0",
        "accept": "*/*"
      },
      "remoteAddress": "::1",
      "remotePort": 54687
    }
```

### Thrown Error logging


```js
'use strict'

var rill = require('rill')
var logger = require('rill-pino-logger')

var app = new rill()
app.silent = true // disable console.errors
app.use(logger())

app.use(({res}) => {
  res.body = 'hello world'
  throw Error('bang!')
})

app.listen(3000)
```

```
$ node --harmony-destructuring error-example.js | pino
[2016-04-22T11:47:49.838Z] ERROR (29124 on MacBook-Pro-4.local): request errored
    res: {}
    err: {
      "type": "Error",
      "message": "BANG",
      "stack": "Error: BANG\n    at Error (native)\n    at /Users/davidclements/z/nearForm/rill-pino-logger/error-example.js:11:9\n    at dispatch (/Users/davidclements/z/nearForm/rill-pino-logger/node_modules/rill/node_modules/@rill/chain/index.js:28:32)\n    at next (/Users/davidclements/z/nearForm/rill-pino-logger/node_modules/rill/node_modules/@rill/chain/index.js:29:18)\n    at pino (/Users/davidclements/z/nearForm/rill-pino-logger/logger.js:12:12)\n    at dispatch (/Users/davidclements/z/nearForm/rill-pino-logger/node_modules/rill/node_modules/@rill/chain/index.js:28:32)\n    at chained (/Users/davidclements/z/nearForm/rill-pino-logger/node_modules/rill/node_modules/@rill/chain/index.js:16:12)\n    at Server.handleIncommingMessage (/Users/davidclements/z/nearForm/rill-pino-logger/node_modules/rill/src/index.js:56:5)\n    at emitTwo (events.js:100:13)\n    at Server.emit (events.js:185:7)"
    }
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/7.43.0",
        "accept": "*/*"
      },
      "remoteAddress": "::1",
      "remotePort": 54686
    }
[2016-04-22T11:47:49.844Z] INFO (29124 on MacBook-Pro-4.local): request completed
    res: {
      "statusCode": 200,
      "header": "HTTP/1.1 200 OK\r\ncontent-type: text/plain; charset=UTF-8\r\ncontent-length: 11\r\nDate: Fri, 22 Apr 2016 11:47:49 GMT\r\nConnection: keep-alive\r\n\r\n"
    }
    responseTime: 10
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "localhost:3000",
        "user-agent": "curl/7.43.0",
        "accept": "*/*"
      },
      "remoteAddress": "::1",
      "remotePort": 54686
    }
```


## Browser

In keeping with Rill's isomorphic nature, `rill-pino-logger` works
just fine in the browser.

```sh
browserify example.js > eg.js
```

index.html:

```html
<script src=eg.js></script>
```

If we were to open `index.html` we would see the examples
messages in the console.

If we wish to log via some other mechanism, we can pass
a stream:

```js
var websocket = require('websocket-stream')
app.use(logger(websocket('http://localhost:3000', [])))
```

This would send all logs over websocket to `http://localhost:3000`.

## API

`rill-pino-logger` has the same options as
[pino](http://npm.im/pino)
`rill-pino-logger` will log when a request finishes or errors. 

Along with automated request logging, the pino logger facilitates manual logging 
by adding the pino logger instance to the the context object:

```js
  app.use(({log}, next) => {
    log.info('test')
    return next()
  })
```

## License

MIT
