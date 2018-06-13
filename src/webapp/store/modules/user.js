'use strict'

import _ from 'lodash'

const state = {
    user: null
}

const getters = {
    user: state => state.user
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
    mergeUser ({commit}, obj) {
        commit('MERGEUSER', obj)
    }
}
const mutations = {
    USER_SET_INFO (state, user) {
        user.validateTime = Date.now()
        state.user = user
    },
    USER_SIGNOUT (state) {
        state.user = null
    },
    MERGEUSER (state, obj) {
        _.merge(state.user, obj)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
