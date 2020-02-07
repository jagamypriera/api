require('dotenv').config()
require('app-module-path').addPath(__dirname)
require('util/logger')

async function start() {
	try {
		await require('util/firebase').init()
		console.warn('Firebase initialized')

		await require('util/casbin').init()
		console.warn('Casbin role manager initialized')

		await require('util/database')
		console.warn('Database initialized')

		await require('util/server').init()
		console.warn('Server started')
	} catch (e) {
		console.error(e)
	}
}
start()
