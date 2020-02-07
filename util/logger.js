const { format, createLogger, transports } = require('winston')
const util = require('util')
const logger = (module.exports = createLogger({
	format: format.combine(
		//format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        //format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        format.printf(info => `${info.level}: ${info.message}`),
        format.colorize({all:true}),
	),
	transports: [new transports.Console()],
}))

function formatArgs(args) {
	return [util.format.apply(util.format, Array.prototype.slice.call(args))]
}
console.log = function() {
	logger.info.apply(logger, formatArgs(arguments))
}
console.info = function() {
	logger.info.apply(logger, formatArgs(arguments))
}
console.warn = function() {
	logger.warn.apply(logger, formatArgs(arguments))
}
console.error = function() {
	logger.error.apply(logger, formatArgs(arguments))
}
console.debug = function() {
	logger.debug.apply(logger, formatArgs(arguments))
}