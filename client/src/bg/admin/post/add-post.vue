<template>
    <div >
        <div class="new-post ">
            <a href="javascript:;" class="am-text-xs am-padding am-block am-link-muted " @click="newPost" v-disabled="!addPostBtnDisabled" :class="{'am-disabled':addPostBtnDisabled}">
                <i class="am-icon-edit am-text-lg"></i> <span style="vertical-align: text-bottom;">新建文章</span>
                <span class="typing_loader" v-show="addPostBtnDisabled"></span>
            </a>
        </div>
        <ul class="am-list post-list" v-if="list.length">
            <li class="item" v-for="item in list" @click="pathappend(item)" :class="{'active':currentPost.id==item.id}">
                <i class="am-icon-file"></i>
                <a class="post-title am-text-truncate">
                    {{item.post_title}}
                </a>
                <p class="abbreviate am-text-truncate">{{item.post_content}}</p>
                <p class="wordage am-text-xs" v-if="item.post_content&&item.post_content.length">字数：{{item.post_content.length}}</p>
                <div class="am-dropdown post-opt am-fr" data-am-dropdown v-if="currentPost.id==item.id">
                  <i class="am-icon-cog am-dropdown-toggle"  data-am-dropdown-toggle></i>
                  <ul class="am-dropdown-content am-text-xs">
                    <li><a >直接发布</a></li>
                    <li class="am-divider"></li>
                    <li><a >移动文章</a></li>
                    <li><a >历史版本</a></li>
                    <li><a @click="del(item)">删除文章</a></li>
                    <li class="am-divider"></li>
                    <li><a >属性</a></li>
                  </ul>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            addPostBtnDisabled:false,
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'isActiveId',
            'postsList',
            'currentPost'
        ]),
        list(){
            return _.orderBy(this.postsList,'seq_in_nb')
        }
    },
    methods: {
        async newPost(){
            if(!this.addPostBtnDisabled){
                this.addPostBtnDisabled = true;
                let seq_in_nb = this.list.length===0 ? 0 : (_.first(this.list).seq_in_nb)-1
                let data = await api.addPost({
                    post_title:'无标题文章',
                    term_id:this.isActiveId,
                    seq_in_nb
                });

                if(data.code==0){
                    this.addPost({
                        obj:data.data,
                        index:0
                    });
                }
                this.addPostBtnDisabled = false;
                // setTimeout(()=>this.addPostBtnDisabled = false,2000)
            }
        },
        pathappend(item){
            if(item.id != this.currentPost.id){
                this.$router.push({ path: `/tag/${this.isActiveId}/post/${item.id}`})
            }
        },
        del(item){
            let self = this;
            layer.confirm(`确认删除文章《${item.post_title}》，文章将被移动到回收站，您可以在那里恢复它。60天后将被彻底删除。`,{
                btn: ['确定','取消'] //按钮
            },async function(){
                let data = await api.delPost(item.id);
                if(data.code ==0){
                     self.$router.replace({ path: `/tag/${self.isActiveId}/post/`});
                     self.delPost(item.id);
                     layer.closeAll();
                }else{
                    layer.alert(data.msg)
                }
            },()=>{
            })


        },
        ...mapMutations([
            'setPosts',
            'addPost',
            'delPost',
        ]),
        ...mapActions([
            'setActivePostId',
            'setCurrendPost',
            'update_current_postcontent'
        ])
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route':async function(){
            this.setActivePostId(this.$route.params.id);
            if(this.currentPost.id){
                if(!this.currentPost.post_content&&!this.currentPost.postTag){
                    let d = await api.postContent(this.currentPost.id);
                    this.setCurrendPost(d);
                }
                this.update_current_postcontent(this.currentPost.post_content);
            }else{
                this.update_current_postcontent("");
            }
            // console.log(this.currentPost);
            setTimeout(()=>$('.post-list [data-am-dropdown]').dropdown(),500)
        }
    },
    mounted:async function() {

        let data = await api.posts();
        if(data.code==0){
            this.setPosts(data.data);
            this.setActivePostId(this.$route.params.id);
            if(this.currentPost.id){
                if(!this.currentPost.post_content&&!this.currentPost.postTag){
                    let d = await api.postContent(this.currentPost.id);
                    this.setCurrendPost(d);
                }
                this.update_current_postcontent(this.currentPost.post_content);
            }else{
                this.update_current_postcontent("");
            }
        }else{
            layer.alert('发生异常，请刷新后重试');
        }
        setTimeout(()=>$('.post-list [data-am-dropdown]').dropdown(),500)

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
                background-color: #ececec;
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
