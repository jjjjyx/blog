<template>
<form action="" class="j-comment-send" @submit.prevent>
    <div class="j-user-avatar">
        <img :src="parame.comment_author_avatar" alt="user-avatar">
    </div>
    <div class="j-textarea-container">
        <button class="j-comment-submit nono-user-select" @click="$emit('comment')">发表评论</button>
        <textarea id="comment" class="j-comment_content"
            name="name" rows="8" cols="80" v-model="$parent.commentContent"
            placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。">
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
</form>
</template>

<script lang="">
import * as api from "public/js/api.js"
import FEmoji from "./emoji.vue";
import { mapGetters } from 'vuex'
export default {
    data () {
        return {

        }
    },
    components:{
        FEmoji
    },
    computed: {
        ...mapGetters(['count']),
    },
    // props:['postsId','author','email','url','avatar'],
    props:{
        postsId:{
            type:String,
            required: true
        },
        parame:{
            type: Object,
            default: function () {
                return {
                    comment_author:'',
                    comment_author_email:'',
                    comment_author_url:'',
                    comment_author_avatar: ''
                }
            }
        }
    },
    methods: {
        selectEmoji(item){
            this.$parent.commentContent +=item;
        },

        editInfo(){
            this.$emit("editInfo")
            const authorForm = $("#my-prompt");
            authorForm.modal({width:320});
        },


        async changgeAvatar(){
            try {
                const data  = await api.randomAvatar();
                if(data.code==0){
                    this.parame.comment_author_avatar = data.url;
                }
            } catch (e) {
                layer.msg("不可频繁切换");
            }
        }
    },
    mounted(){
        if(!this.parame.comment_author_avatar)
            this.changgeAvatar()
    }
}
</script>
