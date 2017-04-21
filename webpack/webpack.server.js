const webpack = require('webpack')
const base = require('./webpack.base')
const path = require('path')
const getEntries = require('./getEntries')
let entry = getEntries("./client/**/s.*.js",null);
console.log(entry);
module.exports = Object.assign({}, base, {
  target: 'node',
  devtool: false,
  entry,
  output: {
    path:  path.join(__dirname, '../dist'),
    filename: "[name].js",
    publicPath: '/',
    chunkFilename: '[id].[hash].js',
    libraryTarget: 'commonjs2', // !different
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    })
  ]
})
