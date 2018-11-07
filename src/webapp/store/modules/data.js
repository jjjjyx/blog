'use strict'

import differenceBy from 'lodash/differenceBy'
import groupBy from 'lodash/groupBy'
import merge from 'lodash/merge'

import * as post from '../../api/posts'
import * as term from '../../api/terms'

const state = {

    posts: [],
    trashPosts: [],

    categoryList: [],
    tagList: []

}

const getters = {
    selectedPost: state => state.posts.filter((item) => item._checked)
}

function checkItems (items) {
    if (!(items instanceof Array)) {
        items = [items]
    }
    if (items.length === 0) {
        return []
    }
    return items
}

// actions
const actions = {
    async fetchPosts ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.posts.length !== 0) return
        }
        try {
            let result = await post.fetchAll()
            result.forEach(i => (i._checked = false))
            commit('SET_POST', result)
        } catch (e) {
            this._vm.$Message.error('获取文章数据失败')
        }
    },
    // 文章的创建，修改，都在 store/modules/post.js 中
    async deletePost ({commit, dispatch}, items) {
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await post.moveTrash(ids)
        commit({type: 'removeData', key: 'posts', arr: items})
        // 更新回收站
        dispatch('fetchTrash')
    },

    async fetchTerms ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.categoryList.length !== 0 || state.tagList.length !== 0) return
        }
        try {
            let result = await term.fetchAll()
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
            let result = await post.fetchTrashAll()
            result.forEach(i => (i._checked = false))
            commit('SET_POST_TRASH', result)
        } catch (e) {
            this._vm.$Message.error('获取回收站数据失败')
        }
    },

    async deleteTermTag ({commit}, items) {
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await term.deleteTag(ids)
        commit({
            type: 'removeData',
            key: 'tagList',
            arr: items
        })
    },
    async deleteTermCategory ({commit, getters}, items) {
        items = checkItems(items)

        let index = items.findIndex(item => item.id === getters.defaultCategoryValue) // 检查默认分类
        if (index >= 0) {
            items.splice(index, 1)
        }
        if (!items.length) {
            this._vm.$Message.info('默认分类不可删除')
        } else {
            let ids = items.map((item) => item.id)
            await term.deleteCategory(ids)
            commit({type: 'removeData', key: 'categoryList', arr: items})
        }
    },

    async deleteTrash ({commit}, items) {
        // commit({type: 'removeData', key: 'trashPosts', arr: item})
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await post.deleteTrash(ids)
        commit({
            type: 'removeData',
            key: 'trashPosts',
            arr: items
        })
    },

    addTermTag ({commit}, tag) {
        return term.createTag(tag).then((item) => commit({type: 'addData', key: 'tagList', item}))
    },
    updateTermTag ({commit}, tag) {
        return term.updateTag(tag).then((item) => commit({type: 'editData', key: 'tagList', item}))
    },
    addTermCategory ({commit}, category) {
        return term.createCategory(category).then((item) => commit({type: 'addData', key: 'categoryList', item}))
    },
    updateTermCategory ({commit}, category) {
        return term.updateCategory(category).then((item) => commit({type: 'editData', key: 'categoryList', item}))
    },
    revertPost ({commit}, item) {
        return post.trashRevert(item.id).then(() => commit('REMOVE_TRASH_POST', item))
    },
    clearTrashPost ({commit}, item) {
        // 清除回收站也是调用相同的 mutations
        return post.deleteTrash(item.id).then(() => commit('REMOVE_TRASH_POST', item))
    }
}
const mutations = {
    SET_POST (state, data) {
        state.posts = data
    },
    SET_POST_TRASH (state, data) {
        state.trashPosts = data
    },
    // APPEND_MEDIA (state, data) {
    //     state.imgList.push(...data)
    // },
    removeData (state, {key, arr, idKey = 'id'}) {
        state[key] = differenceBy(state[key], arr, idKey)
    },
    addData (state, {key, item}) {
        state[key].push(item)
    },
    editData (state, {key, item}) {
        let index = state[key].find((i) => i.id === item.id)
        merge(index, item)
        // state[key].push(item)
    },
    SET_TERMS (state, data) {
        let {category: categoryList, post_tag: tagList} = groupBy(data, 'taxonomy')
        state.categoryList = categoryList || []
        state.tagList = tagList || []
    },
    addCategoryList (state, value) {
        state.categoryList.push(value)
    },
    REMOVE_TRASH_POST (state, value) {
        let index = state.trashPosts.indexOf(value)
        state.trashPosts.splice(index, 1)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
