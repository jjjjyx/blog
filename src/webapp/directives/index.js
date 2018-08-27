import transfer from './transfer-dom'
import ClickOutside from './clickoutside'
// import Tooltip from './tooltip.js'
import contextMenu from './context-menu/contextmenu-diretive.js'

export default function install (Vue) {
    Vue.directive('transfer-dom', transfer)
    Vue.directive('click-outside', ClickOutside)
    // Vue.directive('tooltip', Tooltip)
    Vue.directive('context-menu', contextMenu)
}
