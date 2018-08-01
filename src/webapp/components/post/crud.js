import _ from 'lodash'
import {on, off} from '@/utils/dom'
import {getMetaKeyCode} from '@/utils/common'
import api from '@/utils/api'
export default {
    data () {
        return {
            filterForm: {key: '', term: '', status: ''},
            tableHeight: 400,
            columns: [],
            tableStatus: false,
            selectedList: [],
            delTip: '确认删除？',
            idKey: 'id'
        }
    },
    computed: {
        // ...mapState({
        //     data: state => state.term.categoryList
        // }),
        // ...mapGetters({
        //     // 'selectedList': 'selectedCategory',
        //     // 'data': 'categoryList'
        //     // 'categoryValue': 'categoryValue'
        // }),
        selectedNum: function () {
            return this.selectedList.length
        }
    },
    methods: {
        // ...mapActions({'fetchTerms': 'fetchTerms',}),
        // 获取数据
        async fetchData (force) {
            this.tableStatus = true
            await this.fetch(force)
            this.tableStatus = false
        },
        // 删除数据
        remove: function remove (selected) {
            if (!(selected instanceof Array)) {
                selected = this.selectedList
            }

            let ids = selected.map((item) => (item[this.idKey]))
            // 删除提示
            this.$Modal.warning({
                title: '删除提示',
                content: this.delTip,
                onOk: async () => {
                    try {
                        await api.npost(`/api/${this.active}/del`, {ids})
                        this.$store.dispatch('del_' + this.active, selected)
                    } catch (e) {
                        this.$Message.info('删除失败')
                    }
                }
            })
        },
        // 增加数据
        add: function add () {},
        // 修改数据
        edit: function edit () {},
        // 查询数据
        search: function search () {},
        // 选择变化
        handleSelectChange (value) {
            this.selectedList = value
        },
        handleKeyDown: function (e) {
            let keyCode = getMetaKeyCode(e)
            switch (keyCode) {
            case 4113: // 按下了 ctrl
            case 16400: // 按下了 shift
            case 20497: // 同时按下了 shift ctrl
            case 20496: // 同时按下了 ctrl shift
                this.keydownCode = keyCode
                break
            case 116: // 按下了F5
                this.fetchData()
                e.preventDefault()
                break
            default:
                this.keydownCode = null
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            vm.handleKeyDown = vm.handleKeyDown.bind(vm)
            on(document.body, 'keydown', vm.handleKeyDown)
        })
    },
    beforeRouteLeave (to, from, next) {
        off(document.body, 'keydown', this.handleKeyDown)
        next()
    },
    created: function () {
        this.fetchData(false)
    },
    mounted () {
        if (this.$refs['table-wrapper']) {
            let h = this.$refs['table-wrapper'].clientHeight
            this.tableHeight = h
            let onResize = _.debounce((e) => {
                let h = this.$refs['table-wrapper'].clientHeight
                this.tableHeight = h
            }, 1000)
            onResize()
            on(window, 'resize', onResize)
        }
    }
}
