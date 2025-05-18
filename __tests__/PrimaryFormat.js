const {MESSAGE} = require ('triple-beam')
const {PrimaryFormat} = require ('..')

test ('1', () => {

	const format = {transform: _ => _}, key = 'the_message'

	const pf = new PrimaryFormat ({format, key})

	expect (pf.transform ({level: 'info', 'the_message': '1'})).toStrictEqual ({level: 'info', 'the_message': '1', [MESSAGE]: '1'})

	expect (pf.transform ({id: 2})).toStrictEqual ({id: 2})

})