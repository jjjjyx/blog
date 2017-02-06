
// import api from "../../../public/js/netapi";
const state = {
    termList:[],
    isActiveId:0
}

const getters = {
    termList: state => state.termList,
    categoryList: state => state.termList.filter((item)=>item.taxonomy == 'category'),
    tagList: state => state.termList.filter((item)=>item.taxonomy == 'tag'),
    isActiveId: state => state.isActiveId
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
    setActiveId({ commit, state,getters },id){
        if(getters.categoryList.some((item)=>item.taxonomy=='category' && item.term_id == id)){
            commit('SET_ACTIVEID',id);
        }else{
            commit('SET_ACTIVEID',getters.categoryList[0].term_id);
        }
    }

}
const mutations = {
    setTerm (state,list){
        state.termList = list;
    },
    addTerm (state,obj) {
        if(obj.hasOwnProperty('term_id')&&obj.hasOwnProperty('name')&&obj.hasOwnProperty('taxonomy'))
            termList.push(obj)
    },
    deleteTerm (state,id) {
        let index = state.termList.findIndex((item)=>item.term_id==id)
        state.termList.splice(index,1)
    },
    SET_ACTIVEID(state,id){
        state.isActiveId = id;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
