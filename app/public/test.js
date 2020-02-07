const moment = require('moment')
const helper = require('util/helper')
module.exports = {
	ping: async ctx => {
		let {user} = ctx
		return 'pong'
	}
}
