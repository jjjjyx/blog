'use strict'

import _ from 'lodash'
import api from '@/utils/api'
// import Vue from 'vue'
const state = {
    // user: null
    list: [],
    trash: []
}

const getters = {
    selectedPost: state => state.list.filter((item) => item._checked)
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
            if (state.list.length !== 0) return
        }
        try {
            let result = await api.nget('/api/post/')
            result.forEach(i => (i._checked = false))
            commit('SET_POST', result)
        } catch (e) {
            this._vm.$Message.error('获取文章数据失败')
        }
    },
    async trashPosts ({commit, state, getters, dispatch}, item) {
        // console.log(this.multipleSelection)
        let ids
        if (item) {
            ids = [item.id]
        } else {
            ids = getters.selectedPost.map(i => (i.id))
        }
        try {
            await api.npost('/api/post/trash', {ids})
            commit('removePosts', item ? [item] : getters.selectedPost)
            // 更新回收站
            dispatch('fetchTrash')
            // if (item) {
            //     let index = _.findIndex(this.data, ['id', item.id])
            //     // this.data.splice(index, 1)
            // } else {
            //     // this.data = _.differenceBy(this.data, this.selectedList, 'id')
            // }
        } catch (e) {
            this._vm.$Message.error('删除失败！')
        }
    },
    async fetchTrash ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.trash.length !== 0) return
        }
        try {
            let result = await api.nget('/api/post/trash')
            result.forEach(i => (i._checked = false))
            commit('SET_POST_TRASH', result)
        } catch (e) {
            this._vm.$Message.error('获取回收站数据失败')
        }
    }
}
const mutations = {
    SET_POST (state, data) {
        state.list = data
    },
    SET_POST_TRASH (state, data) {
        state.trash = data
    },
    removePosts (state, arr) {
        state.list = _.differenceBy(state.list, arr, 'id')
    },
    revertTrashPosts (state, arr) {
        state.trash = _.differenceBy(state.trash, arr, 'id')
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
