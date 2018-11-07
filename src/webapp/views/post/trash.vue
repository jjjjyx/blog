<template>
<div class="cm-container trash-container">
    <div class="trash-list-warp">
        <!--<Tooltip content="刷新">-->

        <!--</Tooltip>-->
        <h2 class="trash-list-warp__header">
            <Button type="text" icon="loop" @click="fetch(true)" style="float: right"></Button>
            <Tooltip content="删除的文章将在删除后的60天清除">
            回收站（{{data.length}}）
            </Tooltip>

        </h2>
        <ul class="trash-list-warp__list">
            <li class="trash--list__item" v-for="item in data" :key="item.id" @click="target = item" :class="{active: target === item}">
                <span class="float-right" >
                    <span class="trash--list__countdown">{{formatTime(item.deleteAt)}}天后</span>
                    <span class="trash--list__date">{{formatDate(item.deleteAt)}}</span><span>清除</span>
                </span>
                <color-icon type="icon-color-wenzhang" size="18" style="vertical-align: middle;"></color-icon>
                <span class="trash--list__post_name">
                    #{{item.id}} - {{item.post_title}}
                </span>
            </li>
        </ul>
    </div>
    <div class="trash-post-preview post-body-content">
        <div class="post-title-wrap">
            <h1 class="title" style="cursor: default">{{target.post_title}}</h1>
        </div>
        <div class="post-markdown-wrap markdown-body">
            <div v-html="renderContent(target.post_content)" class="markdown-content"></div>
        </div>
        <div class="trash-post-opt">
            <Button type="success" style="width: 150px" @click="revert" class="mr-2">恢复文章</Button>
            <Button type="error" style="width: 150px" @click="rm">彻底删除</Button>
        </div>
    </div>
</div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import {mavonEditor} from 'mavon-editor'
import {mapState, mapActions, mapGetters} from 'vuex'

// import crud from '@/components/crud'
// import api from '@/utils/api'

export default {
    name: 'post-trash',
    data () {
        return {
            target: {},
            active: 'post/trash',
            delTip: '彻底删除？' // 删除提示
        }
    },
    computed: {
        ...mapState({
            data: state => state.data.trashPosts
        }),
        ...mapGetters({
        })
    },
    methods: {
        ...mapActions({
            'fetchTrash': 'fetchTrash',
            'fetchPosts': 'fetchPosts',
            'revertPost': 'revertPost',
            'clearTrashPost': 'clearTrashPost'
        }),
        async fetch (force = false) {
            await this.fetchTrash(force)
            if (isEmpty(this.target)) {
                this.target = this.data[0]
            }
        },
        formatTime (_time) {
            let time = new Date(_time).getTime()
            let start = Date.now()
            let day = Math.floor((start - time) / (24 * 60 * 60 * 1000))
            return 30 - day
        },
        formatDate (_time) {
            let time = new Date(_time)
            time.setDate(time.getDate() + 30)
            return time.format('将于yyyy/MM/dd')
        },
        renderContent (content) {
            return content ? this.it.render(content) : ''
        },
        async revert () {
            try {
                await this.revertPost(this.target)
                this.$Message.success('恢复完成')
            } catch (e) {
                this.$Message.info('失败')
            }
        },
        async rm () {
            try {
                await this.clearTrashPost(this.target)
                this.target = this.data[0]
                this.$Message.success('删除成功')
            } catch (e) {
                this.$Message.info('失败')
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        // 离开前刷新下文章
        this.fetchPosts(true)
        // this.$store.dispatch('fetchPosts', true)
        next()
    },
    created () {
        this.fetch(false)
    },
    mounted () {
        this.it = mavonEditor.getMarkdownIt()
    }
}
</script>

<style scoped>
    .trash-container {
        display: flex;
        flex-direction: row;
        padding: 0;
    }
    .trash-list-warp {
        width: 300px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right:1px solid #e9eaec;
    }
    .trash-list-warp__header {
        flex-shrink: 0;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e9eaec;
    }
    .trash-list-warp__list {
        list-style: none;
        overflow-y: scroll;
    }
    .trash--list__item {
        border-left: 2px solid transparent;
        padding: 1rem 1.5rem;
    }
    .trash--list__item:hover {
        /*border-left-color: #ec5c51;*/
        background-color: #e6e6e6;
    }
    .trash--list__item.active {
        border-left-color: #ec5c51;
        background-color: #f2f2f2;
    }
    .trash--list__post_name {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        line-height: 18px;
    }
    .trash--list__date {
        display: none;
    }
    .trash--list__item:hover .trash--list__countdown {
        display: none;
    }
    .trash--list__item:hover .trash--list__date {
        display: inline;
    }

    .markdown-content {
        width: 100%;
        height: 100%;
        padding: 8px 25px 15px 25px;
        overflow-y: auto;
        box-sizing: border-box;
        overflow-x: hidden;
        background: #fbfbfb;
    }
    .trash-post-preview {
        width: 100%;
    }
    .trash-post-opt {
        text-align: center;
        padding: 1rem;
    }
</style>
