const cluster = require ('node:cluster')
const {LEVEL, MESSAGE} = require ('triple-beam')
const PrimaryFormat = require ('./lib/PrimaryFormat')
const WorkerTransport = require ('./lib/WorkerTransport')
const ClusterWinstonOptions = require ('./lib/ClusterWinstonOptions')

function enableCluster (o = {}) {

    const {key, listen, listenerName} = new ClusterWinstonOptions (o)

    if (cluster.isWorker) {

        for (const transport of this.transports) this.remove (transport)

        this.add (new WorkerTransport ({key}))

    }
    else {

        const {format} = this; this.format = new PrimaryFormat ({format, key})

        this [listenerName] = (_, info) => {

            if (!(key in info)) return

            info [LEVEL]   = info.level
            info [MESSAGE] = info [key]

            this.write (info)

        }

        if (listen) cluster.on ('message', this [listenerName])

    }

    return this

}

require ('winston').Logger.prototype.enableCluster = enableCluster

module.exports = {
    ClusterWinstonOptions,
    PrimaryFormat,
    WorkerTransport,
    enableCluster
}