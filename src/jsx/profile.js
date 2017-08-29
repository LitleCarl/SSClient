var React = require('react');
var _ = require('lodash');
var HTTPManager = require('../../common/HTTPRequestManager.js').default;
var portfinder = require('portfinder');
var countries = require('country-list')();
var util  = require('util'), spawn = require('child_process').spawn;

const ConnectingStatus = {
    Disconnected: 0,
    Connected: 1,
    Connecting: 2
}

module.exports = class Profile extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            regions: [],
            currentServer: null,
            connecting: ConnectingStatus.Disconnected
        }
    }

    async componentDidMount() {
        let response = await HTTPManager.request('/api/users/servers', 'get');
        let data = response['data']
        let regions = data['regions'];
        var idToRegion = {};

        // MAP
        _.each(data['regions'], (r)=>{
            idToRegion[r['id']] = r
            r.servers = []
        });


        _.each(data['servers'], (s)=>{
            var region = idToRegion[s['regionId']]
            region && region.servers.push(s)
        });

        _.each(data['userRegions'], (ur)=>{
            var region = idToRegion[ur['regionId']]
            if (region) {
                region.available = true;
                _.each(region.servers, (s)=>{
                    s.password = ur.password;
                    s.currentPorts = ur.currentPorts;
                })
            }
        });
        this.setState({regions: regions})
    }

    render () {
        var self =  this;
        var currentServer = self.state.currentServer;
        return (
            <div className="container">
                <section className="hero is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                {self.props.user.email}
                            </h1>
                            <h2 className="subtitle">

                            </h2>
                        </div>
                    </div>
                </section>

                <section className="is-info">
                    <div className="hero-body">
                        <div className="container">
                            {
                                _.map(this.state.regions, function (region, index) {
                                    console.log('region:', region)
                                    return <div style={{display: 'flex', flexDirection: 'row'}} key={index}>
                                        <div style={{textAlign: 'center', flex: 1}}>
                                            <span className={`flag-icon flag-icon-${countries.getCode(region.name).toLowerCase()}`} style={{minHeight: 100,minWidth: 100}}></span>
                                        </div>
                                        <div  style={{textAlign: 'center' , flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <div className="dropdown is-hoverable">
                                                <div className="dropdown-trigger">
                                                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                                        <span>{self.state.currentServer && self.state.currentServer.regionId == region.id ? self.state.currentServer.extra : 'Select'}</span>
                                                <span className="icon is-small">
                                                  <i className="fa fa-angle-down" aria-hidden="true" />
                                                </span>
                                                    </button>
                                                </div>
                                                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                                    <div className="dropdown-content">
                                                        { region.servers.length < 1 ?
                                                                 <a href="#" className={"dropdown-item"} >
                                                                    No Server Available
                                                                </a>

                                                                : _.map(region.servers, function(s, index){

                                                                return <a href="#" className={`dropdown-item  ${self.state.currentServer == s ? "is-active" : null}`} key={index} onClick={
                                                                        ()=>{
                                                                            self.setState({currentServer: s})
                                                                        }
                                                                     }>
                                                                {s.extra}
                                                                </a>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', 'justifyContent': 'center'}}>
                                            {
                                                (()=>{
                                                    if (currentServer && currentServer.regionId == region.id) {
                                                        if (self.state.connecting == ConnectingStatus.Disconnected) {
                                                            return <a className='button' onClick={
                                                               async ()=>{
                                                                    self.setState({connecting: ConnectingStatus.Connecting})
                                                                    let port = await portfinder.getPortPromise();
                                                                    portfinder.basePort = port + 1
                                                                    process.stdout.write('current port: ' + port)
                                                                    global.currentPort = port
                                                                    //var s = require('../../lib/shadowsocks/local').createServer('150.95.147.125', 50000, port, '58133240', 'aes-256-cfb', 600000, '127.0.0.1')
                                                                    var s = require('../../lib/shadowsocks/local').createServer(currentServer.host, currentServer.currentPorts, port, currentServer.password, 'aes-256-cfb', 600000, '127.0.0.1')
                                                                    s.on("error", function(e) {
                                                                        console.log('sslocal exit:', e);
                                                                    });

                                                                    currentServer.local = s

                                                                    global.CommonEventBus.emit('Connect', port)
                                                                    setTimeout(()=>{
                                                                        self.setState({connecting: ConnectingStatus.Connected})
                                                                    }, 3000)

                                                                }
                                                            }>Connect</a>
                                                        }
                                                        else if (self.state.connecting == ConnectingStatus.Connected) {
                                                            return <a className='button' onClick={
                                                               async ()=>{
                                                                            currentServer.local && currentServer.local.close(()=>{
                                                                            });
                                                                            self.setState({connecting: ConnectingStatus.Disconnected})
                                                                            global.CommonEventBus.emit('Disconnect')
                                                                    }
                                                            }>Disconnect</a>
                                                        }
                                                        else {
                                                            return <a className='button is-loading'>Connecting</a>
                                                        }
                                                    }
                                                    else {
                                                        return null;
                                                    }
                                                })()
                                            }
                                        </div>
                                    </div>
                                })
                            }


                        </div>
                    </div>
                </section>



            </div>
        );
    }
};