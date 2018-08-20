'use strict'

export const mutations = {
    SET_DICT (state, obj) {
        state.dict = obj.labels
        state.site = obj.site
        obj.site.forEach((item) => {
            state.siteMap[item.key] = item
        })
    },
    updateSite (state, diff) {
        for (let key in diff) {
            state.siteMap[key].value = diff[key]
        }
    }
    // toggleSidebar(state,v){
    //     state.isSidebarShow = !!v;
    // },
    // setContentHeight(state,v){
    //     state.contentHeight = v;
    // }
}
