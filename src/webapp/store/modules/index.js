'use strict'

const files = require.context('.', false, /\.js$/)
const modules = {}
// const NODE_TYPE = {}
files.keys().forEach((key) => {
    if (key === './index.js') return
    let modulename = key.replace(/(\.\/|\.js)/g, '')
    modules[modulename] = files(key).default
})

export default modules
