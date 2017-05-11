<template>
<aside class="comment-wrapper">
    <form action="" class="j-comment-send" @submit.prevent>
        <div class="j-user-avatar">
            <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
        </div>
        <div class="j-textarea-container">
            <textarea name="name" rows="8" cols="80" v-model="parame.comment_content" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。">
            </textarea>
            <button class="j-comment-submit nono-user-select">发表评论</button>
            <div class="j-emoji-block nono-user-select">
                <a href="javascrip:;"><i class="iconfont icon-biaoqing"></i> 表情</a>
                <span>Ctrl+Return 发表</span>
            </div>
        </div>
        <!-- <input type="text" v-model="parame.comment_author">
        <input type="text" v-model="parame.comment_author_email">
        <input type="text" v-model="parame.comment_author_url">

        <button type="button" name="button" @click="submit">发表评论</button> -->
    </form>

    <div class="j-comment-head">
        <span>{{'11'}} 条评论</span>
        <ul class="am-fr">
            <li class="am-active"><a href="javascript:;">按时间正序</a></li>
            <li><a href="javascript:;">按时间倒序</a></li>
        </ul>
    </div>
    <ul class="j-comment-list am-comments-list">
        <li class="j-reply-wrap">
            <a href="javascript:;" class="j-user-avatar">
                <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
            </a>
            <div class="am-comment-main">
                <header>
                    <a >酱酱酱酱油鲜</a>
                    <span class="am-fr">#1</span>
                </header>
                <div class="am-comment-bd">评论测试
                </div>
                <footer class="am-comment-info">
                    <i class="iconfont icon-shebei1"></i>
                    <span style="">PC</span>
                    <i class="iconfont icon-shijian"></i>
                    <span style="">05/04/2017</span>
                    <span class="j-reply j-btn-hover j-btn">回复</span>
                    <span class="am-fr j-report">举报</span>
                </footer>
            </div>
        </li>
        <li class="j-reply-wrap">
            <a href="javascript:;" class="j-user-avatar">
                <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
            </a>
            <div class="am-comment-main">
                <header>
                    <a >酱酱酱酱油鲜</a>
                    <span class="am-fr">#1</span>
                </header>
                <div class="am-comment-bd">评论测试
                </div>
                <footer class="am-comment-info">
                    <i class="iconfont icon-shebei1"></i>
                    <span style="">PC</span>
                    <i class="iconfont icon-shijian"></i>
                    <span style="">05/04/2017</span>
                    <span class="j-reply j-btn-hover j-btn">回复</span>
                    <span class="am-fr j-report">举报</span>
                </footer>
            </div>
        </li>
    </ul>
    <!-- <slot></slot> -->
</aside>
</template>
<script>
import * as api from "public/js/api.js"
export default {
    data() {
        return {
            parame:{
                comment_author:'',
                comment_author_email:'',
                comment_author_url:'',
                comment_content:'',
                comment_author_avatar: ''
            }
        }
    },
    props:['postsId'],
    methods: {
        submit(){
            api.comment({
                ...this.parame,
                posts_id:this.postsId
            })
        }
    },
    mounted (){
        // 获取评论列表

    }
}

