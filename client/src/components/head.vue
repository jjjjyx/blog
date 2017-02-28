

<template>

<header class="am-topbar am-topbar-fixed-top bootsnav">
    <div class="top-search" :class="{active:isSearchShow}">
            <div class="am-container">
                <div class="input-group">
                    <span class="input-group-addon"><i class="am-icon-search"></i></span>
                    <input type="text" class="form-control" placeholder="Search">
                    <span class="input-group-addon close-search" @click="isSearchShow = false"><i class="am-icon-times"></i></span>
                </div>
            </div>
        </div>
    <div class="am-container">
        <a href="#" class="am-topbar-brand">
          <!-- <a href="#" class="am-text-ir">Amaze UI</a> -->
          <img src="../../public/img/logo.png" class="logo" alt="">
        </a>

        <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#doc-topbar-collapse'}">
            <span class="am-sr-only">导航切换</span>
            <span class="am-icon-bars"></span>
        </button>
        <div class="attr-nav">
            <ul>
                <li class="search"><a href="#" @click="isSearchShow = !isSearchShow"><i class="am-icon-search"></i></a></li>
            </ul>
        </div>
        <div class="am-collapse am-topbar-collapse" id="doc-topbar-collapse">

            <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right">
                <li><a href="#">首页</a></li>
                <li><a href="#">标签</a></li>
                <li><a href="#">关于我</a></li>
                <li><a href="#">作品</a></li>
                <li><a href="#">BUG集锦</a></li>
            </ul>
        </div>

    </div>
</header>

</template>

<script>


export default {
    data: () => {
        return {
            isGoTopShow: false,
            isSearchShow: false
        }
    },
    mounted: function() {
        let h1 = 0;
        let h2 = 25;
        let ss = $(document).scrollTop();
        $(document).scroll(() => {
            let s = $(document).scrollTop();

            this.isGoTopShow = s > 10;
            if (s == h1) {
                $('.bootsnav').removeClass('yya');
            }
            if (s > h1) {
                $('.bootsnav').addClass('yya');
            }
            if (s > h2) {
                $('.bootsnav').addClass('gizle');
                if (s > ss) {
                    $('.bootsnav').removeClass('sabit');
                    this.$emit("sabit",true);
                } else {
                    $('.bootsnav').addClass('sabit');
                    this.$emit("sabit",false);
                }
                ss = s;
            }
        });
    }
}

</script>
