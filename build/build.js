require('shelljs/global')
console.log(env);
env.NODE_ENV = 'production'


var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
