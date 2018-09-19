<template>
    <aside class="comment-wrapper">
        <comment-input v-model="content" />
        <div class="j-comment-head">
            <span v-if="commentList.length">{{commentList.length}} 条评论</span>
            <span v-else>暂无评论</span>
            <ul class="float-right">
                <li v-for="item in sortList" :key="item.d" :class="{'active':sort === item.d}" @click="sort=item.d"><a href="javascript:;">{{item.name}}</a></li>
            </ul>
        </div>
        <div class="j-comment-empty" v-if="status===comment_status.loading">加载中评论中...</div>
        <div class="j-comment-empty" v-else-if="status===comment_status.error">评论加载失败..</div>
        <div class="j-comment-empty" v-else-if="status===comment_status.success && !commentList.length">
            <!--<font-icon type="icon-color-doge" size="36"></font-icon>-->
            <img src="http://oht47c0d0.bkt.clouddn.com/FuwU_vvhI2bw4fRq8MO1AKax0RpF" alt="[doge]">
            <div class="am-inline-block">智慧如你，不想<span @click="toComment">发表一点想法</span>咩~</div>
        </div>
        <ul class="comment-list-warp">
            <li class="comment-list__item" v-for="i in 10" :key="i">
                <div class="user-avatar comment-user-avatar" >
                    <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="user-avatar">
                </div>
                <div class="comment-content">
                    <header class="comment-content__header">
                        <a class="comment-user-name name">酱酱酱酱油鲜</a>
                        <!--<a v-if="item.user_id" class="admin" title="管理员"><i class="icon-guanliyuan iconfont "></i></a>-->
                        <span class="float-right"># 1</span>
                    </header>
                    <div class="comment-content__body">...
                        webpack built 6d74f2a57838700ca0b5 in 1028ms
                        i ｢wdm｣: Hash: 6d74f</div>
                    <footer class="comment-content__footer">
                        <font-icon type="icon-color-phone"></font-icon>
                        <span class="">来自xx设备</span><time style="" datetime="2018年9月19日10:42:04">3小时前</time>
                        <font-icon type="icon-zan" class="opt j-logo--a"></font-icon> <span>0</span>
                        <font-icon type="icon-oppose" class="opt j-logo--a"></font-icon> <span>0</span>
                        <Button type="text" size="small" @click="reply(i)">回复</Button>
                        <!--v-if="!item.user_id"-->
                        <span class="float-right j-report" >举报</span>
                    </footer>
                    <ul class="reply-list-warp">
                        <li v-for="item2 in i" class="reply-list__item" :key="item2">
                            <div class="comment-user-avatar float-left">
                                <img src="http://oht47c0d0.bkt.clouddn.com/0e4cf690-376c-11e7-81cc-c5fb8304dee6" alt="user-avatar">
                            </div>
                            <div class="reply-content">
                                <div class="reply-content__body">
                                    <a class="comment-user-name">冬枣</a>
                                    <span class="text">72.hot-update.jso</span>
                                </div>
                                <div class="reply-content__footer">
                                    <time datetime="2018-9-19 10:31" style="">2018-9-19 10:31</time>
                                    <Button type="text" size="small" @click="reply(i, {comment_author: item2, comment_id: 1})">回复</Button>
                                    <!--<span class="j-reply-btn j-btn-hover j-btn" @click="reply(item.comment_id,item2)">回复</span>-->
                                </div>
                            </div>
                        </li>
                    </ul>
                    <collapse-transition>
                        <comment-input v-if="commentDate.comment_parent === i" class="reply-input-warp" @cancelReply="parame.comment_parent = null" :posts-id="postsId"
                                           v-model="replyContent" :show-cancel="true" >
                        </comment-input>
                    </collapse-transition>
                </div>
            </li>
        </ul>

        <comment-input v-model="content" v-if="commentList.length >= 10"/>
    </aside>
