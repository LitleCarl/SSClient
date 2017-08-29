var React = require('react');
var _ = require('lodash');
var portfinder = require('portfinder');
var HTTPManager = require('../../common/HTTPRequestManager.js').default;
const SharedContext = require('../../common/SharedContext.js')
module.exports = class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "cjx5813@foxmail.com",
            password: '58133240'
        }
    }

    async requestSignIn() {
        let data = await HTTPManager.request('/api/users/signin', 'post', {email: this.state.email, password: this.state.password})
        console.log('data:', data)

        if (data['code'] == 1) {
            HTTPManager.middleware = ()=>{
                return {'x-token': data['data']['token']}
            };

            global.SharedInfo = {user: data['data']['user']};
            var gui = require('nw.gui');
            gui.Window.open('profile.html', {}, function (new_win) {
                // do something with the newly created window
            });
        }

        //var util  = require('util'), spawn = require('child_process').spawn;
        //let port = await portfinder.getPortPromise();
        //console.log('port at:' , port)
        ////var s = require('../../lib/shadowsocks/local').createServer('150.95.147.125', 50000, port, '58133240', 'aes-256-cfb', 600000, '127.0.0.1')
        //var s = require('../../lib/shadowsocks/local').createServer('127.0.0.1', 8222, port, '58133240', 'aes-256-cfb', 600000, '127.0.0.1')
        //s.on("error", function(e) {
        //    console.log('sslocal exit:', e);
        //    return process.stdout.on('drain', function() {
        //        return process.exit(1);
        //    });
        //});

        //var command = spawn('/Library/Application Support/SSClient/proxy_conf_helper', ['--mode', 'global', '--port', port]);

    }
    render() {
        var self = this;
        return (
            <div>
                <section className="hero is-medium">
                    <div className="hero-body">
                        <div className="container has-text-centered" >

                            <div className="card" style={{maxWidth: '680px', display:'inline-block'}}>

                                <div className="card-content">
                                    <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width={112} height={28} />
                                    <br/>
                                    <br/>

                                        <div>

                                            <div className="field">
                                                <p className="control has-icons-left has-icons-right">
                                                    <input className="input" type="email" placeholder="邮箱" name="email" value={self.state.email} onChange={(e)=>{
                                                    self.setState({email: e.target.value})
                                                }} />
                                                <span className="icon is-small is-left">
                                                  <i className="fa fa-envelope" />
                                                </span>

                                                </p>
                                            </div>
                                            <div className="field">
                                                <p className="control has-icons-left">
                                                    <input className="input" type="password" placeholder="密码" name="password"  value={self.state.password} onChange={(e)=>{
                                                    self.setState({password: e.target.value})
                                                }}/>
                                                <span className="icon is-small is-left">
                                                  <i className="fa fa-lock" />
                                                </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="field has-text-centered" style={{'marginTop': 20}}>
                                            <div className="level">
                                                <div className="level-left">
                                                    <button className="button is-primary" onClick={self.requestSignIn.bind(self)}>登录</button>
                                                </div>
                                                <div className="level-right">
                                                    <button className="button" >注册</button>
                                                </div>
                                            </div>


                                        </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <section>

                </section>
            </div>
        );
    }
};