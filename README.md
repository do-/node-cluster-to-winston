![workflow](https://github.com/do-/node-cluster-to-winston/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

`cluster-to-winston` is an extension to [`winston`](https://www.npmjs.com/package/winston) for sharing primary `Logger` instances among multiple worker processes in a [`cluster`](https://nodejs.org/docs/latest/api/cluster.html).

It can be considered as complete rewrite of the [`winston-cluster`](https://www.npmjs.com/package/winston-cluster) module with another API.

# Usage
```js
const winston = require ('winston')
require ('cluster-to-winston') // no typo here

const logger = winston.createLogger ({
  transports:       //... for the primary process: e. g. DailyRotateFile
  format:           //... for both primary and workers
})
  .enableCluster ({ // all the necessary setup is done here
  //  key          : 'WorkerProcessLogMessage',   // change this in case of collision
  //  listenerName : 'onWorkerProcessLogMessage', // same, for a `Logger` property
  //  listen       : true,                        // set `false` to install listeners manually
  })

/* // application code:
if (cluster.isPrimary) {
  cluster.fork ()
  // using `logger` in the primary process
}
else {
  // using apparently the same `logger` in workers
}
*/
```
# Description

Calling `require ('cluster-to-winston')` augments the previously loaded [`Logger`](https://github.com/winstonjs/winston/blob/master/lib/winston/logger.js) class with a new method: `.enableCluster ()` that is supposed to be called right after the initialization and returns the `Logger` instance to support chaining.

What `.enableCluster ()` does, depends on the context:
* called in the primary process, it 
  * wraps `this.format` to avoid reformatting `info` objects received from workers;
  * defines `this.onWorkerProcessLogMessage ()` that routes messages containing the magic `WorkerProcessLogMessage` (name configurable) property to this logger as info objects;
  * registers this method as a handler for `cluster`' s `'message'` event (unless prohibited by setting `listen: false` for advanced use);
* in a worker process, it forcibly replaces all `transports` with a single, that stores the final `MESSAGE` as the magic `WorkerProcessLogMessage` and publishes the info object as a `'message'` event.

In the sample code above, the `logger` looks created once, before branching and forking. But because of the way `cluster.fork` and `require` work, effectively, `.enableCluster ()` is called with final `cluster.isWorker` values, so `Logger` instances will be properly initialized in each process. And, unlike in [`winston-cluster`](https://www.npmjs.com/package/winston-cluster), the logger set up at application start can be then used everywhere, in a transparent way. Moreover, `format`ting is not postponed, so [Timestamp](https://github.com/winstonjs/logform?tab=readme-ov-file#timestamp)s in workers are applied immediately.

# Notes

IPC message bodies a plain (JSON) strings, so Symbols cannot be delivered from worker to primary process. This is the reason why the `MESSAGE` from `winston`'s [triple-beam](https://www.npmjs.com/package/triple-beam) had to be backed by a workaround magic string.

Sure, when using [`cluster`](https://nodejs.org/docs/latest/api/cluster.html) IPC may be used for a lot of things aside logging, that poses some risk of data interference. The `logger.onWorkerProcessLogMessage` method processes only objects with `WorkerProcessLogMessage` field ignoring all other, so it can act as one of multiple simultaneous `message` handlers. But application developers are free to bypass the automatic handler setting with the `listen: false` option and to build custom routers based on the provided one.
