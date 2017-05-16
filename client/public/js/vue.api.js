
import {dateFormat, getTimeText,formatFileSize} from "./tools"

Vue.filter('dateFormat', dateFormat);
Vue.filter('displayFriendlyTime', getTimeText);
Vue.filter('formatFileSize', formatFileSize);

Vue.directive('disabled', function (el, {value}) {
    if (!value) {
        el.setAttribute("disabled", 'disabled');
    } else {
        el.removeAttribute("disabled");
    }
});
