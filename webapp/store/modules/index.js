'use strict'
import { hyphenToHump } from '../../utils/common'

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
    if (key === './index.js') return
    let moduleName = hyphenToHump(key.replace(/(\.\/|\.js)/g, ''))
    modules[moduleName] = files(key).default
})

export default modules
