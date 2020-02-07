'use strict'

const Koa = require('koa')
const app = new Koa()
const fs = require('fs')
const moment = require('moment')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const UserController = require('app/admin/user')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const auth = require('util/firebase').auth()
const md5 = require('md5')
const dirTree = require('directory-tree')
const compress = require('koa-compress')
const _ = require('lodash')
module.exports = {
	init: async () => {
		const tree = dirTree('app', {extensions: /\.js$/})
		let modules = []
		let apis = ['API list']
		function fill(children) {
			children.forEach(child => {
				if (child.extension) {
					let data = {
						path: child.path,
						module: false
					}
					try {
						data.module = require(child.path)
						let thePath = data.path.replace('.js', '').split('app/')[1]
						_.keys(data.module).map(e => apis.push(`http://localhost:${process.env.PORT}/${thePath}/${e}`))
						console.log('module loaded=>', data.path)
					} catch (e) {
						console.error(e.message)
					}
					modules.push(data)
				}
				if (child.children) fill(child.children)
			})
		}
		fill(tree.children)
		console.log(apis.join('\n'))
		router.all('/:app/:module/:method*', async ctx => {
			ctx.compress = true
			if (ctx.response.status == 403) {
				const user = ctx.user.username
				ctx.body = {success: false, message: `${user} doesn't have access to ${ctx.path}`}
				return
			}
			let reqApp = ctx.params.app
			let reqModule = ctx.params.module
			let reqMethod = ctx.params.method
			let file = `app/${reqApp}/${reqModule}.js`
			let mod = modules.find(e => e.path == file)
			try {
				let key = {
					url: ctx.request.url,
					...ctx.request.body
				}
				ctx.request.header.cacheKey = md5(JSON.stringify(key))
				if (!mod) throw new Error('module not found')
				if (!mod.module[reqMethod]) throw new Error(`method ${ctx.request.url} not found`)
				ctx.request.body = JSON.parse(JSON.stringify(ctx.request.body).replace(/"\s+|\s+"/g, '"'))
				let data = await mod.module[reqMethod](ctx)
				ctx.body = {success: true, data: data}
			} catch (e) {
				console.error(e)
				let message = e.message
				if (e.name === 'ValidationError') {
					message = e
						.toString()
						.replace('ValidationError: ', '')
						.split(',')
						.join('\n')
				}
				ctx.body = {success: false, message: message}
			} finally {
				let rt = Date.now() - ctx.state.start
				console.log(`${ctx.method} ${ctx.url} - ${rt}ms`)
			}
		})
		app
			.use(koaBody({multipart: true}))
			.use(bodyParser({formLimit: '10mb'}))
			.use(async (ctx, next) => {
				let isPublic = ctx.request.url.startsWith('/public/')
				let {idtoken, uid} = ctx.headers
				ctx.state.start = Date.now()
				try {
					if (isPublic) {
						ctx.user = 'guest'
						await next()
					} else {
						if (!idtoken || !uid) throw new Error('idtoken and uid are required')
						let verify = await auth.verifyIdToken(idtoken)
						let uidResponse = verify.uid
						ctx.request.header.email = verify.email
						if (uidResponse && uidResponse == uid) {
							let user = await UserController.register(ctx)
							ctx.user = user
							await next()
						} else throw new Error('error auth: user invalid')
					}
				} catch (e) {
					console.warn(`${ctx.method} ${ctx.url} ${e.message}`)
					if (e.message.includes('Firebase ID token has expired')) e.message = 'retry'
					ctx.body = {success: false, message: e.message}
				}
			})
			.use(async (ctx, next) => {
				let isPublic = ctx.request.url.startsWith('/public/')
				let isRegistered = ctx.request.url.startsWith('/registered/')
				if (isPublic || isRegistered) {
					await next()
					return
				}
				const user = ctx.user
				const {path} = ctx
				const hasAccess = await UserController.hasAccess(ctx)
				console.log(user, 'allowed=>', hasAccess, 'path=>', path)
				if (hasAccess) await next()
				else ctx.body = {success: false, message: `${user} doesn't have access to ${path}`}
			})

			.use(router.routes(), router.allowedMethods())
			.listen(process.env.PORT, () => console.warn(`App listening on port ${process.env.PORT}!`))
	}
}
