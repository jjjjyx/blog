<template>
<form action="" class="j-comment-send" @submit.prevent>
    <div class="j-user-avatar">
        <img :src="$parent.parame.comment_author_avatar" alt="user-avatar">
    </div>
    <div class="j-textarea-container">
        <button class="j-comment-submit nono-user-select" @click="$emit('comment',currentValue)">发表评论</button>
        <textarea id="comment" class="j-comment_content"
            name="name" rows="8" cols="80"
            ref="textarea"
            :value="currentValue"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
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
            <a v-if="showCancel" class="am-fr j-btn-link am-btn-link" @click="$emit('cancelReply')">取消</a>
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
            currentValue:this.value
        }
    },
    components:{
        FEmoji
    },
    computed: {

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
        },
        value: [String, Number],
        showCancel:{
            type:Boolean,
            default:false
        }
        // content: {
        //     type: String,
        //     default: ''
        // },
    },
    watch: {
        'value'(val, oldValue) {
            this.setCurrentValue(val);
        }
    },
    methods: {
        handleBlur(event) {
            this.$emit('blur', event);
        },
        handleFocus(event) {
            this.$emit('focus', event);
        },
        handleInput(event,v) {
            const value = v || event.target.value;
            this.$emit('input', value);
            this.setCurrentValue(value);
            this.$emit('change', value);
        },
        setCurrentValue(value) {
            if (value === this.currentValue) return;
            this.currentValue = value;
        },
        selectEmoji(item){
            this.handleInput(null,this.currentValue+item);
        },

        editInfo(){
            this.$emit("editInfo")
            const authorForm = $("#my-prompt");
            authorForm.modal({width:320});
        },



    },
    mounted(){

    }
}
</script>
