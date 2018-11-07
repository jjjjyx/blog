'use strict'

import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
// import cloneDeep from 'lodash/cloneDeep'
// import store from '../index'

const state = {
    visitedViews: [],
    cachedViews: []
}

const getters = {}

// actions
const actions = {
    addView ({dispatch}, view) {
        dispatch('addVisitedView', view)
        dispatch('addCachedView', view)
    },
    addVisitedView ({commit}, view) {
        commit('ADD_VISITED_VIEW', view)
    },
    addCachedView ({commit}, view) {
        commit('ADD_CACHED_VIEW', view)
    },
    delView ({dispatch}, view) {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
    },
    delVisitedView ({commit}, view) {
        commit('DEL_VISITED_VIEW', view)
    },
    delCachedView ({commit}, view) {
        commit('DEL_CACHED_VIEW', view)
    },
    delOthersViews ({dispatch}, view) {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)

    },
    delOthersVisitedViews ({commit}, view) {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
    },
    delOthersCachedViews ({commit}, view) {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
    },

    delAllViews ({dispatch}, view) {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
    },
    delAllVisitedViews ({commit}) {
        commit('DEL_ALL_VISITED_VIEWS')

    },
    delAllCachedViews ({commit}) {
        commit('DEL_ALL_CACHED_VIEWS')
    },

    updateVisitedView ({commit}, view) {
        commit('UPDATE_VISITED_VIEW', view)
    }
}
const mutations = {
    ADD_VISITED_VIEW: (state, view) => {
        if (state.visitedViews.some(v => v.name === view.name)) return
        state.visitedViews.push(view)
    },
    ADD_CACHED_VIEW: (state, view) => {
        if (state.cachedViews.includes(view.name)) return
        if (!view.noCache) {
            state.cachedViews.push(view.name)
        }
    },
    DEL_VISITED_VIEW: (state, view) => {
        let index = findIndex(state.visitedViews, ['name', view.name])
        state.visitedViews.splice(index, 1)
    },
    DEL_CACHED_VIEW: (state, view) => {
        let index = state.cachedViews.indexOf(view.name)
        state.cachedViews.splice(index, 1)
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        // let view
        state.visitedViews = [find(state.visitedViews, ['name', view.name])]
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        state.cachedViews = [find(state.cachedViews, view.name)]
        // state.cachedViews = [view]
    },

    DEL_ALL_VISITED_VIEWS: state => {
        state.visitedViews = []
    },
    DEL_ALL_CACHED_VIEWS: state => {
        state.cachedViews = []
    }

    // UPDATE_VISITED_VIEW: (state) => {
    // let v = find(state.visitedViews, ['name', view.name])
    // v = Object.assign(v, view)
    // for (let v of state.visitedViews) {
    // 	if (v.path === view.path) {
    // 		v = Object.assign(v, view)
    // 		break
    // 	}
    // }
    // }
}

export default {
    state,
    getters,
    actions,
    mutations
}
