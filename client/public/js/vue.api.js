
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
