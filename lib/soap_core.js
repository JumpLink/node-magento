/*
 * Copyright by and autor: qzaidi https://gist.github.com/qzaidi
 * Source: https://gist.github.com/1289509
 */
var soap = require('soap');

module.exports = function(config) {
		var config = config;
		var url = 'http://' + config.host + config.soapv1_path;
		var authentication = {user: config.login, pass: config.pass};
		
	return soapv1 = {

		client : {},

		init: function(cb) {
			var self = this;
			soap.createClient(url, function(err, client) {
				self.client = client;
				self._discover(cb);
				console.log("init");
				return this;
			});
		},

		login: function(next) {
			var self = this;
			self.client.login({user: config.login, pass: config.pass}, function(err, result) {
				if (err)
					console.log("Login Error: " + err);
				else {
					//var sessionId = result.loginReturn;
					console.log('session-id:' + result.loginReturn + ' on host: ' + config.host );
					self.client.sessionId = result.loginReturn;
					next();
				}
			});
		},

		end: function(cb) {
			console.log("end");
			var client = this.client;
			client.methodCall('endSession', [ client.sessionId ], cb); //TODO
		},

		_xcall: function(api,apiargs) {
			var self = this;
			var client = self.client;
			console.log(util.inspect(apiargs));
			var args = Array.prototype.slice.call(apiargs);
			var callback = args.pop();
			var next = function() {
				
				client.call({sessionId:client.sessionId, resourcePath:api,  args:args}, function(err, res) {
					if (err) {
						// try logging in again TODO check error faultCode
/*						if (err && client.sessionId) {
							client.sessionId = undefined;
							return self._xcall(api,apiargs);
						}*/
					}
					callback(err,res);
				});
			};
			if (client.sessionId === undefined)
				self.login(next);
			else
				next();
		},


		_call: function(apiargs) {
			var args = Array.prototype.slice.call(apiargs);
			var callback = args.pop();
			var api = args.shift();
			var client = this.client;
			client.call({sessionId: client.sessionId, resourcePath: api, args: args}, callback);
		},

		_discover: function(cb) {
			var self = this;
			var client = self.client;
			var next = function() {
				client.resources({sessionId: client.sessionId}, function(err, result) {
					if (!err) {
						var resources = result.resourcesReturn.item;
						for (var j =0; j < resources.length; j++) {
							var resource = resources[j];
							var methods = resource.item[4].value.item;
							for (var i = 0; i < methods.length; i++) {
								var path = methods[i].item[2].value;
								var title = methods[i].item[0].value; // TODO
								self.define(path);
							}
						}
						cb(null);
					} else {
						console.log("an error occured " + err);
						cb(err);
					}
				});
			};

			if (client.sessionId === undefined)
				self.login(next);
			else
				next();
		},

		call: function() {
			console.log("call called with arguments " + arguments);

			var self = this;
			var client = self.client;
			var apiargs = arguments;

			var next = function() {
				self._call(apiargs);
			};
			if (client.sessionId === undefined)
				self.login(next);
			else
				next();
		},

		define: function(apiname) {
			var obj = this;
			apis = apiname.split('.');
			if (obj[apis[0]] === undefined)
				obj[apis[0]] = {};
			obj[apis[0]][apis[1]] = function() {
				console.log('calling xcall for ' + apiname + '(' + arguments[0] + '...);');
				obj._xcall.call(obj, apiname, arguments );
			};
		}
	};
};