var React = require('react');
var ReactDOM = require('react-dom');
var SignIn = require('./jsx/signin.js')
var fs = require('fs')

const Components = exports.components = {

};

function platformInitialize() {
    let platform = process.platform;
    if (platform == 'darwin') {
        var sudo = require('sudo-prompt');
        var options = {
            name: 'SSClient'
        };

        fs.exists('/Library/Application Support/SSClient/proxy_conf_helper', function(exist) {
           if (!exist) {
               sudo.exec('sudo mkdir -p "/Library/Application Support/SSClient/"' +
                   ' && sudo cp ./shadowsocks/proxy_conf_helper "/Library/Application Support/SSClient/"' +
                   ' && sudo chown root:admin "/Library/Application Support/SSClient/proxy_conf_helper"' +
                   ' && sudo chmod a+rx "/Library/Application Support/SSClient/proxy_conf_helper" ' +
                   ' && sudo chmod +s "/Library/Application Support/SSClient/proxy_conf_helper"', options,
                   function(error, stdout, stderr) {
                       if (error) throw error;
                       console.log('stdout: ' + stdout);
                   }
               );
           }
        });
    }
}

if (pageRoute == 'signin') {
    ReactDOM.render(
        <div>
            <SignIn/>
        </div>
        ,
        document.getElementById('root')
    );
}
