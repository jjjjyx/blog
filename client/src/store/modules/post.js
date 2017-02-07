
// import api from "../../../public/js/netapi";
const state = {
    postsList:[],
    currentPost:{}
}

const getters = {
    postsList:state => state.postsList,
    currentPost:state => state.currentPost,
}

// actions
const actions = {
    setActivePostId({ commit, state, getters },id){
        let currList = state.postsList.filter((item)=>item.term_id == getters.isActiveId);
        if(currList.length){
            let r = state.postsList.find((item)=>item.id == id);
            if(r){
                commit('SET_CURRENT_POSTID',r);
            }else{
                commit('SET_CURRENT_POSTID',currList[0]);
            }
        }else{
            commit('SET_CURRENT_POSTID',{});
        }
    },
    setCurrendPostConetent({ commit},content){
        commit("SET_CURRENDPOST_CONETENT",content)
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
    SET_CURRENDPOST_CONETENT(state,content){
        state.currentPost.post_content=content;
    },
    SET_CURRENT_POSTID(state,id){
        state.currentPost = id
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
