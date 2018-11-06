<template>
    <div class="curd-table-title-wrap">
        <div class="post-table-title">

            <!--<a>{{post.post_title || '（无标题）'}}</a>-->
            <router-link :to="{name: 'post_writer', query: {poi: post.id}}">{{post.post_title || '（无标题）'}}</router-link>
            <!--已发布的不显示 -->
            <template v-if="post.post_status !== 'publish'">
                -- <span>{{postStatusDict[post.post_status]}}</span>
            </template>
        </div>
        <div class="post-table-content">
            这是内容
        </div>
        <button-group size="small" class="curd-table-options">
            <i-button :to="{name: 'post_writer', query: {poi: post.id}}">编辑</i-button>
            <i-button style="color: rgb(237, 63, 20);" @click="$emit('trash', [post])">移至回收站</i-button>
            <i-button >预览</i-button>
        </button-group>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import {mavonEditor} from 'mavon-editor'
// console.log(mavonEditor.getMarkdownIt())
// import api from '@/utils/api'
export default {
    name: 'post-title',
    computed: {
        ...mapGetters(['postStatusDict'])
    },
    props: {
        post: {
            type: Object,
            required: true
        }
    },
    methods: {
    }
}
</script>
