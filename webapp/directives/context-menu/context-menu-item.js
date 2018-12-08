import isFunction from 'lodash/isFunction'

const defaultCallback = (event, target) => {
}
export default {
    functional: true,
    name: 'context-menu-item',
    menus: {
        type: Array,
        required: true
    },
    render (h, ctx) {
        let { menus } = ctx.props
        let self = ctx.parent
        let items = menus.map(menu => {
            let { divided, _disabled, callback, label, key, child } = menu
            if (!isFunction(callback)) {
                callback = defaultCallback
            }
            let attrs = {
                divided,
                disabled: _disabled
            }
            if (child && child.length) {
                return <dropdown placement="right-start" class="111">
                    <dropdown-item {...{ attrs }} nativeOnClick={() => callback(self.originEvent, self.target)}>
                        {/*支持多语言*/}
                        {label || self.$t(key)}
                        <icon type="ios-arrow-forward"/>
                    </dropdown-item>
                    <context-menu-item slot="list" menus={child}/>
                </dropdown>
            } else {
                return <dropdown-item  {...{ attrs }} nativeOnClick={() => callback(self.originEvent, self.target)}>
                    {label || self.$t(key)}
                </dropdown-item>
            }
        })

        return <dropdown-menu>
            {items}
        </dropdown-menu>
    }
}
