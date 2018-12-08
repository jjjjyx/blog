'use strict'

import differenceBy from 'lodash/differenceBy'
import groupBy from 'lodash/groupBy'
import merge from 'lodash/merge'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'

import * as postApi from '../../api/posts'
import * as termApi from '../../api/terms'
import * as globalSettingApi from '../../api/global-setting'

const state = {
    posts: [],
    trashPosts: [],

    categoryList: [],
    tagList: [],
    statistics: {
        publishPostNum: 0,
        tagNum: 0,
        mediaNum: 0
    }
}

const getters = {
    selectedPost: state => state.posts.filter((item) => item._checked),
    publishPost: state => state.posts.filter((item) => item.post_status === 'publish'),
    filterPosts: state => {
        return state.posts
    }
    // publishPostNum: (state,getter) => getter.publishPost.length,
    // tagNum: state => state.tagList.length
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
    async fetchStatistics ({ commit, state }) {
        try {
            let result = await globalSettingApi.fetchAll()
            // result.forEach(i => (i._checked = false))
            commit('SET_STATISTICS', result)
        } catch (e) {
            // 失败不提示
            // this._vm.$Message.error('获取文章数据失败')
        }
    },
    async fetchPosts ({ commit, state }, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.posts.length !== 0) return
        }
        try {
            let result = await postApi.fetchAll()
            // , i.post_date = new Date(i.post_date), i.updatedAt = new Date(i.updatedAt), i.createdAt = new Date(i.createdAt), i.deleteAt = new Date(i.deleteAt)
            result.forEach(i => (i._checked = false, i._editCategory = false, i._editTag = false))
            commit('SET_POST', result)
        } catch (e) {
            this._vm.$Message.error('获取文章数据失败')
        }
    },
    // 文章的创建，修改，都在 store/modules/post.js 中
    async deletePost ({ commit, dispatch }, items) {
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await postApi.moveTrash(ids)
        commit({ type: 'removeData', key: 'posts', arr: items })
        // 更新回收站
        dispatch('fetchTrash')
    },

    async fetchTerms ({ commit, state }, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.categoryList.length !== 0 || state.tagList.length !== 0) return
        }
        try {
            let result = await termApi.fetchAll()
            result.forEach(i => (i._checked = false))
            commit('SET_TERMS', result)
        } catch (e) {
            this._vm.$Message.error('获取数据失败')
        }
    },
    async fetchTrash ({ commit, state }, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.trashPosts.length !== 0) return
        }
        try {
            let result = await postApi.fetchTrashAll()
            result.forEach(i => (i._checked = false))
            commit('SET_POST_TRASH', result)
        } catch (e) {
            this._vm.$Message.error('获取回收站数据失败')
        }
    },

    async deleteTermTag ({ commit }, items) {
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await termApi.deleteTag(ids)
        commit({
            type: 'removeData',
            key: 'tagList',
            arr: items
        })
    },
    async deleteTermCategory ({ commit, getters }, items) {
        items = checkItems(items)

        let index = items.findIndex(item => item.id === getters.defaultCategoryValue) // 检查默认分类
        if (index >= 0) {
            items.splice(index, 1)
        }
        if (!items.length) {
            this._vm.$Message.info('默认分类不可删除')
        } else {
            let ids = items.map((item) => item.id)
            await termApi.deleteCategory(ids)
            commit({ type: 'removeData', key: 'categoryList', arr: items })
        }
    },

    async deleteTrash ({ commit }, items) {
        // commit({type: 'removeData', key: 'trashPosts', arr: item})
        items = checkItems(items)
        let ids = items.map((item) => item.id)
        await postApi.deleteTrash(ids)
        commit({
            type: 'removeData',
            key: 'trashPosts',
            arr: items
        })
    },

    addTermTag ({ commit }, tag) {
        return termApi.createTag(tag).then((item) => commit({ type: 'addData', key: 'tagList', item }))
    },
    updateTermTag ({ commit }, tag) {
        return termApi.updateTag(tag).then((item) => commit({ type: 'editData', key: 'tagList', item }))
    },
    addTermCategory ({ commit }, category) {
        return termApi.createCategory(category).then((item) => commit({ type: 'addData', key: 'categoryList', item }))
    },
    updateTermCategory ({ commit }, category) {
        return termApi.updateCategory(category).then((item) => commit({ type: 'editData', key: 'categoryList', item }))
    },
    revertPost ({ commit }, item) {
        return postApi.trashRevert(item.id).then(() => commit('REMOVE_TRASH_POST', item))
    },
    clearTrashPost ({ commit }, item) {
        // 清除回收站也是调用相同的 mutations
        return postApi.deleteTrash(item.id).then(() => commit('REMOVE_TRASH_POST', item))
    },
    async updatePostsCategoryByPostId ({ commit }, { postId, category }) {
        let result = await postApi.changePostCategory(postId, category)
        commit('UPDATE_POSTS_CATEGORY_BY_POSTID', { postId, category: result })
    }
}
const mutations = {
    SET_STATISTICS (state, data) {
        merge(state.statistics, data)
    },
    SET_POST (state, data) {
        state.posts = data
    },
    SET_POST_TRASH (state, data) {
        state.trashPosts = data
    },
    // APPEND_MEDIA (state, data) {
    //     state.imgList.push(...data)
    // },
    removeData (state, { key, arr, idKey = 'id' }) {
        state[key] = differenceBy(state[key], arr, idKey)
    },
    addData (state, { key, item }) {
        state[key].push(item)
    },
    editData (state, { key, item }) {
        let index = state[key].find((i) => i.id === item.id)
        merge(index, item)
        // state[key].push(item)
    },
    SET_TERMS (state, data) {
        let { category: categoryList, post_tag: tagList } = groupBy(data, 'taxonomy')
        state.categoryList = categoryList || []
        state.tagList = tagList || []
    },
    addCategoryList (state, value) {
        state.categoryList.push(value)
    },
    REMOVE_TRASH_POST (state, value) {
        let index = state.trashPosts.indexOf(value)
        state.trashPosts.splice(index, 1)
    },
    UPDATE_POSTS_CATEGORY_BY_POSTID (state, { postId, category }) {
        let posts = find(state.posts, ['id', postId])
        let index = findIndex(posts.terms, ['taxonomy', 'category'])
        if (index > -1) {
            posts.terms.splice(index, 1, category) // 这种方式才会监视到改动
            // posts.terms[index] = category
        }

    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
