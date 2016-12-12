<template>
<div id="app">
    <nav class="navbar navbar-fixed-top" >
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".nav-right">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <img alt="Brand" src="../img/logo.png">
                </a>
            </div>
            <ul class="nav navbar-nav navbar-right nav-right collapse navbar-collapse"  role="navigation">
                <li class="active"><router-link to="/" exact>首页</router-link></li>
                <li><a href="#">作品展示</a></li>
                <li><a href="#">发现</a></li>
                <li><a href="#">留言</a></li>
                <li style="margin-right:15px;"><router-link to="/_test">关于</router-link></li>

                <li><a href="#">投稿</a></li>
                <li><a href="#">登录</a></li>
                <li><a href="#">搜索</a></li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </nav>
    <router-view></router-view>
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-4">
                    <div class="widget">
                        <h4 class="title">最新文章</h4>
                        <div class="content recent-post">
                            <div class="recent-single-post">
                                <a href="javascript:;" class="post-title">什么都还么有啊</a>
                                <div class="date">2016年12月10日</div>
                            </div>
                            <div class="recent-single-post">
                                <a href="javascript:;" class="post-title">Vue 使用心得</a>
                                <div class="date">2016年12月10日</div>
                            </div>
                            <div class="recent-single-post">
                                <a  href="javascript:;" class="post-title">如何坚持</a>
                                <div class="date">2016年12月10日</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="widget">
                        <h4 class="title">友情链接</h4>
                        <ul class="content recent-post list-unstyled">
                            <li><a href="http://www.bootcss.com/">Bootstrap 中文网</a></li>
                            <li><a href="http://cn.vuejs.org/">Vue.js</a></li>
                            <li><a href="http://webpack.github.io/">Webpack</a></li>
                            <li><a href="http://router.vuejs.org/zh-cn/index.html">Vue-Router2</a></li>

                        </ul>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="widget">
                        <h4 class="title">用到的技术</h4>
                        <ul class="content recent-post list-unstyled list-inline">
                            <li><a href="javascript:;">Node</a></li>
                            <li><a href="javascript:;">Express</a></li>
                            <li><a href="javascript:;">Vue2</a></li>
                            <li><a href="javascript:;">Vue-Router</a></li>
                            <li><a href="javascript:;">Vuex</a></li>
                            <li><a href="javascript:;">jQuery</a></li>
                            <li><a href="javascript:;">七牛云服务</a></li>
                            <li><a href="javascript:;">NPM</a></li>
                            <li><a href="javascript:;">Lodash</a></li>
                            <li><a href="javascript:;">Webpack</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <div class="copyright">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <span>Copyright ©2016 Powered  <a href="http://www.mbdoge.cn">mbdoge.cn</a> </span> |
                    <span>By 酱酱酱酱油鲜的 个人博客 Version 1.0.1</span> |
                    <span>Licensed under MIT license.</span>
                </div>
            </div>
        </div>
    </div>
    <div class="gotop" id="gotop" >
        <transition name="rotate" enter-active-class="animated rollIn" leave-active-class="animated zoomOutRight">
            <a href="#top" title="回到顶部" class="icon-btn fa fa-arrow-up" id="amz-go-top" @click="goTop" v-if="gotop"></a>
        </transition >
        <a href="javascript:;" title="不知道为什么就想放个代码符合在这里" class="icon-faq icon-btn fa fa-code"></a>
    </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import store from "../store/index";

export default {
    data: () => {
        return {
            gotop:false
        }
    },
    store,
    computed: {
        ...mapGetters([
            'user'
        ]),
    },
    components: {
    },
    methods: {
        ...mapActions([
            'userSignout'
        ]),
        logout() {
            // this.userSignout();
            // this.$router.replace('/user/login');
        },
        goTop (e) {
            e.preventDefault();
            $("html, body").animate({scrollTop: 0}, 500,'swing');
        }
    },
    mounted: function () {
        $(document).scroll(() => {
            this.gotop = $(document).scrollTop() > 10;
        });
    }
}
</script>
