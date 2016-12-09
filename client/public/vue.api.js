
// export function notUser({redirect,next}){
//     if(store.state.user==null){
//         redirect('/user/login?time='+(+new Date()));
//         $("#loader-inter").removeClass("active");
//     }else
//         next();
// }
//
// export function haveUser({redirect,next}){
//     if(store.state.user!=null){
//         redirect('/');
//     }else
//         next();
// }

import Vue from "vue";

import {dateFormat, getTimeText} from "./tools"

Vue.filter('dateFormat', dateFormat);
Vue.filter('displayFriendlyTime', getTimeText);

Vue.directive('disabled', function (el, {value}) {
    if (!value) {
        el.setAttribute("disabled", 'disabled');
    } else {
        el.removeAttribute("disabled");
    }
});
