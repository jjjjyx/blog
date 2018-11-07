'use strict'

// import { homeRouter } from '../router/router'

export const mutations = {
    SET_DICT (state, obj) {
        state.site = obj.site
        obj.site.forEach((item) => {
            state.siteMap[item.key] = item
        })
    },
    updateSite (state, diff) {
        for (let key in diff) {
            state.siteMap[key].value = diff[key]
        }
    },
    setBreadCrumb (state, matched) {
        // console.log('==', matched, state)
        state.breadCrumbList = [state.homeRouter] // getBreadCrumbList(routeMetched, state.homeRoute)
        for (let item of matched) {
            if (item.meta.hide) continue
            if (!item.name) continue
            // let parent = item.meta.parent
            // parent && state.breadCrumbList.push(parent)
            state.breadCrumbList.push(item.meta)
        }
    },
    SET_LANGUAGE: (state, language) => {
        state.language = language
        localStorage.setItem('local', language)
    },
    // toggleSidebar(state,v){
    //     state.isSidebarShow = !!v;
    // },
    // setContentHeight(state,v){
    //     state.contentHeight = v;
    // }
}
