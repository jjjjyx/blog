'use strict'

import isBoolean from 'lodash/isBoolean'

import menus from '@/router/menus'


const state = {
    // user: null
    collapsed: false,
    backgroundColor: 'black',
    backgroundImage: 'https://image.cdn.mbdoge.cn/sidebar-1.jpg',
    image: true,
    color: 'red',

    menus,
    addMenus: []
}
// 可能会有权限的需求
const getters = {
    // menus: state => state.menus
}

// actions
const actions = {
    // userSetInfo ({ commit, state },user){
    //     commit("USER_SET_INFO",user);
    // },
    toggleSidebarMini ({ commit }) {
        commit('TOGGLE_SIDEBAR_MINI')
    }
}
const mutations = {
    SET_ROUTERS: (state, routers) => {
        state.addMenus = routers
        state.menus = menus.concat(routers)
    },
    TOGGLE_SIDEBAR_MINI (state, obj) {
        if (isBoolean(obj)) {
            state.collapsed = obj
        } else {
            state.collapsed = !state.collapsed
        }
    },
    TOGGLE_SIDEBAR_IMAGE (state, obj) {
        if (isBoolean(obj)) {
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
