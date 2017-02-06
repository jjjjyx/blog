<template>
    <div >
        <div class="new-post ">
            <a href="javascript:;" class="am-text-xs am-padding am-block am-link-muted " @click="addPost" v-disabled="!addPostBtnDisabled" :class="{'am-disabled':addPostBtnDisabled}">
                <i class="am-icon-edit am-text-lg"></i> <span style="vertical-align: text-bottom;">新建文章</span>
                <span class="typing_loader" v-show="addPostBtnDisabled"></span>
            </a>
        </div>
        <ul class="am-list post-list">
            <li class="active item">
                <i class="am-icon-file"></i>
                <a class="post-title am-text-truncate">
                    无标题
                </a>
                <p class="abbreviate am-text-truncate">爱上当看见爱上快乐到家了asdaskdhasdkhash</p>
                <p class="wordage am-text-xs">字数：0</p>
                <div class="am-dropdown post-opt" data-am-dropdown>
                  <!-- <button class="am-btn am-btn-primary am-dropdown-toggle" data-am-dropdown-toggle>下拉列表 <span class="am-icon-caret-down"></span></button> -->
                  <i class="am-icon-cog am-dropdown-toggle"  data-am-dropdown-toggle></i>
                  <ul class="am-dropdown-content am-text-xs">
                    <li><a >直接发布</a></li>
                    <li class="am-divider"></li>
                    <li><a >移动文章</a></li>
                    <li><a >历史版本</a></li>
                    <li><a >删除文章</a></li>
                    <li class="am-divider"></li>
                    <li><a >属性</a></li>
                  </ul>
                </div>
            </li>
            <li class="item">1</li>
        </ul>
    </div>
</template>
<script>
import * as api from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            addPostBtnDisabled:false,
        }
    },
    components: {},
    computed: {

    },
    methods: {
        async addPost(){
            if(!this.addPostBtnDisabled){
                this.addPostBtnDisabled = true;
                let data = await api.addPost({
                    post_title:'无标题文章',
                    term_id:11
                });

                // setTimeout(()=>this.addPostBtnDisabled = false,2000)
            }
        }
    },
    watch: {
    // 如果路由有变化，会再次执行该方法
        '$route':function(){
            // console.log(1111);
        }
    },
    mounted: function() {
        $('.post-opt').dropdown();
    }
}
</script>
<style lang="less" scoped>
    .post-list {
        li.item {
            position: relative;
            max-height: 90px;
            height: 90px;
            background-color: transparent;
            border-top: 1px solid #eee !important;
            border-left: 5px solid transparent !important;
            border-bottom-color: transparent;
            border-right: transparent;
            &.active {
                border-left-color: #3bb4f2 !important;
            }
            &:hover {
                background-color: #ececec;
            }
        }
        li.item>p{
            color: rgb(85, 85, 85);
            margin: 0;
            transition: color 0.35s linear;
        }
        li.item>.post-title{
            display: block;
            padding: 15px 30px 15px 60px;
            margin: 0;
            font-size: 18px;
            height: 90px;
            line-height: 36px;
            color: #2f2f2f;
            background-color: transparent;
        }
        li.item>i.am-icon-file{
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 3rem;
            color: #c6b281;
        }
        li.item>.abbreviate {
            cursor: pointer;
            position: absolute;
            top: 40px;
            left: 60px;
            right: 40px;
            max-height: 30px;
            height: 30px;
            margin: 0;
            font-size: 11px;
            font-weight: normal;
            line-height: 30px;
        }
        li.item>.wordage {
            position: absolute;
            bottom: 5px;
            left: 5px;
            font-family: -apple-system, "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
            font-size: 9px;
            font-weight: normal;
            line-height: 16px;
        }
        li.item>.post-opt{
            position: absolute;
            padding: 0;
            right: 26px;
            top: 35px;
            font-size: 16px;
            color: #a0a0a0 !important;
            z-index: 3;
            i.am-icon-cog{

            }
        }
    }
    .theme-black {
        .am-link-muted {
            color: #868E8E;
            &:hover {
                color: #fff;
            }
        }
        .post-list {
            li {
                border-top: 1px solid #282d2f !important;
                color: #868E8E;
                &.active {
                    border-left-color: #3bb4f2;
                }
                &:hover {
                    color: #fff;
                    background-color: #232829;
                }
            }
        }
    }
    /*Typing Loader*/
.typing_loader{
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: typingBlack 1s linear infinite alternate;
    margin: 0; /* Not necessary- its only for layouting*/
    position: relative;
    top: -3px;
}
.theme-black{
    .typing_loader{
        animation: typing 1s linear infinite alternate;
    }
}


@keyframes typing{
   0%{
        background-color: rgba(255,255,255, 1);
        box-shadow: 8px 0px 0px 0px rgba(255,255,255,0.2),
                    16px 0px 0px 0px rgba(255,255,255,0.2);
      }
    25%{
        background-color: rgba(255,255,255, 0.4);
        box-shadow: 8px 0px 0px 0px rgba(255,255,255,2),
                    16px 0px 0px 0px rgba(255,255,255,0.2);
    }
    75%{ background-color: rgba(255,255,255, 0.4);
        box-shadow: 8px 0px 0px 0px rgba(255,255,255,0.2),
                    16px 0px 0px 0px rgba(255,255,255,1);
      }
}


@keyframes typingBlack{
   0%{
        background-color: rgba(0,0,0, 1);
        box-shadow: 8px 0px 0px 0px rgba(0,0,0,0.2),
                    16px 0px 0px 0px rgba(0,0,0,0.2);
      }
    25%{
        background-color: rgba(0,0,0, 0.4);
        box-shadow: 8px 0px 0px 0px rgba(0,0,0,2),
                    16px 0px 0px 0px rgba(0,0,0,0.2);
    }
    75%{ background-color: rgba(0,0,0, 0.4);
        box-shadow: 8px 0px 0px 0px rgba(0,0,0,0.2),
                    16px 0px 0px 0px rgba(0,0,0,1);
      }
}
</style>
