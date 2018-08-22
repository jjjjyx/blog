'use strict'

import _ from 'lodash'
// import store from '../index'

const state = {
    // user: null
    collapsed: false,
    backgroundColor: 'black',
    backgroundImage: 'http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg',
    image: true,
    color: 'red'
}
const getters = {
    // 是否登录
    // isLogin: state => state.id !== 0 && (+new Date() - state.validateTime) < 60 * 60 * 1000, // 小于一小时
}

// actions
const actions = {
    // userSetInfo ({ commit, state },user){
    //     commit("USER_SET_INFO",user);
    // },
    toggleSidebarMini ({commit}) {
        commit("TOGGLE_SIDEBAR_MINI");
    }
}
const mutations = {
    TOGGLE_SIDEBAR_MINI (state, obj) {
        if (_.isBoolean(obj)) {
            state.collapsed = obj
        } else {
            state.collapsed = !state.collapsed
        }
    },
    TOGGLE_SIDEBAR_IMAGE (state, obj) {
        if (_.isBoolean(obj)) {
            state.image = obj
        } else {
            state.image = !state.image
        }
    },
    switchColor (state, color) {
        state.color = color
    },
    switchBackgroundColor (state, color) {
        state.backgroundColor = color
    },
    switchBackgroundImage (state, color) {
        state.backgroundImage = color
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
