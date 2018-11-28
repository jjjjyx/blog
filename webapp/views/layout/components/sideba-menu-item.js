

export default {
    functional: true,
    name: 'sidebar-item',
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    // eslint-disable-next-line
    render (h, ctx) {
        let {item} = ctx.props
        let self = ctx.parent
        let {child, name, hide, icon, textIcon, expand = true} = item
        if (hide) return

        let i18nName = self.$t('router.' + name)
        let $icon
        if (icon) {
            $icon = <font-icon class="sidebar-menu__icon" type={icon}/>
        } else {
            $icon = <text-icon class="sidebar-menu__icon--text" text={textIcon || i18nName[0]}/>
        }

        let $name = <span class="sidebar-menu__name">{i18nName}</span>

        // let handle = self.handleOpenChange

        if (expand && child && child.length > 0) { // 有子菜单
            return <submenu name={name}>
                <template slot="title">
                    {[$icon, $name]}
                </template>
                {
                    child.map((i) => <sidebar-item item={i} />)
                }
            </submenu>
            // } else if (!hide) {
        } else {
            return <menu-item name={name}>
                {[$icon,$name]}
            </menu-item>
        }
    }
}
