const cluster = require ('node:cluster')
const process = require ('node:process')
const {Writable} = require ('stream')
const winston = require ('winston')
require ('..')

const dump = _ => _ ? console.log (JSON.stringify (_)) : null

async function main () {

	const a = []

	const stream = new Writable ({
		write (r, _, cb) {
			a.push (r.toString ())
			cb ()
		}
		
	})

	const tr = new winston.transports.Stream ({stream})

	const logger = winston.createLogger ({
		transports: [tr],
		format: winston.format.printf (info => `${process.pid} ${info.message}`)
	}).enableCluster ()

	if (cluster.isPrimary) {

		logger.info ('primary 1')
		
		const workerPid = await new Promise (ok => {

			const worker = cluster.fork ()
			
			cluster.on ('disconnect', () => ok (worker.process.pid))

		})

		logger.info ('primary 2')

		return {primaryPid: process.pid, workerPid, a}

	}
	else {

		logger.info ('worker')
				
		cluster.worker.disconnect()

	}
		
}

main ().then (dump, dump)