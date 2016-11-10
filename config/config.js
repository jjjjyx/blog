module.exports = {
    DB_HOST: 'localhost',
    DB_NAME: 'blog',
    DB_USER: 'blog',
    DB_PASS: '123',
    DB_PRE: '',
    APP_PORT: '3000',

    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../client/dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../client/dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: require('./dev.env'),
        port: 3000,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
};
