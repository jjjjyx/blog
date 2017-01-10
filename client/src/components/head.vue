<template>
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
                <a class="navbar-brand" href="#brand"><img src="../../public/img/logo.png" class="logo" alt=""></a>
            </div>
            <!-- End Header Navigation -->

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="navbar-menu">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">首页</a></li>
                    <li><a href="#">标签</a></li>
                    <li><a href="#">关于我</a></li>
                    <li><a href="#">作品</a></li>
                    <li><a href="#">BUG集锦</a></li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div>
    </nav>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data: () => {
        return {
            isGoTopShow:false,
            isSearchShow:false
        }
    },
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
