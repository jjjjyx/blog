'use strict'

export const mutations = {
    SET_DICT (state, obj) {
        state.dict = obj.labels
        state.site = obj.site
    }
    // toggleSidebar(state,v){
    //     state.isSidebarShow = !!v;
    // },
    // setContentHeight(state,v){
    //     state.contentHeight = v;
    // }
}
