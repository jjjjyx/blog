
// import api from "../../../public/js/netapi";
const state = {
    termList:[],
    isActiveId:0
}

const getters = {
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
        getters.postsList.forEach((item)=>{
            if(item.postTag){
                index = item.postTag.findIndex((item)=>item.term_id==id);
                // console.log(index,item);
                if(index>=0)
                    item.postTag.splice(index,1)
            }
        })
        index = state.termList.findIndex((item)=>item.term_id==id)
        commit("DELETE_TERM",index);

    }

}
const mutations = {
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
