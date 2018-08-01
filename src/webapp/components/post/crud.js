import _ from 'lodash'
import {on} from '@/utils/dom'
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
        }
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
