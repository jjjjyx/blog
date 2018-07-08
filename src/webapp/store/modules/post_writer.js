'use strict'

import _ from 'lodash'
import api from '@/utils/api'
// import Vue from 'vue'

const POST_WRITER_STATUS = {
    normal: '',
    save: '已保存',
    saveing: '保存中',
    edit: '已修改 - 未保存',
    auto_draft: '自动草稿'
}

const state = {
    'id': 0,
    'comment_status': 'open',
    'ping_status': 'open',
    'menu_order': '0',
    'post_type': 'post',
    'comment_count': '0',
    'seq_in_nb': '0',
    'post_author': null,
    'post_content': '',
    'post_title': '',
    'post_excerpt': '',
    'post_status': 'auto-draft',
    'post_name': '',
    'guid': '',
    'render_value': '',

    user: {},
    terms: [], // 标签 + 分类
    tags: [], // 标签 用作回填
    categoryValue: null, // 分类
    revision: [], // 历史版本
    status: POST_WRITER_STATUS.normal
    // sidebarCategoryValue: 1
}

const copyPost = _.cloneDeep(state)

const getters = {
    categoryValue: (state, getters) => state.categoryValue || getters.defaultCategoryValue,
    // 在离开的时候是否显示提示
    // 仅在保存中， 编辑 状态时提示
    showLeaveTip: state => state.status === POST_WRITER_STATUS.saveing || state.status === POST_WRITER_STATUS.edit

    // user: state => state.user
}

// actions
const actions = {
    async createNewPost ({commit, state}) {
        try {
            let result = await api.npost('/api/post/new_post', {post_title: ''})
            commit('SET_CURRENT_POST', result)
            commit('updateCurrentPostStatus', POST_WRITER_STATUS.auto_draft)
            // this.currentStatus = POST_WRITER_STATUS.auto_draft
        } catch (e) {
            this.$Message.info('创建新文章失败，请重新刷新页面')
        }
    },
    async fetchPostInfo ({commit, state}, poi) {
        poi = _.toNumber(poi)
        if (poi && _.isNumber(poi)) {
            try {
                // console.log('poi', poi)
                let result = await api.nget(`/api/post/${poi}`)
                commit('SET_CURRENT_POST', result)
                commit('updateCurrentPostStatus', POST_WRITER_STATUS.normal)
                return true
            } catch (e) {
                console.log(e)
            }
        }
        return false
    }

}
const mutations = {
    // USER_SIGNOUT (state) {
    //     state.user = null
    // },
    // MERGEUSER (state, obj) {
    //     _.merge(state.user, obj)
    // }
    updateCategoryValue (state, value) {
        state.categoryValue = value
    },
    updateCurrentPostStatus (state, value) {
        state.status = value
    },
    updatePostTitle (state, value) {
        state.post_title = value
    },
    updatePostContent (state, value) {
        state.post_content = value
    },
    updateTags (state, value) {
        state.tags = value
    },
    shiftPostTag (state, value) {
        state.tags.shift()
    },
    splicePostTag (state, index) {
        if (index>=0) {
            state.tags.splice(index, 1)
        }
    },
    pushPostTag (state, value) {
        state.tags.push(value)
    },
    updatePostExcerpt (state, value) {
        state.post_excerpt = value
    },
    updateRenderValue (state, value) {
        state.render_value = value
    },
    SET_CURRENT_POST (state, value) {
        // 先重置， 在设置
        if (_.isObject(value)) {
            for (let key in copyPost) {
                if (state.hasOwnProperty(key)) {
                    state[key] = copyPost[key]
                }
            }
            for (let key in value) {
                if (state.hasOwnProperty(key)) {
                    state[key] = value[key]
                }
            }
            let {category, post_tag: postTag} = _.groupBy(value.terms, 'taxonomy')
            if (postTag) state.tags = postTag.map((i) => i.name)
            if (category) state.categoryValue = category[0].term_id
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
