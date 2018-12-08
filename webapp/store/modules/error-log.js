'use strict'

// import merge from 'lodash/merge'
// import cloneDeep from 'lodash/cloneDeep'
// import store from '../index'

const state = {
    showDebug: true, // process.env.NODE_ENV === 'production'
    logs: []
}

const getters = {}

// actions
const actions = {
    addErrorLog ({ commit }, log) {
        // console.log(log ,222)
        commit('ADD_ERROR_LOG', log)
    }
}
const mutations = {
    ADD_ERROR_LOG: (state, log) => {
        state.logs.push(log)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
