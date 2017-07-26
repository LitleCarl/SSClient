var React = require('react');
var _ = require('lodash')
module.exports = class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "dd",
            password: ''
        }
    }

    requestSignIn() {
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
                                                    <button className="button is-primary">登录</button>
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