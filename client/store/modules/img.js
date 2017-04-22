
// import api from "../../../public/js/netapi";
const state = {
    imgList:[],
    marker:'',
}

const getters = {
    imgList: state => state.imgList,
    marker: state => state.marker,
    activeImg: state=>state.imgList.find((item)=>item.select)

}

// actions
const actions = {

}
const mutations = {
    addImgList (state,list) {
        list.forEach((item)=>{
            item.select = false;
        });
        state.imgList = state.imgList.concat(list);
    },
    deleteImgList(state,index){
        state.imgList.splice(index, 1)
    },
    setMarker(state,marker){
        state.marker = marker;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
