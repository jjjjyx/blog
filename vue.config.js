const path = require('path')

function resolve (dir) {
	return path.join(__dirname, dir)
}
const entrys = ['home', 'about', 'archives', 'article', 'category', 'tags']

module.exports = {
    pages: {
    	admin: {
    		// 入口js的路径
    		entry: './webapp/admin',
    		// 页面模板路径
    		template: './static/admin.html',
            filename: 'jyx-admin/admin.html'
    	}
    },

    chainWebpack: (config) => {
        entrys.forEach((entry)=>{
            config.entry(entry).add(`./webapp/${entry}.js`).end()
        })

        config.output.filename('js/[name].js')
		// config.resolve.alias.set('@view', resolve('src/view'))
		config.resolve.alias.set('@', resolve('webapp'))
        // config.optimization.runtimeChunk({name: 'runtime'})
        // vendors: {
        //     name: `chunk-vendors`,
        //         test: /[\\/]node_modules[\\/]/,
        //         priority: -10,
        //         chunks: 'initial'
        // },
        // common: {
        //     name: `chunk-common`,
        //         minChunks: 2,
        //         priority: -20,
        //         chunks: 'initial',
        //         reuseExistingChunk: true
        // }
        config.optimization.splitChunks({cacheGroups: {}})
	},

    lintOnSave: undefined,
    baseUrl: undefined,
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: false,
    parallel: undefined,

    filenameHashing: false
}
