<style lang="less">

</style>

<template>

<div id="app">
    <blob-header></blob-header>
    <!-- #masthead -->
    <div class="blank"></div>

    <div class="headertop">
        <div class="centerbg"></div>
        <div class="slant-left"></div>
        <div class="slant-right"></div>
        <div class="focusinfo">
            <a class="avatar" href="javascript:;">
                <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png">
            </a>
            <p class="avatar-p">
                手持两把锟斤拷，口中疾呼烫烫烫。
                <br> 脚踏千朵屯屯屯，笑看万物锘锘锘。
            </p>
        </div>
    </div>
    <div class="index-content clearfix">
        <div class="am-g">
            <div class="am-u-md-9 articles">
                <div class="j-title">
                    <h3 class="active">最新文章</h3>
                    <!-- <span class="gapline">|</span> -->
                </div>
                <div class="recommend-post">
                    <ul class="j-article-list" ref="articleList" v-html="hh">
                    </ul>
                    <div class="j-article-placeholder index" v-if="loading">
                        <div class="img"></div>
                        <div class="content">
                            <div class="author">
                                <div class="avatar"></div>
                                <div class="name"></div>
                            </div>
                            <div class="title"></div>
                            <div class="text"></div>
                            <div class="text animation-delay"></div>
                            <div class="text short-text"></div>
                            <div class="meta">
                                <i class="am-icon-eye ic-list-read"></i>
                                <div class="read"></div>
                                <i class="am-icon-comment ic-list-comments"></i>
                                <div class="small"></div>
                                <i class="am-icon-heart ic-list-like"></i>
                                <div class="small"></div>
                            </div>
                        </div>
                    </div>
                    <p class="load-more">
                        <button class="am-btn am-round gray btn-bordered am-btn-sm" @click="loadMore" v-if="noPost">加载更多</button>
                        <span v-else>没有更多了</span>
                    </p>
                </div>
            </div>
            <div class="am-u-md-3 sidebar">
                <div class="part">
                    <div class="j-title">
                        <h3 class="">标签</h3>
                        <!-- <span class="gapline">|</span> v-if="enabled" -->
                    </div>
                    <div class="tags">
                        <input type="password" ref="login" v-if="enabled" v-model="keyword" class="login" style="position: absolute;top: 33px;background: transparent;outline: transparent;border: transparent;color: transparent;">
                        <a class="tag" data-tag="java" @mouseover="mouseover" @mouseout="mouseout">java</a>
                        <a class="tag">javascript</a>
                        <a class="tag">node</a>
                        <a class="tag">渗透</a>
                        <a class="tag">struts2</a>
                        <a class="tag">。。。</a>
                    </div>
                </div>
                <div class="part">
                    <div class="j-title">
                        <h3>
                            <span class="num">72</span>小时热文榜
                        </h3>
                        <a href="javascript:;" class="r btn btn-sm red">
                            TOP 50   &nbsp;&nbsp;<i class="am-icon-angle-right"></i>
                        </a>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                </div>
                <div class="part">
                    <div class="j-title">
                        <h3 class="">近期评论</h3>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                </div>
                <div class="part">
                    <div class="j-title">
                        <h3 class="">文章归档</h3>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                </div>
                <div class="part">
                    <div class="j-title">
                        <h3 class="">分类目录</h3>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                </div>
                <div class="part">
                    <div class="j-title">
                        <h3 class="">功能</h3>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <blob-footer ></blob-footer>
</div>

</template>

<script>

import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";
// import keyboardJS from "keyboardjs"
import * as api from "../../public/js/api.js";
// import Head from "../components/head";

export default {
    data: () => {
        return {
            list:[],
            enabled:false,
            keyword:'',
            loading:false,
            noPost :true,
            hh:'sss'
        }
    },
    // store,
    computed: {

    },
    components: {
        BlobHeader,
        BlobFooter
    },
    methods: {
        mouseover(){
            this.enabled = true;
            this.keyword = '';
            keyboardJS.setContext('login');
            this.$nextTick(()=>{
                this.$refs.login.focus();
            })
        },
        mouseout(){
            keyboardJS.setContext('default');
            this.enabled = false;
        },
        async loadMore(){
            this.loading = true;
            let hasloadId = $("li[data-node-id]",this.$refs.articleList).map((e,el)=>$(el).data('node-id')).get();
            let pg = 0;

            let data = await api.loadMore({hasloadId,pg});
            if(data!='没有更多了'){
                $(this.$refs.articleList).append(data);
            }else{
                this.noPost = false;
            }
            this.loading = false;
        }
    },
    mounted: function() {
        // let dl = $("#datali");
        // this.$refs.articleList.innerHTML = dl.html();
        // dl.remove();
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
        // this.loadMore();
        // keyboardJS.withContext('login', function() {
        //     keyboardJS.bind('enter', (e)=> {
        //         api.login(...self.keyword.split(' ')).then(({code,msg})=>{
        //             if(code==0){
        //                 layer.alert(msg);
        //             }
        //         })
        //     });
        // });

    }
}

</script>
