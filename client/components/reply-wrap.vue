<template>
    <li class="j-reply-wrap">
        <a href="javascript:;" class="j-user-avatar">
            <img :src="item.comment_author_avatar" alt="user-avatar">
        </a>
        <div class="am-comment-main">
            <header>
                <a class="name">{{item.comment_author}}</a>
                <a v-if="item.user_id" class="admin" title="管理员"><i class="icon-guanliyuan iconfont "></i></a>
                <span class="am-fr">#{{item.comment_karma}}</span>
            </header>
            <div class="am-comment-bd" v-html="emoji(item)">
            </div>
            <footer class="am-comment-info">
                <i class="iconfont" :class="'icon-'+item.comment_agent.split(' ')[0].toLowerCase()"></i>
                <span style="">{{item.comment_agent}}</span>
                <i class="iconfont icon-shijian"></i>
                <span style="">{{item.comment_date}}</span>
                <span class="j-reply j-btn-hover j-btn" @click="reply(item.comment_id)">回复</span>
                <span class="am-fr j-report" v-if="!item.user_id">举报</span>
            </footer>
            <ul class="j-reply-list-box">
                <li v-for="item2 in item.replyList" v-html="emoji(item2)"></li>
            </ul>
            <transition name="custom-classes-transition" enter-active-class="animated fadeInDown">
                <blog-comment-send v-if="parame.comment_parent==item.comment_id" class="j-reply-box" @cancelReply="parame.comment_parent = null"
                    :posts-id="postsId"
                    v-model="replyContent" :show-cancel="true" @comment="addComment">
                </blog-comment-send>
            </transition>
        </div>
    </li>
</template>
<script>
export default {
    data: function() {
        return {

        }
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {

    }
}
</script>
