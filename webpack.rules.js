const path = require('path');
module.exports = [{
    test: /\.tsx?$/,
    use: [{
        loader: 'ts-loader',
        options: {
            configFile: path.join(__dirname, 'tsconfig.json')
        }
    }]
}];