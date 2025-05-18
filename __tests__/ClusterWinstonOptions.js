const {ClusterWinstonOptions} = require ('..')

test ('1', () => {

	expect ({...new ClusterWinstonOptions ({})}).toStrictEqual ({
		key          : 'WorkerProcessLogMessage',
		listen       : true,
		listenerName : 'onWorkerProcessLogMessage',
	})

	{

		const o = {
			key          : '1',
			listen       : false,
			listenerName : '2',
		}
	
		expect ({...new ClusterWinstonOptions (o)}).toStrictEqual (o)

	}

	expect (() => new ClusterWinstonOptions ({key: null})).toThrow ()
	expect (() => new ClusterWinstonOptions ({key: 1})).toThrow ()
	expect (() => new ClusterWinstonOptions ({key: ''})).toThrow ()

	expect (() => new ClusterWinstonOptions ({listenerName: null})).toThrow ()
	expect (() => new ClusterWinstonOptions ({listenerName: 1})).toThrow ()
	expect (() => new ClusterWinstonOptions ({listenerName: ''})).toThrow ()

	expect (() => new ClusterWinstonOptions ({listen: 1})).toThrow ()

})