</template>
<!--
    通过评论组件来发起身份验证，获取登录token，获取失败则不允许评论
    这个身份的token 与后台的token 不同
    可以考虑接入第三方登录。 突然考虑到授权问题。第三方网站应该不会吧用户数据随便交给我这种小站吧
    暂时方案是自己做游客访问系统，通过cookie来记住访问的用户，并给与随机的用户名，头像。 通过IP  或者 userAgent 来识别用户

    密码怎么办

    对正常的浏览来说，并不想留下一个密码，那么如果我使用ip + 用户留下的邮箱当做识别呢，对应的发表的评论将不可以被删除了
    那这个思路的话就是在第一次评论的时候 跳出要求用户输入一下必要信息 存在用户表中，并生成为生成 token 那就当前一项权限来做了， 主要防止这个token 访问到后台管理
    关于权限
        权限系统不想太复杂，目前来说，只有管理员与游客之分，所以不打算做角色管理，直接写死在代码里

    1 使用session 来识别用户进行登录的方案
        考虑到自己也会评论，这样就产生了2套用户系统
    2 使用第三方登录，也可以使用本地账号，
        实现起来比较麻烦
    3 旧的实现  => 这个比较方便

    4 重新调整用户系统，增加权限管理 让前后端都使用同一个用户系统，用户在评论这里输入的信息即当做登录
 -->
<script>

import CollapseTransition from '@/utils/collapse-transition'
import CommentInput from './comment-input'

import { on } from '../../utils/dom'
import { scrollTop } from 'iview/src/utils/assist'
import api from '../../utils/api'

function scorllEl (el) {
    const sTop = document.documentElement.scrollTop || document.body.scrollTop
    const to = el.offsetTop - 300
    scrollTop(window, sTop, to, 1000, () => {
        console.log(document.documentElement.scrollTop || document.body.scrollTop)
    })
}

on(window, 'load', () => {
    let hash = location.hash
    let el = document.querySelector(hash)
    if (el) {
        scorllEl(el)
    }
})

// import
const commentStatus = {
    loading: 'loading',
    error: 'error',
    success: 'success'
}
export default {
    name: 'comment',
    data () {
        return {
            content: '',
            replyContent: '',
            commentList: [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            sortList: [
                {name: '按时间正序', d: 'desc'},
                {name: '按时间倒序', d: 'asc'}
            ],
            sort: 'desc',
            comment_status: commentStatus,
            status: commentStatus.success,
            commentDate: {
                comment_parent: null
            },
            user: {
                'id': 0,
                'user_login': '',
                'user_nickname': '',
                'user_email': '',
                'user_avatar': null,
                'user_url': '',
                'user_status': 1,
            },
            defaultAvatar: 'http://oht47c0d0.bkt.clouddn.com/FuNJUwEY1vEWt5ncFeVXhVG4-R6S'
        }
    },
    props: ['postsId', 'author', 'email', 'url', 'avatar'],
    components: {
        CollapseTransition,
        CommentInput
    },
    computed: {
        isLogin () {
            return this.user.id
        },
        currentAvatar () {
            // if (this.isLogin) {
                return this.user.user_avatar || this.defaultAvatar
            // } else {
            //     return this.defaultAvatar
            // }
        }
    },
    methods: {
        toComment () {
            let el = document.getElementById('comment')
            scorllEl(el)
            el.focus()
            // 更换 url
            let url = '#comment'
            window.history.pushState({}, 0, url)
        },
        /**
         * 回复
         * @param id 回复的对象
         * @param at @ 对象
         */
        reply (id, at) {
            this.replyContent = ''
            if (at) {
                this.replyContent = `@${at.comment_author} `
            }
            if (this.commentDate.comment_parent === id) {
                this.commentDate.comment_parent = null
            } else {
                this.commentDate.comment_parent = id
            }
        }
    },
    async created () {
        try {
            let u = await api.nget('/api/user/auth')
            for (let key in this.user) {
                this.user[key] = u[key]
            }
        } catch (e) {
            console.log(e)
        }

    },
    mounted () {

    }
}
</script>
