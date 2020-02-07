const admin = require('firebase-admin')
const serviceAccount = require(process.env.FIREBASE_ADMIN)
let firebase
module.exports = {
	init: () => {
		firebase = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: process.env.FIREBASE_DATABASE_URL,
			storageBucket: process.env.BUCKET
		})
		return true
	},
	firestore: () => firebase.firestore(),
	messaging: () => firebase.messaging(),
	auth: () => firebase.auth(),
	bucket: () => firebase.storage().bucket()
}