</script>
<style lang="less">
@fontColor:#6d757a;
@fontColor2:#99a2aa;
@borderColor2:#e5e9ef;
    .comment-wrapper {

    }
    .j-comment-list {
        .j-user-avatar {
            margin: 24px 0 0 5px;
        }
        li:first-child .am-comment-main{
            border-top:none;
        }
        .am-comment-main {
            border: none;
            padding: 22px 0 14px;
            border-top: 1px solid @borderColor2;
            &::before,&::after{
                content: none;
            }
        }
        header{
            font-size: 12px;
            font-weight: 700;
            line-height: 18px;
            padding-bottom: 4px;
            display: block;
            word-wrap: break-word;

            a {
                color: @fontColor;
                vertical-align: middle;
                cursor: pointer;
            }
            span {
                font-weight: 100;
                color: @fontColor2;
            }
        }
        footer {
            color: @fontColor2;
            line-height: 26px;
            font-size: 12px;
            span {
                margin-right: 20px;
                vertical-align: top;
            }
            .j-reply {
                padding: 0 5px;
                border-radius: 4px;
                margin-right: 15px;
                cursor: pointer;
                display: inline-block;
            }
            .j-report{
                display: none;
                cursor: pointer;
            }
            &:hover .j-report {
                display: block;
            }
        }
        .am-comment-bd {
            padding: 0;
        }

    }
    .j-btn-hover {
        &:hover{
            color: #00a1d6;
            background: @borderColor2;
        }
    }
    .j-comment-send{
        margin: 10px 0;
    }
    .j-user-avatar {
        float: left;
        margin: 7px 0 0 5px;
        position: relative;
        img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
        }
    }
    .j-textarea-container {
        position: relative;
        margin-left: 85px;
        margin-right: 80px;
        &:hover {
            textarea{
                background-color: #fff;
                border-color: #00a1d6;
            }
        }
        textarea {
            font-size: 12px;
            display: inline-block;
            box-sizing: border-box;
            background-color: #f4f5f7;
            border: 1px solid @borderColor2;
            overflow: auto;
            border-radius: 4px;
            color: #555;
            width: 100%!important;
            height: 65px;
            transition: 0s;
            padding: 5px 10px;
            line-height: normal;
            outline: none;
            resize: none;
            transition: .4s;

        }
        .j-comment-submit {
            width: 70px;
            height: 64px;
            position: absolute;
            right: -80px;
            top: 0;
            padding: 4px 15px;
            font-size: 14px;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            min-width: 60px;
            vertical-align: top;
            cursor: pointer;
            background-color: #00a1d6;
            border: 1px solid #00a1d6;
            transition: .1s;
            outline: none;
            transition: .4s;
            &:hover{
                background-color: #00b5e5;
                border-color: #00b5e5;
            }
        }
        .j-emoji-block {
            margin: 5px 0;
        }
        .j-emoji-block a{
            border: 1px solid @borderColor2;
            border-radius: 4px;
            color: @fontColor2;
            padding: 3px 12px;
            i {
                font-size: 21px;
                line-height: 21px;
                vertical-align: middle;
            }
            &:hover {
                color: #6d757a;
            }
        }
        .j-emoji-block span {
            color: @fontColor2;
            font-size: 12px;
            cursor: pointer;
        }
    }
    .j-comment-head {
        padding-bottom: 20px;
        font-size: 17px;
        font-weight: 700;
        border-bottom: 1px solid #f0f0f0;
        li {
            list-style: none;
            display: inline-block;
            margin-left: 10px;
        }
        li a {
            font-size: 12px;
            font-weight: 400;
            color: @fontColor2;
        }
        li.am-active a {
            color: #131313;
        }
    }


    //     export default {
    //         // Options / Data
    //         // data () { return {} },
    //         // props: [],
    //         // propsData: {},
    //         // computed: {},
    //         // methods: {},
    //         // watch: {},
    //         // Options / DOM
    //         // el () {},
    //         // template: '',
    //         // render () {},
    //         // Options / Lifecycle Hooks
    //         // beforeCreate () {},
    //         // created () {},
    //         // beforeMount () {},
    //         // mounted () {},
    //         // beforeUpdate () {},
    //         // updated () {},
    //         // activated () {},
    //         // deactivated () {},
    //         // beforeDestroy () {},
    //         // destroyed () {},
    //         // Options / Assets
    //         // directives: {},
    //         // filters: {},
    //         // components: {},
    //         // Options / Misc
    //         // parent: null,
    //         // mixins: [],
    //         // name: '',
    //         // extends: {},
    //         // delimiters: [ '{{', '}}' ],
    //         // functional: false
    //     }
    //
</style>
