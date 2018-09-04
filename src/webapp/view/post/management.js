import _ from 'lodash'
import Vue from 'vue'
import {mapState, mapActions} from 'vuex'
import {dateFormat} from '@/utils/common'
import curd from '@/components/curd/curd.vue'
import api from '@/utils/api'
import PostTitle from './col/post-title'

Vue.component('post-title', PostTitle)
const renderTitle = function (h, {row}) {
    return h('post-title', {
        props: {post: row},
        on: {
            trash: this.trash
        }
    })
}

const renderAuthor = function (h, {row}) {
    return h('span', row.user.user_nickname)
}
const renderCategory = function (h, {row}) {
    let category = _.find(row.terms, ['taxonomy', 'category'])
    return h('Tooltip', {
        props: {
            content: category.description
        }
    }, category.name)
}
const renderTags = function (h, {row}) {
    let tags = _.filter(row.terms, ['taxonomy', 'post_tag'])
    let $tags = tags.map((tag) => {
        return h('Tooltip', {
            props: {
                content: tag.description || tag.name
            }
        }, [
            h('Tag', {props: {type: 'border'}}, tag.name)
        ])
    })
    return $tags
}
const renderDate = function (h, {row}) {
    let flag
    let date
    if (row.post_status === 'publish') {
        flag = h('span', {domProps: {className: 'd-block'}}, '发布时间')
        date = h('span', dateFormat(row.post_date))
    } else {
        flag = h('span', {domProps: {className: 'd-block'}}, '最后修改时间')
        date = h('span', dateFormat(row.updatedAt))
    }
    return [flag, date]
}

export default {
    name: 'post-management',
    data () {
        return {
            name: '文章',
            columns: [
                {type: 'selection', width: 40, align: 'center'},
                {title: '#', key: 'id', sortable: true, width: 70},
                {title: '标题', key: 'size', sortable: true, render: renderTitle.bind(this)},
                {title: '作者', key: 'auth', sortable: true, width: 220, render: renderAuthor.bind(this)},
                {title: '类别', key: '', width: 100, render: renderCategory.bind(this)},
                {title: '标签', key: '', width: 210, render: renderTags.bind(this)},
                {title: '评论', key: '', width: 80, sortable: true},
                {title: '日期', key: '', width: 220, render: renderDate.bind(this)}
            ],
            formItem: {key: '', term: 'any', status: 'all'},
            // selectedList: [],
            url: 'post'
            // delTip: '<p>确认?</p><p>删除分类不会删除分类下的文章</p>'
        }
    },
    components: {
        curd
    },
    computed: {
        ...mapState({
            data: state => state.data.posts
        })
        // selectedNum: function () {
        //     return this.selectedList.length
        // },
    },
    methods: {
        ...mapActions({
            'fetchPosts': 'fetchPosts'
            // 'trash': 'trashPosts'
        }),
        async trash (selected) {
            // 删除数据
            if (!(selected instanceof Array)) {
                return
            }
            let ids = selected.map((item) => (item.id))
            try {
                await api.npost(`/api/${this.action}/trash`, {ids})
                this.$store.dispatch('del_' + this.action, selected)
            } catch (e) {
                this.$Message.info('删除失败')
            }
        },
        newPost () {
            this.$router.push({name: 'post_writer', query: {active: 'new'}})
        }
        // handleSelectChange (value) {
        //     this.selectedList = value
        // },
    },
    render (h) {
        let props = {
            name: this.name,
            columns: this.columns,
            data: this.data,
            url: this.url,
            fetch: this.fetchPosts,
            formItem: this.formItem,
            pageSize: 11
        }
        let formItem = this.formItem
        return <curd class="cm-container" ref="curd" {...{
            props,
            scopedSlots: {
                'form-buttons': scope => {
                    let newpb = <i-button slot="form-buttons" type="ghost" icon="document" class="mr-2" onClick={this.newPost}>新建文章</i-button>
                    let tb = <i-button slot="form-buttons" type="ghost" icon="trash-a" disabled={scope.selectedNum === 0}>移至回收站</i-button>
                    return [newpb, tb]
                }
            }
        }
        }>
            <form-item label="类别" slot="form-items">
                <i-select on-input={e => (formItem.term = e)} {...{props: {value: formItem.term}}}>
                    <i-option value="any">不限</i-option>
                </i-select>
            </form-item>
            <form-item label="状态" slot="form-items">
                <i-select on-input={e => (formItem.status = e)} {...{props: {value: formItem.status}}}>
                    <i-option value="all">所有</i-option>
                </i-select>
            </form-item>
        </curd>
    },
    mounted () {
    }
}
