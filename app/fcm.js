const messaging = require('util/firebase').messaging()
const _ = require('lodash')
function toString(o) {
	try {
		Object.keys(o || {}).forEach(k => {
			if (typeof o[k] === 'object') return toString(o[k])
			o[k] = '' + o[k]
		})
	} catch (e) {
		console.log(e)
	} finally {
		return o
	}
}

module.exports = {
	/**
	 * d : Object
	 * {
	 * 		tokens:'fcmtoken',
	 * 		title:'notification title',
	 * 		body:'notification body',
	 * }
	 */
	sendMessage: async d => {
		let results = []
		try {
			d = JSON.parse(JSON.stringify(d).replace(/"\s+|\s+"/g, '"'))
			d = toString(d)
			if (!d.title || !d.body) throw new Error('title and body is required')
			if (!d.tokens || d.tokens.length == 0) throw new Error('tokens is required')
			if (!Array.isArray(d.tokens)) throw new Error('tokens should be array of string')
			d.tokens = d.tokens.filter(e => e)
			if (d.tokens.length == 0) throw new Error('tokens is required')
			d.tokens = _.flatten(d.tokens)
			d.tokens = _.uniq(d.tokens)
			d.tokens = d.tokens.filter(e => e)
			if (d.tokens.length == 0) return
			let p = {
				title: d.title,
				body: d.body.replace(/\t/g, ''),
				icon: d.icon || 'ic_stat_name',
				color: '#d9bd62',
				screen: d.screen || 'Home'
			}
			let payload = {
				notification: {
					...p
				},
				data: {...p}
			}
			if (d.data) payload.data = d.data
			while (d.tokens) {
				let cc = await messaging.sendToDevice(d.tokens.splice(0, 1000), payload)
				results.push(cc)
			}
		} catch (e) {
			//console.log(e)
		} finally {
			return results
		}
	}
}
