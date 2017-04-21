
// import api from "../../../public/js/netapi";
const state = {
    site:null,
}

const getters = {
    site: state => state.site
}

// actions
const actions = {
    mergeSite({commit},obj){
        commit("MERGESITE",obj);
    }
}
const mutations = {
    SITE_SET_INFO (state,site) {
        state.site = site;
    },
    MERGESITE(state,obj){
        _.merge(state.site,obj);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
