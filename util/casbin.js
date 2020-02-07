const casbin = require('casbin')
const MongooseAdapter = require('@elastic.io/casbin-mongoose-adapter')

let enforcer, adapter
module.exports = {
	init: async () => {
		let {DB_USER, DB_NAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_AUTH, CASBIN_MODEL} = process.env
		const dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH}`
		const dbOptions = {useNewUrlParser: true, useCreateIndex: true}
		adapter = await MongooseAdapter.newAdapter(dbUri, dbOptions)
		enforcer = await casbin.newEnforcer(CASBIN_MODEL, adapter)
		return true
	},
	getEnforcer: () => {
		return enforcer
	},
	hasAccess:async (user, path, method) => {
		console.log(user, path, method)
		return await enforcer.enforce(user, path, method)
	},
	reload: async () => {
		await enforcer.loadPolicy()
		return {
			group: module.exports.getAllGroups(),
			users: module.exports.getAllUsers()
		}
	},
	//auto save to db and memory
	addGroup: async (name, path) => {
		return await enforcer.addPolicy(name, path, '*')
	},
	//auto save to db and memory
	removeGroup: async (name, path) => {
		return await enforcer.removePolicy(name, path, '*')
	},
	//auto save to db and memory
	addUserToGroup: async (userId, groupName) => {
		return await enforcer.addGroupingPolicy(userId, groupName)
	},
	//auto save to db and memory
	removeUserFromGroup: async (userId, groupName) => {
		await enforcer.removeGroupingPolicy(userId, groupName)
	},
	isExistsInGroup: async (userId, groupName) => {
		return await enforcer.hasNamedGroupingPolicy('g',userId, groupName)
	},

	getAllUsers: () => {
		return enforcer.getGroupingPolicy()
	},
	getAllGroups: () => {
		return enforcer.getPolicy()
	}
}
