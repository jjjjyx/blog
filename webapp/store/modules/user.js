'use strict'

import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
// import store from '../index'

const state = {
    // user: null
    'id': 0,
    'user_login': '',
    'user_nickname': '',
    'user_email': '',
    'user_avatar': null,
    'user_url': '',
    'user_status': 1,
    'display_name': '',
    'role': 0,
    'createdAt': '',
    'updatedAt': '',
    'lastOnlineTime': 0,
    'jti': '',
    'iat': 0,
    'exp': 0,
    'validateTime': 0
}

const defaultUser = cloneDeep(state)
const getters = {
    // 是否登录
    isLogin: state => state.id !== 0 && (+new Date() - state.validateTime) < 60 * 60 * 1000, // 小于一小时
    // 是否超时
    isTimeOut: state => (+new Date() - state.validateTime) < 60 * 60 * 1000
}

// actions
const actions = {
    // userSetInfo ({ commit, state },user){
    //     commit("USER_SET_INFO",user);
    // },
    // async userSignout ({ commit, state }) {
    //     let [code, data] = await api.userSignout()
    //     if (code == 0) {
    //         commit("USER_SIGNOUT");
    //     }
    // }
    mergeUser ({ commit }, obj) {
        commit('USER_SET_INFO', obj)
    }
}
const mutations = {
    USER_SET_INFO (state, user) {
        merge(state, user)
        state.validateTime = Date.now()
        // state.user = user
    },
    USER_SIGNOUT (state) {
        // state = null
        for (let key in state) {
            if (state.hasOwnProperty(key)) {
                state[key] = defaultUser[key]
            }
        }
    }
    // MERGEUSER (state, obj) {
    //     _.merge(state, obj)
    // }
}

export default {
    state,
    getters,
    actions,
    mutations
}
