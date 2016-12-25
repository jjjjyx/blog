<template>
<div id="app">
    <nav class="navbar navbar-default bootsnav navbar-fixed-top">
        <!-- Start Top Search -->
        <div class="top-search" :class="{active:isSearchShow}">
            <div class="container">
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                    <input type="text" class="form-control" placeholder="Search">
                    <span class="input-group-addon close-search" @click="isSearchShow = false"><i class="fa fa-times"></i></span>
                </div>
            </div>
        </div>
        <!-- End Top Search -->

        <div class="container">
            <!-- Start Atribute Navigation -->
            <div class="attr-nav">
                <ul>
                    <li class="search"><a href="#" @click="isSearchShow = !isSearchShow"><i class="fa fa-search"></i></a></li>
                </ul>
            </div>
            <!-- End Atribute Navigation -->

            <!-- Start Header Navigation -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">
                    <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand" href="#brand"><img src="../img/logo.png" class="logo" alt=""></a>
            </div>
            <!-- End Header Navigation -->

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="navbar-menu">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">首页</a></li>
                    <li><a href="#">归档</a></li>
                    <li><a href="#">发现</a></li>
                    <li><a href="#">关于我</a></li>
                    <li><a href="#">作品</a></li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div>
    </nav>
    <!-- #masthead -->
    <div class="blank"></div>

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
            <a href="#top" title="回到顶部" class="icon-btn fa fa-arrow-up" id="amz-go-top" @click="goTop" v-show="isGoTopShow"></a>
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
            isGoTopShow:false,
            isSearchShow:false
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
        let h1 = 0;
        let h2 = 25;
        let ss = $(document).scrollTop();
        $(document).scroll(() => {
            let s = $(document).scrollTop();

            this.isGoTopShow = s > 10;
    		if(s== h1){
    			$('.bootsnav').removeClass('yya');
    		}if(s > h1){
    			$('.bootsnav').addClass('yya');
    		}if(s > h2){
    			$('.bootsnav').addClass('gizle');
    			if(s > ss){
    				$('.bootsnav').removeClass('sabit');
    			}else{
    				$('.bootsnav').addClass('sabit');
    			}
    			ss = s;
    		}
        });
    }
}
</script>
