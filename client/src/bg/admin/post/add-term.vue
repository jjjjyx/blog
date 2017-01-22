<template>
<div class="row-content am-cf">
    <div class="row  am-cf">
        <div class="left-sidebar add-post" >
            <div class="new-tags ">
                <a class="am-badge am-badge-success am-round" @click="showAddTag"><i class="am-icon-plus"></i> 添加新分类</a>
                <!-- <transition name="custom-classes-transition" enter-active-class="animated slide in" leave-active-class="animated slide out" > -->
                    <form class="new-tags-form am-form">
                        <input type="text" placeholder="请输入分类名称" class="am-padding-xs" v-model="newTerm.name"/>
                        <button type="button" class="am-btn am-btn-danger am-btn-xs" @click="add">新建</button>
                        <a class="am-btn am-btn-link am-btn-xs" @click="showAddTag">取消</a>
                    </form>
                <!-- </transition> -->
            </div>
            <ul class="sidebar-nav">
                <li class="sidebar-nav-link" v-for="(item,index) in termList">
                    <a href="javascript:;" class="sidebar-nav-sub-title" :class="{active:active =='first'?(index==0):(item.term_id==active)}">
                        <i class="am-icon-tag sidebar-nav-link-logo"></i> {{item.name}}
                        <span class="am-icon-cog am-fr am-margin-right-sm sidebar-nav-sub-ico" v-if="active =='first'?(index==0):(item.term_id==active)"></span>
                    </a>
                </li>
            </ul>
        </div>
        <!-- <div class="middle-warpper">
            222
        </div>
        <div class="right-warpper">
            33
        </div> -->
        <router-view class="middle-warpper" ></router-view>
        <router-view class="right-warpper" name="rightW"></router-view>
    </div>
</div>
</template>
<style lang="less" scoped>
    @leftWidth :240px;
    @middleWidth :280px;
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
        width: @leftWidth;
        top: 1px;
        border-left: 1px solid #e9ecf3;
    }
    .middle-warpper {
        transition: all 0.4s ease-in-out;
        width: 280px;
        height: 100%;
        position: absolute;
        background-color: #fff;
        left: @leftWidth+1;
        top: 1px;
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
        margin-left: @leftWidth+@middleWidth+2-10;
        margin-top: -20px;

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
//
import {getAllTerm,addTerm} from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            isShowNewTage: false,
            termList:[],
            active:'first',
            newTerm:{
                name:''
            }
        }
    },
    components: {},
    computed: {
        // ...mapGetters
        // active(){
        //
        //     if(this.termList.length){
        //         console.log(this.$route.params.id , this.termList[0].term_id,222);
        //         return (this.$route.params.id || this.termList[0].term_id)
        //     }else{
        //         return false;
        //     }
        // }
    },
    methods: {
        ...mapMutations([
            'toggleSidebar'
        ]),
        showAddTag(){
            $('.new-tags-form ').slideToggle(500);
            this.newTermName = '';
        },
        add () {
            addTerm(this.newTerm);
        }
        // action(){

        // }
    },
    mounted: async function() {
        // console.log(this.$route.params.id)
        this.toggleSidebar(true);
        let [code,list] = await getAllTerm();
        // console.log(s);
        if(code ==0){
            this.termList = list;
            this.active = this.$route.params.term_id||this.active;
        }else{

        }

    }
}
</script>
