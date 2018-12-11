import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import i18n from '../../lang'
import contextMenuVue from './context-menu'
import { off, on } from '../../utils/dom'

const ContextMenuConstructor = Vue.extend(contextMenuVue)

export default {
    bind (el, binding) {
        // console.log('binding', binding, el)
        let value = binding.value
        let { menus, targetEl } = value
        menus = cloneDeep(menus)
        menus.forEach(function __ (item) {
            item._disabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled
            if (item.child) {
                item.child.forEach(__)
            }
        })
        let $contextMenu = new ContextMenuConstructor({
            data: { menus },
            i18n
        })
        $contextMenu.$mount()
        let $contextEl = $contextMenu.$el
        let _preventContextMenuEvent = function (e) {
            $contextMenu.hideMenu()
            e.stopPropagation()
            e.preventDefault()
            $contextMenu.$nextTick(() => {
                let target = e.path.find((t) => t.matches && t.matches(targetEl))
                $contextMenu.showMenu(e, target)
            })
        }
        let _handleClick = () => {
            $contextMenu.hideMenu()
        }

        el.__data__ = {
            $contextMenu,
            offEvent: () => {
                off(el, 'contextmenu', _preventContextMenuEvent)
                off(document.body, 'mousedown', _handleClick)
            }
        }
        // 绑定事件
        on(el, 'contextmenu', _preventContextMenuEvent)
        on(document.body, 'mousedown', _handleClick)
        document.body.appendChild($contextEl)
    },
    unbind (el) {
        let { $contextMenu, offEvent } = el.__data__
        offEvent()
        $contextMenu.$destroy()
        document.body.removeChild($contextMenu.$el)
        // $contextMenu.$dis
        // console.log({$contextMenu, offEvent})
    }
}
