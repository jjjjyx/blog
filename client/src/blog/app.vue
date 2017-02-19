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
                    <ul class="j-article-list" ref="articleList">
                         <li>
                            <div class="content">
                                <h4 class="title"><a>前端后端分离，怎么解决SEO优化的问题呢？</a></h4>
                                <div class="options am-fr">
                                    <a class="read" >
                                        <i class="am-icon-eye"></i>
                                        <span class="num">392</span>
                                    </a>
                                    <a class="comment" >
                                        <i class="am-icon-comment-o"></i>
                                        <span class="num">3</span>
                                    </a>
                                    <a class="like" >
                                        <i class="am-icon-heart-o"></i>
                                        <span class="num">3</span>
                                    </a>
                                </div>
                                <div class="meta am-margin-vertical-xs">
                                    <a title="酱酱酱酱油鲜" class="name">酱酱酱酱油鲜</a> 2017-02-13 11:15:26
                                </div>
                                <p class="">
                                     所谓的前后端分离，到底是分离什么呢？其实就是页面的渲染工作，之前是后端渲染好页面，交给前端来显示，分离后前端需要自己拼装html代码，然后再显示。前端来管理页面的渲染有很多好处，比如减少网络请求量，制作单页面应用等。事情听起来简单，但这么一分离又会牵扯到很多问..
                                </p>
                                <div class="j-category-tag">
                                    <a class="category">java</a>
                                    <i class="am-icon-tags"></i>
                                    <a>c++</a>
                                    <a>.net</a>
                                </div>
                            </div>
                         </li>

                    </ul>
                    <div class="j-article-placeholder index">
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
                        <button class="am-btn am-round gray btn-bordered am-btn-sm" @click="loadMore">加载更多</button>
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
    <blob-footer></blob-footer>
</div>

</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import store from "../store/index";
import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";
import keyboardJS from "keyboardjs"
import * as api from "../../public/js/api.js";
// import Head from "../components/head";


export default {
    data: () => {
        return {
            list:[],
            enabled:false,
            keyword:'',
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
            let data = await api.loadMore(0);
            $(this.$refs.articleList).append(data);
            console.log(data);
        }
    },
    mounted: function() {
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
        let self = this;
        keyboardJS.withContext('login', function() {
            keyboardJS.bind('enter', (e)=> {
                api.login(...self.keyword.split(' ')).then(({code,msg})=>{
                    if(code==0){
                        layer.alert(msg);
                    }
                })
            });
        });

    }
}

</script>
