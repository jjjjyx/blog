'use strict'

// import _ from 'lodash'
import api from '@/utils/api'
// import Vue from 'vue'
const state = {
    // user: null
    termList: [],
    categoryList: [],
    tagList: []
}

const getters = {
    // user: state => state.user
    categoryList: state => state.termList.filter((item) => {
        return item.taxonomy === 'category'
    })
}

// actions
const actions = {
    async fetchTerms ({commit, state}, force = true) {
        if (!force) {
            // 不是强制的则判断当期是否有值，
            if (state.termList.length !== 0) return
        }
        try {
            let result = await api.nget('/api/term/')
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
    updateAddCategoryList (state, value) {
        state.termList.push(value)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
