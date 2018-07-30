'use strict'

// import _ from 'lodash'
import api from '@/utils/api'
// import Vue from 'vue'
const state = {
    // user: null
    // termList: [],
    categoryList: [],
    tagList: []
}

const getters = {
    // user: state => state.user
    // categoryList: state => state.termList.filter((item) => {
    //     return item.taxonomy === 'category'
    // }),
    selectedCategory: state => state.categoryList.filter((item) => item._checked),
    selectedTags: state => state.tagList.filter((item) => item._checked)
}

// actions
const actions = {
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
    }
}
const mutations = {
    SET_TERMS (state, data) {
        // let {tagsList
        //     categoryList}

        let {category: categoryList, post_tag: tagList} = _.groupBy(data, 'taxonomy')

        state.categoryList = categoryList || []
        state.tagList = tagList || []
    },
    addCategoryList (state, value) {
        state.categoryList.push(value)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
