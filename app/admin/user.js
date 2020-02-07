let casbin = require('util/casbin')
const User = require('model/User')
const _ = require('lodash')
module.exports = {
	ping: async ctx => {
		return 'pong'
	},
	register: async ctx => {
		let {fcm_token, uid, email} = ctx.headers
		let user = await User.findOne({email})
		if (!user) {
			let newUser = await new User({uid, email}).save()
			return newUser._id
		}
		user.uid = uid || user.uid
		user.fcmToken = fcm_token || user.fcmToken
		let w = await user.save()
		return user._id
	}
}
