<template>
    <div class="post-table-title-wrap">
        <div class="post-table-title">
            <!--已发布的不显示 -->
            <a>{{post.post_title || '（无标题）'}}</a>
            <template v-if="post.post_status !== 'publish'">
                -- <span>{{postStatus[post.post_status]}}</span>
            </template>
        </div>
        <div class="post-table-content">
            这是内容
        </div>
        <ButtonGroup size="small" class="post-table-options">
            <Button type="ghost">编辑</Button>
            <Button type="ghost" style="color: rgb(237, 63, 20);">移至回收站</Button>
            <Button type="ghost">预览</Button>
        </ButtonGroup>
    </div>
</template>

<script>
import {mapGetters} from 'Vuex'
export default {
    name: 'post-title',
    computed: {
        ...mapGetters(['postStatus'])
    },
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
    .post-table-title-wrap {
        padding: 12px 0;
    }
    .post-table-content {
        margin-bottom: .5em;
    }
    .post-table-title {
        font-size: 14px;
    }
    .post-table-options {
        opacity: 0;
        pointer-events: none;
    }
    .ivu-table-row-hover .post-table-options {
        opacity: 1;
        pointer-events: all;
    }
</style>
