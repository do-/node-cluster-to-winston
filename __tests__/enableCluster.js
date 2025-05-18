require ('winston')
const cluster = require ('node:cluster')
const {LEVEL, MESSAGE} = require ('triple-beam')
const {enableCluster,  WorkerTransport, PrimaryFormat} = require ('..')

test ('1', () => {

	{

		const a = []
		const l = {format: {transform: _ => _}, write: _ => a.push (_)}
		l.enableCluster = enableCluster

		l.enableCluster ({listen: false})

		expect (l.format).toBeInstanceOf (PrimaryFormat)
		expect (cluster.listeners ('message')).toHaveLength (0)

		l.onWorkerProcessLogMessage (null,{level: 5, WorkerProcessLogMessage: 'test'})
		l.onWorkerProcessLogMessage (null,{id: 1})

		expect (a).toStrictEqual ([{level: 5, WorkerProcessLogMessage: 'test', [LEVEL]: 5, [MESSAGE]: 'test'}])

	}

	{

		const a = []
		const l = {format: {transform: _ => _}, write: _ => a.push (_)}
		l.enableCluster = enableCluster

		l.enableCluster ({})

		expect (l.format).toBeInstanceOf (PrimaryFormat)
		expect (cluster.listeners ('message')).toHaveLength (1)
		expect (cluster.listeners ('message') [0]).toBe (l.onWorkerProcessLogMessage)

		l.onWorkerProcessLogMessage (null,{level: 5, WorkerProcessLogMessage: 'test'})
		l.onWorkerProcessLogMessage (null,{id: 1})

		expect (a).toStrictEqual ([{level: 5, WorkerProcessLogMessage: 'test', [LEVEL]: 5, [MESSAGE]: 'test'}])

	}

	{

		const l = {
			transports: [1, 2], 
			remove: function (t) {this.transports = this.transports.filter (i => i != t)}, 
			add: function (i) {this.transports.push (i)}
		}

		l.enableCluster = enableCluster

		cluster.isWorker = true

		l.enableCluster ()

		expect (l.transports).toHaveLength (1)
		expect (l.transports [0]).toBeInstanceOf (WorkerTransport)

	}

})