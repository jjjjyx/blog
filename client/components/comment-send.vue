<template>
<form action="" class="j-comment-send" @submit.prevent>
    <div class="j-user-avatar">
        <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
    </div>
    <div class="j-textarea-container">
        <button class="j-comment-submit nono-user-select" @click="comment">发表评论</button>
        <textarea id="comment" class="j-comment_content" ref="comment_content" name="name" rows="8" cols="80" v-model="parame.comment_content" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。">
        </textarea>
        <div class="j-emoji-block ">
            <div class="am-dropdown" data-am-dropdown>
                <a href="javascrip:;" class="j-btn nono-user-select am-dropdown-toggle"><i class="iconfont icon-biaoqing"></i> 表情</a>
                <f-emoji class="am-dropdown-content" @selectEmoji="selectEmoji"></f-emoji>
            </div>
            <span class="nono-user-select">Ctrl+Return 发表</span>

            <div class="am-fr" v-if="parame.comment_author&&parame.comment_author_email">
                <span class="am-margin-right-xs">{{parame.comment_author}}</span>
                <span class="j-btn" @click="editInfo">
                    <i class="am-icon-cog"></i> 修改资料
                </span>
            </div>
        </div>
    </div>
    <div class="am-modal am-modal-prompt" tabindex="-1" id="my-prompt">
      <div class="am-modal-dialog">
        <div class="am-modal-hd">游客信息</div>
        <form class="am-modal-bd am-form am-form-horizontal" @submit.prevent id="comment_author">
            <div class="am-form-group">
              <label for="doc-text-3" class="am-u-sm-2 am-form-label">昵称 <span class="am-text-danger">*</span></label>
              <div class="am-u-sm-10">
                <input type="text" id="doc-text-3" placeholder="昵称"  v-model="parame.comment_author" required minlength="2" maxlength="18" >
              </div>
            </div>
            <div class="am-form-group">
              <label for="doc-ipt-3" class="am-u-sm-2 am-form-label">邮箱 <span class="am-text-danger">*</span></label>
              <div class="am-u-sm-10">
                <input type="email" id="doc-ipt-3" placeholder="邮箱" v-model="parame.comment_author_email" required >
              </div>
            </div>
            <div class="am-form-group">
              <label for="doc-url-3" class="am-u-sm-2 am-form-label">网址 </label>
              <div class="am-u-sm-10">
                <input type="url" id="doc-url-3" placeholder="http://" v-model="parame.comment_author_url">
              </div>
            </div>
            您必须要提供这些信息才能评论呢~
        </form>
        <div class="am-modal-footer">
          <span class="am-modal-btn" data-am-modal-cancel>取消</span>
          <span class="am-modal-btn" @click="vaild" data-am-modal-confirm>提交</span>
        </div>
      </div>
    </div>
</form>
</template>

<script lang="">
import * as api from "public/js/api.js"
import FEmoji from "./emoji.vue";
export default {
    data () {
        return {
            parame:{
                comment_author:this.author,
                comment_author_email:this.email,
                comment_author_url:this.url,
                comment_content:'',
                comment_author_avatar: ''
            },
            edit: false,
        }
    },
    components:{
        FEmoji
    },
    props:['postsId','author','email','url','avatar'],
    methods: {
        selectEmoji(item){
            this.parame.comment_content +=item;
        },
        async comment(){

            const authorForm = $("#my-prompt").show(); // 这个元素必须显示出来才能验证表单
            // 不想想验证代码，我已经使用amazeui 的验证框架了在写有点多余
            const vaild = $("#comment_author").validator('isFormValid');
            authorForm.hide();
            if(vaild) {
                if(this.parame.comment_content&&this.parame.comment_content.length<=300){
                    try {
                        let r = await api.comment({
                            ...this.parame,
                            posts_id:this.postsId
                        });
                        if(r.code ==0) {
                            let data = r.data;
                            this.$emit('comment',data)
                            // this.commentList.splice(0,0,data)
                            this.parame.comment_content = '';
                            layer.msg(r.msg);
                        }
                    } catch (e) {
                        console.log(e);
                        layer.msg(e.data.msg);
                    }
                }else {
                    this.tips();
                }

            } else {
                authorForm.modal({width:320,closeOnConfirm:false});
            }
        },
        editInfo(){
            this.edit = true;
            const authorForm = $("#my-prompt");
            authorForm.modal({width:320});
        },
        vaild(){
            // const comment_author = this.parame.comment_author.length>=2&&this.parame.comment_author.length<18;
            // const comment_author_email = ""
            if($("#comment_author").validator('isFormValid')){
                $("#my-prompt").modal('close')
                if(!this.edit)
                    this.comment();
                else{
                    this.edit = false;
                }
            }
            // if(){}
        },
        // null
        tips(){
            $(".j-comment_content").addClass('am-animation-shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass('am-animation-shake');
                layer.tips('评论内容不可为空', '.j-comment_content');
            });
        },
    }
}
</script>
