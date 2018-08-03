import _ from 'lodash'
import {on, off} from '@/utils/dom'
import {getMetaKeyCode} from '@/utils/common'
import api from '@/utils/api'
export default {
    data () {
        return {
            filterForm: {key: '', term: '', status: ''},
            tableHeight: 400,
            columns: [], // 表格列对象
            tableStatus: false, // 表格加载状态
            selectedList: [], // 选中的对象

            idKey: 'id', // 对象标识
            confirmStatus: false, // 确认按钮状态
            formItem: {},
            singleEditTarget: null, // 单选编辑对象

            active: '_', // 当前 url
            delTip: '确认删除？' // 删除提示
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
        },
        activeToLine () {
            return this.active.replace(/\/(\w)/g, '-$1')
        },
        // 当前显示组件
        showRightComponent () {
            if (this.singleEditTarget) {
                return `edit-${this.activeToLine}`
            } else if (this.selectedNum === 0){
                return `add-${this.activeToLine}`
            } else {
                return `select-info-${this.activeToLine}`
            }
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
        add: async function add (name) {
            this.confirmStatus = true
            let flag = true
            try {
                let result = await api.npost(`/api/${this.active}/add`, this.formItem)
                this.$store.dispatch('add_' + this.active, result)
            } catch (e) {
                this.$Message.error('参数错误, 添加失败')
                flag = false
            }
            this.confirmStatus = false
            return flag
        },
        // 修改数据
        edit: function edit (target) {
            this.singleEditTarget = target
        },
        unEdit: function unEdit () {
            this.singleEditTarget = null
        },
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
