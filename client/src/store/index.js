import Vue from 'vue';
import Vuex from 'vuex';

import {mutations} from "./mutations.js";
// import mmap from "./modules/mmap.mutations";
// import notify from "./modules/notify";
import * as getters from "./getters";
// import * as actions from "./actions";
import account from "./modules/account";
// import notify from "./modules/notify";

Vue.use(Vuex);


const state = {
    // 全局
    count:0,
    // skiner:'',
    isSidebarShow:false,
}
export default new Vuex.Store({
    // actions,
    state,
    getters,
    mutations,
    modules:{
        account
        // notify
    }
})
