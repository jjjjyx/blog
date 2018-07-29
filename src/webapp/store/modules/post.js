'use strict'

import _ from 'lodash'
import api from '@/utils/api'
import {transformMetas, POST_WRITER_STATUS} from '../../utils/common'
// import Vue from 'vue'

// const POST_WRITER_STATUS = {
//     normal: '',
//     save: '已保存',
//     saveing: '保存中',
//     edit: '已修改 - 未保存',
//     auto_draft: '自动草稿'
// }

const state = {
    'id': 0,
    'comment_status': 'open',
    // 'ping_status': 'open',
    'menu_order': '0',
    'post_type': 'post',
    'comment_count': '0',
    'seq_in_nb': '0',
    'post_author': null,
    'post_date': null,
    'post_content': '',
    'post_title': '',
    'post_excerpt': '',
    'post_status': 'auto-draft',
    'post_name': '',
    'guid': '',
    'render_value': '',
    'post_password': '',

    updatedAt: '',
    createdAt: '',

    sticky: '',
    user: {},
    metas: {}, // metas 信息
    terms: [], // 标签 + 分类
    new_tag: [], // 标签 用作回填
    // newTags: [], // 新增的标签
    category_id: null, // 分类
    revision: [], // 历史版本
    status: POST_WRITER_STATUS.normal
    // sidebarCategoryValue: 1
}

const copyPost = _.cloneDeep(state)
let currCopy = _.cloneDeep(state)

const getters = {
    categoryValue: (state, getters) => state.category_id || getters.defaultCategoryValue,
    // 在离开的时候是否显示提示
    // 仅在保存中， 编辑 状态时提示
    showLeaveTip: state => state.status === POST_WRITER_STATUS.saveing || state.status === POST_WRITER_STATUS.edit,
    ajaxPostClone: state => {
        let obj = _.cloneDeep(state)
        delete obj.terms
        delete obj.metas
        delete obj.user
        delete obj.revision
        // obj.new_tag = obj.newTags.concat(obj.tags)
        // delete obj.newTags
        // delete obj.tags
        delete obj.status
        delete obj.updatedAt
        delete obj.createdAt
        return obj
    },
    isPublish: state => state.post_status === 'publish'
    // user: state => state.user
}

// actions
const actions = {
    async createNewPost ({commit, state}) {
        try {
            let result = await api.npost('/api/post/new_post', {post_title: ''})
            commit('SET_CURRENT_POST', result)
            commit('updateEditorStatus', POST_WRITER_STATUS.created)
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
                    commit('updateEditorStatus', POST_WRITER_STATUS.created)
                //     commit('updateEditorStatus', POST_WRITER_STATUS.posted)
                // if (result.post_status === 'publish') {
                // } else {
                // }
                return true
            } catch (e) {
                console.log(e)
            }
        }
        return false
    },
    getOriginPost () {
        return currCopy
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
        state.category_id = value
    },
    updateEditorStatus (state, value) {
        if (state.post_status === 'publish' && value === POST_WRITER_STATUS.created)
            value = POST_WRITER_STATUS.posted
        state.status = value
    },
    updatePostTitle (state, value) {
        state.post_title = value
    },
    updatePostContent (state, {value, render}) {
        state.post_content = value
        state.render_value = render
    },
    updateTags (state, value) {
        state.new_tag = value
    },
    updatePostDate (state, value) {
        state.post_date = value
    },
    updatePostStatus (state, value) {
        state.post_status = value
    },
    shiftPostTag (state, value) {
        state.new_tag.shift()
    },
    splicePostTag (state, index) {
        if (index >= 0) {
            state.new_tag.splice(index, 1)
        }
    },
    pushPostTag (state, value) {
        state.new_tag.push(value)
    },
    updatePostExcerpt (state, value) {
        state.post_excerpt = value
    },
    updatePostPass (state, value) {
        state.post_password = value
    },
    updateSticky (state, value) {
        state.sticky = value
    },
    restore (state, value) {
        state.post_content = value.post_content
        state.post_title = value.post_title
        state.post_excerpt = value.post_excerpt
    },
    SET_CURRENT_POST (state, value) {
        // 先重置， 在设置
        if (_.isObject(value)) {
            for (let key in copyPost) {
                if (state.hasOwnProperty(key)) {
                    state[key] = copyPost[key]
                }
            }
            // 标记自动版本
            if (value.revision && _.isArray(value.revision)) {
                value.revision.forEach((item) => {
                    item.autosave = item.type === `${value.id}-autosave-v1`
                    item.curr = item.updatedAt === value.updatedAt
                    item.metas = transformMetas(item.metas)
                    // item.post_content = false
                })
            }
            // 转换metas
            value.metas = transformMetas(value.metas)
            for (let key in value) {
                if (state.hasOwnProperty(key)) {
                    state[key] = value[key]
                }
            }
            let {category, post_tag: postTag} = _.groupBy(value.terms, 'taxonomy')
            if (postTag) state.new_tag = postTag.map((i) => i.name)
            if (category) state.category_id = category[0].term_id

            currCopy = _.cloneDeep(state)
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
