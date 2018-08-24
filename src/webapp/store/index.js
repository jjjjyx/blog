'use strict'

import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import modules from './modules'
import {mutations} from './mutations.js'
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'
import {homeRouter} from '../router/router'
Vue.use(Vuex)

const state = {
    // 全局
    dict: {},
    site: [],
    siteMap: {},
    breadCrumbList: [],
    homeRouter,
}
const getters = {
    postStatusDict: state => state.dict.postStatus,
    imgSpaces: state => state.dict.img,
    defaultCategoryValue: state => _.toNumber(state.siteMap['defaultCategoryId'].value)
}
const debug = process.env.NODE_ENV !== 'production'
const plugins = [createPersistedState({
    filter: ({type}) => {
        return type !== 'APPEND_MEDIA';
    }
})]

if (debug) {
    plugins.push(createLogger())
}
export default new Vuex.Store({
    strict: debug,
    actions,
    getters,
    state,
    mutations,
    modules,
    plugins
})
