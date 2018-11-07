'use strict'

import toNumber from 'lodash/toNumber'
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import modules from './modules'
import { mutations } from './mutations.js'
import * as actions from './actions'
import { homeRouter } from '../router/menus'

Vue.use(Vuex)

const state = {
    // 全局
    dict: {
        postStatus: {
            'draft': '草稿',
            'auto-draft': '自动草稿',
            'pending': '等待复审',
            // INHERIT: 'inherit',
            'publish': '发布'
        },
        status: {
            'open': '打开',
            'close': '关闭'
        },
        taxonomy: {
            'category': '分类',
            'nav_menu': '导航',
            'post_tag': '标签'
        },
        site: {
            'yes': 'yes',
            'no': 'no'
        },
        img: {
            'all': '所有',
            'public': '公共区域',
            'cover': '封面',
            'post': '文章插图',
            'avatar': '头像'
        },
        sidebar: {
            'about': '关于博主',
            'hot': '热门文章',
            'chosen': '精选文章',
            'category': '分类',
            'tags': '标签',
            'newest': '最新文章',
            'archives': '归档',
            'search': '搜索'
        },
        role: {
            0: '游客',
            1: '普通用户',
            100: '超级管理员'
        }
    },
    site: [],
    siteMap: {},
    language: localStorage.getItem('local') || 'zh-CN',
    breadCrumbList: [],
    homeRouter
}
const getters = {
    postStatusDict: state => state.dict.postStatus,
    imgSpaces: state => state.dict.img,
    defaultCategoryValue: state => toNumber(state.siteMap['defaultCategoryId'].value)
}
const debug = process.env.NODE_ENV !== 'production'
const plugins = []
    // [createPersistedState({
    //     filter: ({type}) => {
    //         return type !== 'APPEND_MEDIA'
    //     }
    // })]

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
