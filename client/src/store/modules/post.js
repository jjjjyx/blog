
// import api from "../../../public/js/netapi";
import Vue from 'vue'
const state = {
    postsList:[],
    lastPostId:0,
    currentPost:{},
    isUpdateContent:false,
}

const getters = {
    postsList:state => state.postsList,
    currentPost:state => state.currentPost,
    isUpdateContent: state => state.isUpdateContent,
    lastPostId: state => state.lastPostId
}

// actions
const actions = {
    setActivePostId({ commit, state, getters },id){
        let currList = state.postsList.filter((item)=>item.term_id == getters.isActiveId);
        commit('SET_LAST_ID',getters.currentPost);
        if(currList.length){
            let r = state.postsList.find((item)=>item.id == id);
            if(!r)
                r = currList[0];
            commit('SET_CURRENT_POSTID',r);
        }else{
            commit('SET_CURRENT_POSTID',{});
            commit("UPDATE_CONTENT",null);
        }
    },
    setCurrendPostConetent({commit},content){
        commit("SET_CURRENDPOST_CONETENT",content);
    },
    setCurrendPost({commit},data){
        commit("SET_CURRENDPOST_CONETENT",data[0].post_content);
        commit("SET_CURRENDPOST_TAG",data[1]);
    },
    update_current_postcontent({commit},content){
        commit("UPDATE_CONTENT",content);
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
    },
    SET_CURRENDPOST_TAG(state,id){
        Vue.set(state.currentPost,'postTag',id);
    },
    SET_LAST_ID(state,id){
        state.lastPostId = id;
    },
    UPDATE_CONTENT(state,c){
        state.isUpdateContent = c;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}