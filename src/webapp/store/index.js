'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import modules from './modules'
import {mutations} from './mutations.js'

Vue.use(Vuex)

const state = {
    // 全局
    dict: {},
    site: [],
    siteMap: {}
}
const getters = {
    postStatusDict: state => state.dict.postStatus,
    defaultCategoryValue: state => _.toNumber(state.siteMap['defaultCategoryId'].value)
}
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    strict: debug,
    // actions,
    getters,
    state,
    mutations,
    modules,
    plugins: debug ? [createLogger()] : []
})
