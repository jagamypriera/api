let mongoose = require('mongoose')
let Schema = mongoose.Schema

let TheScheme = new Schema(
	{
		email: {type: String, unique: true},
		uid: {type: String, unique: true},
		fcmToken: String,
	},
	{
		timestamps: true
	}
)

module.exports = mongoose.model('User', TheScheme)
