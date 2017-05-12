<template>
<aside class="comment-wrapper">
    <blog-comment-send :posts-id="postsId" :author="author" :email="email" :url="url" @comment="addComment"></blog-comment-send>
    <div class="j-comment-head">
        <span v-if="commentList.length">{{commentList.length}} 条评论</span>
        <span v-else>暂无评论</span>
        <ul class="am-fr">
            <li v-for="item in sortList" :class="{'am-active':sort==item.d}" @click="sort=item.d"><a href="javascript:;">{{item.name}}</a></li>
        </ul>
    </div>
    <ul class="j-comment-list am-comments-list" >
        <div class="loading" v-if="loading">
            <i class="am-icon-spinner am-icon-spin"></i>
        </div>
        <div class="j-comment-empty" v-else-if="!msg&&!commentList.length">
            <img src="http://oht47c0d0.bkt.clouddn.com/e449de40-36bb-11e7-8052-f5dac1b1035e" alt=""> <div class="am-inline-block" >智慧如你，不想<span @click="toComment('#comment',800)">发表一点想法</span>咩~</div>
        </div>
        <div class="j-comment-empty" v-else-if="msg">
            评论加载失败..
        </div>
        <li class="j-reply-wrap" v-for="item in pageList">
            <a href="javascript:;" class="j-user-avatar">
                <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
            </a>
            <div class="am-comment-main">
                <header>
                    <a class="name">{{item.comment_author}}</a>
                    <a v-if="item.user_id" class="admin" title="管理员"><i class="icon-guanliyuan iconfont "></i></a>
                    <span class="am-fr">#{{item.comment_karma}}</span>
                </header>
                <div class="am-comment-bd">{{item.comment_content}}
                </div>
                <footer class="am-comment-info">
                    <i class="iconfont" :class="'icon-'+item.comment_agent.split(' ')[0].toLowerCase()"></i>
                    <span style="">{{item.comment_agent}}</span>
                    <i class="iconfont icon-shijian"></i>
                    <span style="">{{item.comment_date}}</span>
                    <span class="j-reply j-btn-hover j-btn">回复</span>
                    <span class="am-fr j-report" v-if="!item.user_id">举报</span>
                </footer>
            </div>
        </li>
        <f-page :all="pageNum" :cur="currPage" @toPage="toPage" v-if="commentList.length"></f-page>
        <!-- <ul class="am-pagination am-pagination-centered">
          <li class="am-disabled"><a href="#">&laquo;</a></li>
          <li class="am-active"><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">4</a></li>
          <li><a href="#">5</a></li>
          <li><a href="#">&raquo;</a></li>
        </ul> -->
    </ul>
    <!-- <slot name="header"></slot>
    <slot name="header"></slot> -->
    <blog-comment-send v-if="commentList.length>=10" :posts-id="postsId" :author="author" :email="email" :url="url" @comment="addComment" style="margin-top:30px;"></blog-comment-send>
    <!-- <slot></slot> -->
</aside>
</template>
<script>
import * as api from "public/js/api.js"
import BlogCommentSend from "./comment-send.vue"
import FPage from "./page.vue"
// const useragent = require('useragent')
export default {
    data() {
        return {
            commentList:[],
            msg:'',
            loading:true,
            sortList:[
                {name:'按时间正序',d:'desc'},
                {name:'按时间倒序',d:'asc'},
            ],
            sort:'desc',
            currPage: 1,
            rowsNum: 10,
        }
    },
    props:['postsId','author','email','url','avatar'],
    components:{
        BlogCommentSend,
        FPage
    },
    computed:{
        list(){
            return _.orderBy(this.commentList,['comment_date'],this.sort)
        },
        max() {
            return this.list.length;
        },
        pageNum() {
            return Math.ceil(this.list.length / this.rowsNum);
        },
        pageList() {
            return this.list.slice((this.currPage-1) * this.rowsNum, (this.currPage) * this.rowsNum)
        }
    },
    methods: {
        addComment(d){
            this.commentList.splice(0,0,d);
        },
        toComment(el,s){
            $('html, body').animate({
                scrollTop: $(el).offset().top-150
            }, s);
            $(el).focus();
        },
        toPage(page){
            this.toComment('.j-comment-list',800)
            this.currPage = page;
        }
    },
    async mounted (){
        // 获取评论列表
        try {
            const r = await api.getComments(this.postsId)
            // console.log(r);
            this.commentList = r.data
        } catch (e) {
            this.msg = e.data.msg;
        }  finally {
            this.loading = false
        }
    }
}

</script>
<style lang="less">
    @fontColor:#6d757a;
    @fontColor2:#99a2aa;
    @fontColor3:#00a1d6;
    @borderColor2:#e5e9ef;
    .comment-wrapper {

    }
    #my-prompt {
        .am-form-label {
            padding: 0 0 0 12px;
            text-align: left;
        }
        input {
            padding:5px;
            font-size: 14px;
        }
        &.j-out {
            display: block;
            position: absolute;
            left: -999px;
            right: auto;
            bottom: auto;
        }
    }
    .j-comment-list {
        min-height: 110px;
        position: relative;
        .loading {
            height: 180px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            position: absolute;
            width: 100%;
            background: #fff;
            z-index: 1;
        }
        .j-comment-empty {
            height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: @fontColor2;
            font-size: 12px;
            img {
                margin-right: 15px;
                opacity: 0.3;
            }
            span {
                cursor: pointer;
                &:hover {
                    color: @fontColor3;
                }
            }
        }
        .j-user-avatar {
            margin: 24px 0 0 5px;
        }
        &>li:first-child .am-comment-main{
            border-top:none;
        }
        .am-comment-main {
            border: none;
            padding: 22px 0 14px;
            border-bottom: 1px solid @borderColor2;
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

            .name {
                color: @fontColor;
                vertical-align: middle;
                cursor: pointer;
            }
            .admin{
                margin-left: 5px;
                // color: inherit;
            }
            .admin i{
                font-size: 12px;
                color: inherit;
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
            i {
                font-size: 12px;
            }
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
            color: @fontColor3;
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
            &:hover{
                background-color: #fff;
                border-color: @fontColor3;
            }
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
            &:hover + textarea {
                background-color: #fff;
                border-color: #00a1d6;
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
        .j-emoji-block .j-btn {
            cursor: pointer;
        }
        .j-emoji-block  span {
            color: @fontColor2;
            font-size: 12px;
            cursor: default;

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
