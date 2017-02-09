
// import api from "../../../public/js/netapi";
import Vue from 'vue'
const state = {
    posts:[],
    lastPostId:0,
    currentPost:{},
    isUpdateContent:false,

    //term
    termList:[],
    isActiveId:0
}

const getters = {
    posts:state => state.posts,
    postsList:state => state.posts.filter((item)=>!item.delete_at && item.term_id==state.isActiveId),
    trashList:state => state.posts.filter((item)=>item.delete_at),
    currentPost:state => state.currentPost,
    isUpdateContent: state => state.isUpdateContent,
    lastPostId: state => state.lastPostId,
    // term
    termList: state => state.termList,
    categoryList: state => state.termList.filter((item)=> item.taxonomy == 'category'),
    tagList: state => state.termList.filter((item)=> item.taxonomy == 'tag'),
    isActiveId: state => state.isActiveId
}

// actions
const actions = {
    setActiveId({ commit, state,getters },id){
        if(getters.categoryList.some((item)=>item.taxonomy=='category' && item.term_id == id)){
            commit('SET_ACTIVEID',id);
        }else{
            commit('SET_ACTIVEID',getters.categoryList[0].term_id);
        }
    },
    deleteTerm({ commit, state,getters },id){
        let index;
        getters.posts.forEach((item)=>{
            if(item.postTag){
                index = item.postTag.findIndex((item)=>item.term_id==id);
                // console.log(index,item);
                if(index>=0)
                    item.postTag.splice(index,1)
            }
        })
        index = state.termList.findIndex((item)=>item.term_id==id)
        commit("DELETE_TERM",index);

    },


    // post
    setActivePostId({ commit, state, getters },id){
        let currList = getters.postsList.filter((item)=>item.term_id == getters.isActiveId);
        commit('SET_LAST_ID',getters.currentPost);
        if(currList.length){
            let r
            if(id){
                r = getters.postsList.find((item)=>item.id == id);
                if(!r){
                    r ={};
                }
            }else{
                r = currList[0];
            }
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
        state.posts = list;
    },
    addPost (state,{obj,index}){
        if(index==0||index){
            state.posts.splice(index,0,obj)
        }else
            state.posts.push(obj);
    },
    delPost (state,id){
        let index = state.posts.findIndex((item)=>item.id===id)
        state.posts.splice(index,1)
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
    },

    // term
    setTerm (state,list){
        state.termList = list;
    },
    addTerm (state,{obj,index}) {
        if(obj.hasOwnProperty('term_id')&&obj.hasOwnProperty('name')&&obj.hasOwnProperty('taxonomy'))
            if(index==0||index){
                state.termList.splice(index,0,obj)
            }else
                state.termList.push(obj)
    },
    DELETE_TERM (state,index) {
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
