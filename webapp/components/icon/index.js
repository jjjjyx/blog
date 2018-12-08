import Icon from './icon.vue'
import FontIcon from './font-icon'

export default function install (Vue) {
    Vue.component('color-icon', Icon)
    Vue.component('font-icon', FontIcon)
}
