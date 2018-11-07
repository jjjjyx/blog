'use strict'

const files = require.context('.', false, /\.vue$/)
const modules = {}

files.keys().forEach((key) => {
    if (key === './sidebar.vue') return
    let modulename = key.replace(/(\.\/|\.vue)/g, '')
    modules[modulename] = files(key).default
})

export default modules
