import _ from 'lodash'
import {on, off} from '@/utils/dom'
import {getMetaKeyCode} from '@/utils/common'
import api from '@/utils/api'
import selectInfo from '../../view/post/modal/default-right'
import curdTable from './curd-table'

/**
 * 公共的增删改
 *
 * 使用方法
 * import curd from '@/components/curd/'
 *
 * mixins: [crud],
 *
 * 必须参数：
 *  data: []
 *  name: '',
 *  columns: [],
 *  active: '',
 *  formItem: ''
 * 必须方法
 *  fetch ()
 */

export default {
    data () {
        return {
            filterForm: {key: '', term: '', status: ''},
            tableHeight: 400,
            columns: [], // 表格列对象
            tableStatus: false, // 表格加载状态
            selectedList: [], // 选中的对象

            name: '',
            idKey: 'id', // 对象标识
            confirmStatus: false, // 确认按钮状态
            formItem: {},

            active: '_', // 当前 url
            delTip: '确认删除？', // 删除提示
        }
    },
    components: {
        selectInfo,
        curdTable
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
        }
    },
    methods: {
        // ...mapActions({'fetchTerms': 'fetchTerms',}),
        // 获取数据
        async fetchData (force) {
            this.tableStatus = true
            const msg = this.$Message.loading({
                content: 'Loading...',
                duration: 0
            })
            await this.fetch(force)
            this.tableStatus = false
            msg()
        },
        // 删除数据
        remove: function remove (selected) {
            if (!(selected instanceof Array)) {
                selected = this.selectedList
            }

            let ids = selected.map((item) => (item[this.idKey]))
            // 删除提示
            return new Promise((resolve, reject) => {
                this.$Modal.warning({
                    title: '删除提示',
                    content: this.delTip,
                    onOk: async () => {
                        try {
                            await api.npost(`/api/${this.active}/del`, {ids})
                            this.$store.dispatch('del_' + this.active, selected)
                            this.$Message.success('删除成功')
                            this.selectedList =  _.differenceBy(this.selectedList, selected, this.idKey)
                            resolve()
                        } catch (e) {
                            this.$Message.info('删除失败')
                            reject(e)
                        }
                    },
                    onCancel: reject
                })
            })
        },
        // 增加数据
        add: async function add (name) {
            this.confirmStatus = true
            let flag = true
            try {
                let result = await api.npost(`/api/${this.active}/add`, this.formItem)
                this.$store.dispatch('add_' + this.active, result)
                this.$Message.success('添加成功')
            } catch (e) {
                this.$Message.error('参数错误, 添加失败')
                flag = false
            }
            this.confirmStatus = false
            return flag
        },

        // 查询数据
        search: function search () {},

        // 选择变化
        handleSelectChange (value) {
            this.selectedList = value
            this.$emit('on-select-change', value)
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
    }
}
