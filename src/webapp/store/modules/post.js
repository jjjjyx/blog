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
// 可以merge的key
let mergeKeys = ['comment_status', 'menu_order', 'post_type', 'comment_count', 'seq_in_nb', 'post_author', 'post_date', 'render_value', 'post_content', 'post_title', 'post_excerpt', 'post_status', 'post_name', 'guid', 'post_password', 'sticky', 'updatedAt', 'createdAt']

const copyPost = _.cloneDeep(state)
let currCopy = _.cloneDeep(state)

const getters = {
    categoryValue: (state, getters) => state.category_id || getters.defaultCategoryValue,
    // 在离开的时候是否显示提示
    // 仅在保存中， 编辑 状态时提示
    showLeaveTip: state => state.status === POST_WRITER_STATUS.saving || state.status === POST_WRITER_STATUS.edited,
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
            // 创建前 如果有 id 并且状态是自动草稿 就不新建了
            if (state.id && state.post_status === 'auto-draft') {
                return 0
            }

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
    mergePost (state, value) {
        for (let key of mergeKeys) {
            if (value.hasOwnProperty(key)) {
                state[key] = value[key]
            }
        }
    },
    updateCategoryValue (state, value) {
        state.category_id = value
    },
    updateEditorStatus (state, value) {
        if (state.post_status === 'publish' && value === POST_WRITER_STATUS.created) {
            value = POST_WRITER_STATUS.posted
        }
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
    updatePostExcerpt (state, value) {
        state.post_excerpt = value
    },
    updatePostPass (state, value) {
        state.post_password = value
    },
    updateSticky (state, value) {
        state.sticky = value
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

    restore (state, value) {
        state.post_content = value.post_content
        state.post_title = value.post_title
        state.post_excerpt = value.post_excerpt
        let metas = value.metas
        if (metas.tags) {
            state.new_tag = JSON.parse(metas.tags.meta_value)
        } // 如果恢复的版本没有 则照旧

        if (metas.category) {
            state.category_id = JSON.parse(metas.category.meta_value)
        } // 如果恢复的版本没有 则照旧

        state.status = POST_WRITER_STATUS.edited

        // state.new_tag =
    },
    // 保存当前文章后，同时更新记录中的信息
    // 主要作用是保持与后端的数据同步，减少再次请求数据
    updateAutoSaveContent (state, obj) {
        let autoRevision = state.revision.find(item => item.autosave)
        if (_.isObject(autoRevision)) {
            console.log('updateAutoSaveContent: ', obj, autoRevision)
            autoRevision.post_content = obj.post_content
            autoRevision.post_title = obj.post_title
            autoRevision.post_excerpt = obj.post_excerpt
            autoRevision.updatedAt = new Date()
            let metas = autoRevision.metas
            metas.tags = metas.tags || {meta_value: ''}
            metas.category = metas.category || {meta_value: ''}

            metas.tags.meta_value = JSON.stringify(obj.new_tag)
            metas.category.meta_value = JSON.stringify(obj.category_id)
        }
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
            if (category) state.category_id = category[0].id

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
