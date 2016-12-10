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
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import store from "../store/index";

export default {
    data: () => {
        return {

        }
    },
    store,
    computed: mapGetters([
        'user'
    ]),
    components: {
    },
    methods: {
        ...mapActions([
            'userSignout'
        ]),
        logout() {
            // this.userSignout();
            // this.$router.replace('/user/login');
        }
    },
    mounted: function () {

    }
}
</script>
