<template>
    <div id="app">
        <blob-header></blob-header>
        <div class="blank"></div>
        <section class="wrapper">
            <div class="am-container article-page">
                <article>
                    <h1>在ubuntu 配置Nginx 反向代理</h1>
                    <div class="post-info ">
                        <span class="category">作者</span>
                        <a  class="name am-text am-text-default">酱酱酱酱油鲜</a>
                        <p class="meta am-margin-top-xs am-margin-bottom-0 am-link-muted am-text-xs" style>
                            <span class="publish-time">2015.11.26 16:23</span>
                            <span class="wordage">字数 554</span>
                            <span class="views-count">阅读 2447</span>
                            <span class="comments-count">评论 0</span>
                            <span class="likes-count">喜欢 2</span>
                        </p>
                    </div>
                    <div class="inner">
                        1312312
                    </div>
                </article>
            </div>
        </section>
        <f-gotop></f-gotop>
    </div>
</template>
<script>
import BlobHeader from "../components/head.vue";
import FGotop from "../components/gotop";
import * as api from "../../public/js/api.js";
export default {
    data: function() {
        return {
            haa:'hello'
        }
    },
    components: {
        BlobHeader,
        FGotop
    },
    computed: {

    },
    methods: {

    },
    mounted: function() {
        console.log("文章展示页面");
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
}
</script>
