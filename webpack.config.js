var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve(__dirname, 'public', 'javascripts'),
        library: 'MLib'
    },
    module: {
        noParse: /node_modules\/os-proxy\/index\.js/,
        loaders: [
            {
                test: /\.jsx|js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.js', '.jsx', '.node']
    },
    target: 'node-webkit',
    node: {
        '__dirname': true
    }
};
