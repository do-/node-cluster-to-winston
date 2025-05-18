require ('winston')
const {LEVEL, MESSAGE} = require ('triple-beam')

test ('1', () => {


	const a = []
	global.process = {send: _ => a.push (_)}
	const {WorkerTransport} = require ('..')
	const tr = new WorkerTransport ({key: 'WorkerProcessLogMessage'})
	let cnt = 0
	const cb = () => cnt ++

	tr.log ({[LEVEL]: 1, [MESSAGE]: 'test'}, cb)

	expect (cnt).toBe (1)

	expect (a).toStrictEqual ([
		{[LEVEL]: 1, [MESSAGE]: 'test', level: 1, 'WorkerProcessLogMessage': 'test'}
	])

})