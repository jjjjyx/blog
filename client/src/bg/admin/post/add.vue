<template>
    <div class="row-content am-cf">
        <div class="row  am-cf">
            <div class="left-sidebar add-post" >
                <div class="new-tags ">
                    <a class="am-badge am-badge-success am-round" @click="showAddTag"><i class="am-icon-plus"></i> 添加新分类</a>
                    <!-- <transition name="custom-classes-transition" enter-active-class="animated slide in" leave-active-class="animated slide out" > -->
                        <form class="new-tags-form am-form">
                            <input type="text" placeholder="请输入分类名称" class="am-padding-xs"/>
                            <button type="button" class="am-btn am-btn-danger am-btn-xs">新建</button>
                            <a class="am-btn am-btn-link am-btn-xs" @click="showAddTag">取消</a>
                        </form>
                    <!-- </transition> -->
                </div>
                <ul class="sidebar-nav">
                    <li class="sidebar-nav-link">
                        <a href="javascript:;" class="sidebar-nav-sub-title">
                            <i class="am-icon-tag sidebar-nav-link-logo"></i> javascript
                            <span class="am-icon-cog am-fr am-margin-right-sm sidebar-nav-sub-ico"></span>
                        </a>
                    </li>
                    <li class="sidebar-nav-link">
                        <a href="javascript:;" class="sidebar-nav-sub-title">
                            <i class="am-icon-tag sidebar-nav-link-logo"></i> node
                            <span class="am-icon-cog am-fr am-margin-right-sm sidebar-nav-sub-ico"></span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="middle-warpper">
                222
            </div>
            <!-- <div class="right-warpper"> -->
            <!-- </div> -->

</template>
<style lang="less" scoped>
    @keyframes slideInY {
      0% {
          height: 0;
          opacity: 0;
        //   transform: scaleY(0);
      }
      100% {
        opacity: 1;
        height: auto;
        // transform: scaleY(1);
      }
    }
    @keyframes slideOutY {
      0% {
        opacity: 1;
                transform: scaleY(1);
      }
      100% {
        opacity: 0;
                transform: scaleY(0);
      }
    }
    .left-sidebar {
        top: 1px;
        border-left: 1px solid #e9ecf3;
    }
    .middle-warpper {
        transition: all 0.4s ease-in-out;
        width: 240px;
        height: 100%;
        position: absolute;
        background-color: #fff;
    }
    .theme-black {
        .left-sidebar {
            border-left: 1px solid #3a4144;
        }
    }
    .slide.in {
        animation-name: slideInY;
        transform-origin: top center;
    }
    .slide.out {
        animation-name: slideOutY;
        transform-origin: top center;
    }
    .right-warpper {
        position: relative;;
        margin-left: 240px;
    }
    .new-tags {
        padding: 0 15px 15px;
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
        .am-badge {
            padding: 8px 15px;
            font-size: 1.4rem;

        }
        .new-tags-form {
            display: none;
            margin: 10px 0 0;
            text-align: left;
        }
        .new-tags-form input{
            padding: .5rem;
            font-size: 1.2rem;
            margin-bottom: .5rem;
        }
    }
</style>
<script>
// import
import { mapGetters, mapActions,mapMutations } from 'vuex'
export default {
    data: function() {
        return {
            isShowNewTage: false,
        }
    },
    components: {},
    computed: {
        // ...mapGetters
    },
    methods: {
        ...mapMutations([
            'toggleSidebar'
        ]),
        showAddTag(){
            $('.new-tags-form ').slideToggle(500);
        }
    },
    mounted: function() {
        // console.log(this.$route)
        this.toggleSidebar(true);
    }
}
</script>
