import transfer from './transfer-dom'
import ClickOutside from './clickoutside'
import contextMenu from './context-menu/contextmenu-diretive.js'
import Scrollbar from './scrollbar'

export default function install (Vue) {
    Vue.directive('transfer-dom', transfer)
    Vue.directive('click-outside', ClickOutside)
    Vue.directive('scrollbar', Scrollbar)
    Vue.directive('context-menu', contextMenu)
}
