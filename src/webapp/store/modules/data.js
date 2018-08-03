'use strict'

import _ from 'lodash'
import api from '@/utils/api'
// import Vue from 'vue'
const state = {
    // user: null
    posts: [],
    trashPosts: [],

    categoryList: [],
    tagList: []
}

const getters = {
    selectedPost: state => state.posts.filter((item) => item._checked)
    // user: state => state.user
    // tagsList: state => state.termList.filter((item) => {
    //     return item.taxonomy === 'post_tag'
    // }),
    // categoryList: state => state.termList.filter((item) => {
    //     return item.taxonomy === 'category'
    // })
}

// actions
const actions = {
    async fetchPosts ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.posts.length !== 0) return
        }
        try {
            let result = await api.nget('/api/post/')
            result.forEach(i => (i._checked = false))
            commit('SET_POST', result)
        } catch (e) {
            this._vm.$Message.error('获取文章数据失败')
        }
    },
    async fetchTerms ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.categoryList.length !== 0 || state.tagList.length !== 0) return
        }
        try {
            let result = await api.nget('/api/term/')
            result.forEach(i => (i._checked = false))
            commit('SET_TERMS', result)
        } catch (e) {
            this._vm.$Message.error('获取数据失败')
        }
    },
    async fetchTrash ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.trashPosts.length !== 0) return
        }
        try {
            let result = await api.nget('/api/post/trash')
            result.forEach(i => (i._checked = false))
            commit('SET_POST_TRASH', result)
        } catch (e) {
            this._vm.$Message.error('获取回收站数据失败')
        }
    },
    del_post ({commit, state, getters, dispatch}, item) {
        // state.posts = _.differenceBy(state.posts, arr, 'id')
        commit({type: 'removeData', key: 'posts', arr: item})
        // 更新回收站
        dispatch('fetchTrash')
    },
    'del_term/tag' ({commit, state, getters, dispatch}, item) {
        commit({
            type: 'removeData',
            key: 'tagList',
            arr: item
        })
    },
    'del_term/category' ({commit, state, getters, dispatch}, item) {
        let index = item.findIndex(item => item.id === getters.defaultCategoryValue)
        if (index >= 0) {
            item.splice(index, 1)
        }
        if (!item.length) {
            this._vm.$Message.info('默认分类不可删除')
        } else {
            commit({type: 'removeData', key: 'categoryList', arr: item})
        }
    },
    'del_post/trash' ({commit, state, getters, dispatch}, item) {
        commit({type: 'removeData', key: 'trashPosts', arr: item})
    },

    'add_term/tag' ({commit, state, getters, dispatch}, item) {
        commit({type: 'addData', key: 'tagList', item})
    },
    'add_term/category' ({commit, state, getters, dispatch}, item) {
        commit({type: 'addData', key: 'categoryList', item})
    },

    'edit_term/category' ({commit, state, getters, dispatch}, item) {
        commit({type: 'editData', key: 'categoryList', item})
    },
    'edit_term/tag' ({commit, state, getters, dispatch}, item) {
        commit({type: 'editData', key: 'tagList', item})
    },
    revert_post ({commit, state, getters, dispatch}, item) {
        commit('REVERT_POST', item)
    }
}
const mutations = {
    SET_POST (state, data) {
        state.posts = data
    },
    SET_POST_TRASH (state, data) {
        state.trashPosts = data
    },
    removeData (state, {key, arr}) {
        state[key] = _.differenceBy(state[key], arr, 'id')
    },
    addData (state, {key, item}) {
        state[key].push(item)
    },
    editData (state, {key, item}) {
        let index = state[key].find((i) => i.id === item.id)
        _.merge(index, item)
        // state[key].push(item)
    },
    SET_TERMS (state, data) {
        let {category: categoryList, post_tag: tagList} = _.groupBy(data, 'taxonomy')
        state.categoryList = categoryList || []
        state.tagList = tagList || []
    },
    addCategoryList (state, value) {
        state.categoryList.push(value)
    },
    REVERT_POST (state, value) {
        let index = state.trashPosts.indexOf(value)
        state.trashPosts.splice(index, 1)
    }
    // updateCategoryValue (state, value) {
    //     state.sidebarCategoryValue = value
    // },
    // updateAddCategoryList (state, value) {
    //     state.termList.push(value)
    // }
}

export default {
    state,
    getters,
    actions,
    mutations
}
