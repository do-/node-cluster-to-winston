const process = require ('node:process')
const {LEVEL, MESSAGE} = require ('triple-beam')

module.exports = class WorkerTransport extends require ('winston-transport') {

    constructor ({key}) {

        super ()

        this.key = key

    }

    log (info, callback) {

        info.level = info [LEVEL]

        info [this.key] = info [MESSAGE]

        process.send (info)

        callback ()

    }

}