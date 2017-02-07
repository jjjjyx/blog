
// import api from "../../../public/js/netapi";
const state = {
    postsList:[],
    isActivePostId:0
}

const getters = {
    postsList:state => state.postsList,
    isActivePostId:state => state.isActivePostId
}

// actions
const actions = {
    setActivePostId({ commit, state, getters },id){
        let currList = state.postsList.filter((item)=>item.term_id == getters.isActiveId);
        if(currList.length){
            if(state.postsList.some((item)=>item.id == id)){
                commit('SET_ACTIVE_POSTID',id);
            }else{
                commit('SET_ACTIVE_POSTID',currList[0].id);
            }
        }
    }

}
const mutations = {
    setPosts (state,list){
        state.postsList = list;
    },
    addPost (state,{obj,index}){
        if(index==0||index){
            state.postsList.splice(index,0,obj)
        }else
            state.postsList.push(obj);
    },
    delPost (state,id){
        let index = state.postsList.findIndex((item)=>item.id===id)
        state.postsList.splice(index,1)
    },
    SET_ACTIVE_POSTID(state,id){
        state.isActivePostId = id
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
