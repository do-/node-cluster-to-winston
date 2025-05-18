const {execSync} = require ('node:child_process')
const path = require ('node:path')

test ('1', () => {

    const {primaryPid, workerPid, a} = JSON.parse (execSync (`node ${path.join (__dirname, '..', '___tests___', '1.js')}`).toString ())

	expect (a [0]).toMatch (`${primaryPid} primary 1`)
	expect (a [1]).toMatch (`${workerPid} worker`)
	expect (a [2]).toMatch (`${primaryPid} primary 2`)

})