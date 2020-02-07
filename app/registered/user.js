const User = require('model/User')
const fcm = require('app/fcm')
module.exports = {
	ping: async ctx => {
		return 'pong'
	},
	testFcm: async ctx => {
		let {tokens} = ctx.request.body
		fcm.sendMessage({title: 'title', body: 'body', tokens: tokens})
	}
}
