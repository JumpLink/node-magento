module.exports = function(config) {
	return {
		soap: require('./soap.js')(config),
		xmlrpc: require('./xmlrpc.js')(config)
	}
}