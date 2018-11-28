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
            if (item.name === state.homeRouter.name) continue
            // if (item.meta.hide) continue
            if (!item.name) continue
            let {expand = true} = item.meta

            // 面包屑导航 过滤掉不在侧边显示的导航
            if (!expand) {
                state.breadCrumbList.push(item.meta)
                break
            }
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
