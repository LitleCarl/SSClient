
var Request = require('request');
var _ = require('lodash');

const manager = function (baseUrl, middleware) {
    this.baseUrl = baseUrl
    this.middleware = middleware
    console.log('a new manager')
}


manager.prototype.request = function (path, method='get', params=null) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var options = {
            method: method,
            url: this.baseUrl + path,
            headers: (this.middleware && this.middleware()) || {}
        };

        console.log('header: ', options)

        if (method != 'get' && params) {
            options['form'] = params;
        }

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                resolve(info)
            }
            else {
                console.error(body)
                reject({
                    "code": 0,
                    "data": {},
                    "err": [
                        "Network Failure"
                    ]
                })
            }
        }
        Request(options, callback);
    }.bind(self))

};

exports.Manager = manager;

if (global.defaultManager) {
    exports.default = global.defaultManager
}
else {
    var defaultManager = new manager('http://api.zaocan84.com:3000')//'http://127.0.0.1:3000')
    exports.default = defaultManager
    global.defaultManager = defaultManager
}

