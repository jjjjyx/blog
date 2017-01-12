<style lang="less">

.headertop {
    position: relative;
    overflow: hidden;
    width: 100%;
    .centerbg {
        width: 100%;
        z-index: 0;
        height: 550px;
        // background-image: url(images/headerbg6.jpg);
        background-position: center center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        z-index: -1;
        background-image: url("http://oht47c0d0.bkt.clouddn.com/17-1-12/40769947-file_1484187390610_17ae7.png");
        filter: blur(0px);
    }
    .slant-left {
        background: #fff;
        width: 101%;
        position: absolute;
        bottom: -80px;
        right: 48%;
        height: 200px;
        transform: rotate(6deg);
    }
    .slant-right {
        background: #fff;
        width: 101%;
        position: absolute;
        bottom: -80px;
        left: 48%;
        height: 200px;
        transform: rotate(-6deg);
    }
    .focusinfo{
        position: absolute;
        width: 100%;
        max-width: 800px;
        padding: 0 10px;
        top: 35%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
    }
    .focusinfo .avatar {
        display: block;
    }
    .focusinfo .avatar>img {
        width: 120px;
        height: auto;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.3);

    }
    .focusinfo .avatar-p {
        width: 60%;
        margin: auto;
        font-size: 14px;
        color: #EAEADF;
        background: rgba(0, 0, 0, 0.66);
        padding: 20px 30px;
        margin-top: 30px;
        font-family: miranafont,"Hiragino Sans GB",STXihei,"Microsoft YaHei",SimSun,sans-serif;
        letter-spacing: 1px;
        line-height: 20px;
        white-space:nowrap;
    }

}


@media (max-width: 1280px){
.headertop .centerbg {
    display: none;
}
}
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
                手持两把锟斤拷，口中疾呼烫烫烫。<br>
                脚踏千朵屯屯屯，笑看万物锘锘锘。
            </p>
        </div>
    </div>
    <div class="index-content clearfix">
        <div class="row">
            <div class="col-md-9 articles">
                <div class="j-title">
                    <h3 class="active">最新文章</h3>
                    <!-- <span class="gapline">|</span> -->
                </div>
                <div class="recommend-post">
                    <ul class="j-article-list">
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                    </ul>
                    <p class="load-more">
                        <button class="btn gray btn-bordered">加载更多</button>
                    </p>
                </div>
            </div>
            <div class="col-md-3 sidebar">
                <div class="part">
                    <div class="j-title">
                        <h3 class="">标签</h3>
                        <!-- <span class="gapline">|</span> -->
                    </div>
                    <div class="tags">
                        <a class="tag">java</a>
                        <a class="tag">javascript</a>
                        <a class="tag">node</a>
                        <a class="tag">渗透</a>
                        <a class="tag">struts2</a>
                        <a class="tag">。。。</a>
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
import store from "./store/index";
import BlobHeader from "./components/head.vue";
import BlobFooter from "./components/bottom.vue";

// import Head from "../components/head";


export default {
    data: () => {
        return {
            msg: "hello world"
        }
    },
    store,
    computed: {
        ...mapGetters([
            'user'
        ]),
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    methods: {
        ...mapActions([
            'userSignout'
        ])
    },
    mounted: function() {

    }
}

</script>
