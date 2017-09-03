/* eslint-disable */

/* eslint comma-dangle: ["error",
 {"functions": "never", "arrays": "only-multiline", "objects":
 "only-multiline"} ] */

const webpack = require('webpack');
const pathLib = require('path');

const devBuild = process.env.NODE_ENV !== 'production';

const config = {
    entry: [
        'es5-shim/es5-shim',
        'es5-shim/es5-sham',
        './app/babel-polyfill',
        './app/bundles/Lesson/startup/registration',
    ],

    output: {
        filename: 'webpack-bundle.js',
        path: pathLib.resolve(__dirname, '../app/assets/webpack'),
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
          wavesurfer: require.resolve('wavesurfer.js')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
          WaveSurfer: 'wavesurfer.js'
        }),
        new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    ],
    module: {
        rules: [
            {
                test: require.resolve('react'),
                use: {
                    loader: 'imports-loader',
                    options: {
                        shim: 'es5-shim/es5-shim',
                        sham: 'es5-shim/es5-sham',
                    }
                },
            },
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=./images/[name].[ext]' },
        ],
    },
};

module.exports = config;

if (devBuild) {
    console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
    module.exports.devtool = 'eval-source-map';
} else {
    console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}
