'use strict'
const mongoose = require('mongoose')
let {DB_USER, DB_NAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_AUTH} = process.env
let uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH}`
let options = {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true}
module.exports = mongoose.connect(uri, options).then(res => {
	return true
})
