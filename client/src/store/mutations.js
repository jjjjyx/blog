
// import api from "../netapi.js"
// import act from "../components/mindmap/core/action.js"
// import sockapi from '../netsock'

export const mutations = {
    toggleSidebar(state,v){
        state.isSidebarShow = !!v;
    },
    setContentHeight(state,v){
        state.contentHeight = v;
    }
}
