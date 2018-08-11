<template>
    <div class="cms-table-title-wrap">
        <div class="post-table-title">
            <!--已发布的不显示 -->
            <!--<a>{{post.post_title || '（无标题）'}}</a>-->
            <router-link :to="{name: 'post_writer', query: {poi: post.id}}">{{post.post_title || '（无标题）'}}</router-link>
            <template v-if="post.post_status !== 'publish'">
                -- <span>{{postStatusDict[post.post_status]}}</span>
            </template>
        </div>
        <div class="post-table-content">
            这是内容
        </div>
        <button-group size="small" class="cms-table-options">
            <i-button type="ghost">编辑</i-button>
            <i-button type="ghost" style="color: rgb(237, 63, 20);" @click="$emit('trash')">移至回收站</i-button>
            <i-button type="ghost">预览</i-button>
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

<style scoped>
    .post-table-title {
        font-size: 14px;
    }
    .post-table-content {
        margin-bottom: .5em;
    }
</style>
