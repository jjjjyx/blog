import Vue from 'vue'
import contextMenuVue from './context-menu'
import {off, on} from '../../utils/dom'
const ContextMenuConstructor = Vue.extend(contextMenuVue)

export default {
    bind (el, binding, vnode) {
        console.log('binding', binding)
        let value = binding.value
        let {menus, targetEl} = value
        let $contextMenu = new ContextMenuConstructor({
            data: {menus}
        })
        $contextMenu.$mount()
        let $contextEl = $contextMenu.$el
        let _preventContextMenuEvent = function (e) {
            $contextMenu.hideMenu()
            e.stopPropagation()
            e.preventDefault()
            $contextMenu.$nextTick(() => {
                let target = e.path.find((t) => t.matches(targetEl))
                $contextMenu.showMenu(e, target)
            })
        }
        let _handlClick = () => {
            $contextMenu.hideMenu()
        }
        // 绑定事件
        on(el, 'contextmenu', _preventContextMenuEvent)
        on(el, 'click', _handlClick)
        document.body.appendChild($contextEl)
        el.__data__ = {
            $contextMenu,
            offEvent: () => {
                off(el, 'contextmenu', _preventContextMenuEvent)
                off(el, 'click', _handlClick)
            }
        }
    },
    componentUpdated  (el, binding, vnode) { },
    unbind  (el, binding, vnode) {
        let {$contextMenu, offEvent} = el.__data__
        offEvent()
        $contextMenu.$destroy()
        document.body.removeChild($contextMenu.$el)
        // $contextMenu.$dis
        // console.log({$contextMenu, offEvent})
    }
}
