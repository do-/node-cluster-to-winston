const DEFAULT_KEY = 'WorkerProcessLogMessage'
const DEFAULT_LISTENER_NAME = 'on' + DEFAULT_KEY

const DEFAULTS = {
    key          : DEFAULT_KEY,
    listen       : true,
    listenerName : DEFAULT_LISTENER_NAME,
}

module.exports = class {

    constructor (o) {

        for (const [k, v] of Object.entries (DEFAULTS)) {
            
            this [k] = k in o ? o [k] : v

            if (typeof v === 'string') {

                this.assertNonEmptyString (k)

            }
            else {

                if (this [k] !== true && this [k] !== false) throw Error (`Invalid option ${k}: must be a boolean value`)

            }

        }

    }

    assertNonEmptyString (k) {

        const v = this [k]; if (v == null) throw Error (`Invalid option ${k}: must not be ${v}`)
        
        const t = typeof v; if (t !== 'string') throw Error (`Invalid option ${k}: must be a string, not ${t}`)

        if (v.length === 0) throw Error (`Invalid option ${k}: empty string not allowed`)

    }

}