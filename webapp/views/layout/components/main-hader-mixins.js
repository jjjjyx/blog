import * as user from '../../../api/user'
import api from '@/api'
import { dateFormat } from '@/utils/common'
import screenfull from 'screenfull'
import { mapState, mapMutations, mapActions } from 'vuex'

// eslint-disable-next-line
function deepQuery (tree, name) {
    let stark = []

    stark = stark.concat(tree)

    while (stark.length) {
        let temp = stark.shift()
        if (name === temp.name) {
            return temp
        }
        if (temp.child) {
            stark = temp.child.concat(stark)
        }
    }
}


export default {
    name: 'main-header',
    data () {
        return {
            langs: [
                {name: 'zh-CN', label: '中文简体'},
                {name: 'zh-TW', label: '中文繁体'},
                {name: 'en-US', label: 'English'}
            ],
            errorModalVisible: false,
            errorColumns: [
                {type: 'expand', width: 50, render: (h, {row}) => {return h('pre', row.err.stack)}},
                {
                    title: 'type', key: 'name', width: 100, render: (h) => {/* <tag color="error">Error</tag>*/
                        return h('tag', {props: {color: 'error'}}, 'Error')
                    }
                },
                {title: 'msg', key: 'msg', maxWidth: 260, render: (h, {row}) => {return [row.err.message]}},
                {title: 'info', key: 'info'},
                {title: 'url', key: 'url'},
                {title: 'time', key: 'time', render: (h, {row}) => {return [dateFormat(row.time)]}}
            ]
        }
    },
    computed: {
        ...mapState({
            'breadCrumbList': 'breadCrumbList',
            'language': 'language',
            'collapsed': state => state.sidebar.collapsed,
            'menus': state => state.sidebar.menus,
            'user': state => state.user,
            'logs': state => state.errorLog.logs,
            'showDebug': state => state.errorLog.showDebug
        })

        // last: function () {
        // 	return last(this.breadCrumbList)
        // }
    },
    methods: {
        ...mapActions(['toggleSidebarMini', 'setLanguage']),
        ...mapMutations(['setBreadCrumb']),
        handleSelectRouter (item) {
            // console.log(item)
            // item.name
            // this.menus.forEach(()=>{
            //
            // })
            // todo 在面包屑导航上 有下级节点的给出下拉菜单
            // let menu = deepQuery(this.menus, item.name)
            //

            this.$router.push({name: item.name})
        },
        handleRouteChange () {
            let {matched} = this.$route
            this.setBreadCrumb(matched)
        },
        openErrorLog () {
            this.errorModalVisible = true
        },
        screenFull () {
            // throw new Error('asdasd')
            if (!screenfull.enabled) {
                this.$Message.warning(this.$t('messages.screen_full_warning'))
                return false
            }
            screenfull.toggle()
        },
        handleChangeI18n (lang) {
            this.$i18n.locale = lang
            this.setLanguage(lang)
            this.$Message.success(this.$t('messages.switch_language'))
        },
        logout () {
            user.logout().then(() => {
                console.log('====')
                // api.token = null
                // location.reload()
            })
            // api.nget('/api/user/signout').then(() => {
            // 	api.token = null
            // 	location.reload()
            // })
        }
    },
    watch: {
        '$route': 'handleRouteChange'
    },
    created () {
        this.handleRouteChange()
    }
}
