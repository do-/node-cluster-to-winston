const {MESSAGE} = require ('triple-beam')

module.exports = class PrimaryFormat {

    constructor ({format, key}) {

        this.format = format
        this.key = key

    }

    transform (info) {

        const {key} = this

        if (key in info) {

            info [MESSAGE] = info [key]

        }
        else {

            info = this.format.transform (info)

        }

        return info

    }

}