<template>
    <aside class="comment-wrapper">
        <comment-input @auth="infoModal = true" @comment-success="handleCommentSuccess" v-model="content"/>
        <div class="j-comment-head">
            <span v-if="commentList.length">{{commentList.length}} 条评论</span>
            <span v-else>暂无评论</span>
            <ul class="float-right">
                <li v-for="item in sortList" :key="item.d" :class="{'active':sort === item.d}" @click="sort=item.d"><a
                    href="javascript:;">{{item.name}}</a></li>
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
            <li class="comment-list__item" v-for="(comment, index) in commentOrder" :key="i">
                <div class="user-avatar comment-user-avatar">
                    <img :src="comment.comment_author_avatar" alt="user-avatar">
                </div>
                <div class="comment-content">
                    <header class="comment-content__header">
                        <a class="comment-user-name name">{{comment.comment_author}}</a>
                        <!--<a v-if="item.user_id" class="admin" title="管理员"><i class="icon-guanliyuan iconfont "></i></a>-->
                        <span class="float-right"># {{comment.comment_karma}}</span>
                    </header>
                    <div class="comment-content__body">{{comment.comment_content}}</div>
                    <footer class="comment-content__footer">
                        <font-icon type="icon-color-phone"></font-icon>
                        <span class="">来自{{comment.comment_agent}}设备</span>
                        <time :datetime="comment.createdAt">{{comment.time}}</time>
                        <font-icon type="icon-zan" class="opt j-logo--a"></font-icon>
                        <span>0</span>
                        <font-icon type="icon-oppose" class="opt j-logo--a"></font-icon>
                        <span>0</span>
                        <Button type="text" size="small" @click="reply(comment.id)">回复</Button>
                        <!--v-if="!item.user_id"-->
                        <span class="float-right j-report">举报</span>
                    </footer>
                    <!--<ul class="reply-list-warp">-->
                        <!--<li v-for="item2 in 10 - i" class="reply-list__item" :key="item2">-->
                            <!--<div class="comment-user-avatar float-left">-->
                                <!--<img src="http://oht47c0d0.bkt.clouddn.com/0e4cf690-376c-11e7-81cc-c5fb8304dee6"-->
                                     <!--alt="user-avatar">-->
                            <!--</div>-->
                            <!--<div class="reply-content">-->
                                <!--<div class="reply-content__body">-->
                                    <!--<a class="comment-user-name">冬枣</a>-->
                                    <!--<span class="text">72.hot-update.jso</span>-->
                                <!--</div>-->
                                <!--<div class="reply-content__footer">-->
                                    <!--<time datetime="2018-9-19 10:31" style="">2018-9-19 10:31</time>-->
                                    <!--<Button type="text" size="small"-->
                                            <!--@click="reply(i, {comment_author: item2, comment_id: 1})">回复-->
                                    <!--</Button>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</li>-->
                    <!--</ul>-->
                    <collapse-transition>
                        <comment-input v-if="commentDate.comment_parent === i" class="reply-input-warp"
                                       @auth="infoModal = true"
                                       :posts-id="postsId" :show-cancel="true" :placeholder="commentDate.placeholder"
                                       @cancelReply="commentDate.comment_parent = null"
                                       @comment-success="handleCommentSuccess"
                                       v-model="replyContent">
                        </comment-input>
                    </collapse-transition>
                </div>
            </li>
        </ul>

        <comment-input v-model="content" v-if="commentList.length >= 10" @auth="infoModal = true" @comment-success="handleCommentSuccess"/>
        <Modal v-model="infoModal" title="一个必须填写的表单" scrollable="true">
            <div class="user-info-wrap">
                <div class="sidebar-user-avatar">
                    <a href="javascript:void(0)" class="user-avatar-area">
                        <img :src="userCopy.user_avatar || defaultAvatar" alt="">
                    </a>
                    <a href="javascript:void(0)" class="edit-avatar">不喜欢，点击换一个</a>
                </div>
                <Form :model="userCopy" :label-width="80" :rules="ruleValidate" class="wrapper-base-info"
                      ref="userinfoform">
                    <FormItem label="qq" prop="user_login">
                        <Input v-model="userCopy.user_login" placeholder="输入qq 号 快速评论" @on-change="inputQQ"/>
                    </FormItem>
                    <FormItem label="昵称" prop="user_nickname">
                        <Input v-model="userCopy.user_nickname" placeholder="nickname" @on-change="lockNickName"/>
                    </FormItem>
                    <FormItem label="邮箱" prop="user_email">
                        <Input v-model="userCopy.user_email" placeholder="email"/>
                    </FormItem>
                    <FormItem label="网址" prop="user_url">
                        <Input v-model="userCopy.user_url" placeholder="email"/>
                    </FormItem>
                </Form>
            </div>
            <Button slot="footer" type="text" @click="infoModal = false">取消</Button>
            <Button slot="footer" type="primary" @click="handleOk">确认</Button>
        </Modal>
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

    根据 qq 号获取昵称 头像
    http://users.qzone.qq.com/fcg-bin/cgi_get_portrait.fcg?uins=871839012
    根据 qq 获取头像
    http://q.qlogo.cn/headimg_dl?dst_uin=871839012&spec=100
 -->
<script>
// import _ from 'lodash'
import CollapseTransition from '@/utils/collapse-transition'
import CommentInput from './comment-input'
import { on } from '../../utils/dom'
import api from '../../utils/api'

function scrollTop (el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60)
            }
        )
    }
    const difference = Math.abs(from - to)
    const step = Math.ceil(difference / duration * 50)

    function scroll (start, end, step) {
        if (start === end) return

        let d = (start + step > end) ? end : start + step
        if (start > end) {
            d = (start - step < end) ? end : start - step
        }

        if (el === window) {
            window.scrollTo(d, d)
        } else {
            el.scrollTop = d
        }
        window.requestAnimationFrame(() => scroll(d, end, step))
    }

    scroll(from, to, step)
}

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

const qqReg = /[1-9][0-9]{4,}/
export default {
    name: 'comment',
    data () {
        let user = {
            'id': 0,
            'user_login': '',
            'user_nickname': '',
            'user_email': '',
            'user_avatar': null,
            'user_url': '',
            'user_status': 0
        }
        return {
            content: '',
            replyContent: '',
            commentList: [],
            sortList: [
                {name: '按时间正序', d: 'desc'},
                {name: '按时间倒序', d: 'asc'}
            ],
            sort: 'desc',
            comment_status: commentStatus,
            status: commentStatus.success,
            commentDate: {
                comment_parent: null,
                members: [],
                parent: this.postsId,
                placeholder: '',
                page: 1
            },
            user,
            userCopy: _.cloneDeep(user),
            ruleValidate: {
                user_nickname: [
                    {type: 'string', min: 1, max: 18, trigger: 'blur', message: '虽然知道你很长，但是请控制在18个长度以内哦~'}
                ],
                user_email: [
                    {type: 'email', trigger: 'blur', message: '不要调皮，邮箱格式你心里没点`atob(\'Qg==\');`数吗'}
                ],
                user_url: [
                    {type: 'url', trigger: 'blur', message: '网址格式不正确'}
                ],
                user_login: [
                    {
                        type: 'regexp',
                        min: 3,
                        max: 18,
                        trigger: 'blur',
                        message: '虽然知道你很长，但是请控制在18个长度以内哦~',
                        pattern: /^[a-zA-Z0-9_\-]{3,18}$/
                    }
                ]
            },
            defaultAvatar: 'http://oht47c0d0.bkt.clouddn.com/FuNJUwEY1vEWt5ncFeVXhVG4-R6S',
            infoModal: false,
            lockNick: false
        }
    },
    props: ['postsId', 'author', 'email', 'url', 'avatar'],
    components: {
        CollapseTransition,
        CommentInput
    },
    computed: {
        isLogin () {
            return !!this.user.id
        },
        currentAvatar () {
            return this.user.user_avatar || this.defaultAvatar
        },
        commentOrder () {
            return _.orderBy(this.commentList,['createdAt'], ['desc'])
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
        handleSend (content, realLength) {
            if (this.isLogin) {
                // this.comment(content)
                content = content.trim()
                if (content.length < 2 || content.length > 1000) {
                    this.$Message.warning('请提交不包含表情， 2 - 1000 字以内的评论')
                    return null
                }

            } else {
                this.infoModal = true
            }
        },
        /**
         * 回复
         * @param id 回复的对象
         * @param at @ 对象
         */
        reply (id, replyTarget) {
            this.replyContent = ''
            let p = ''
            if (replyTarget) {
                p = `回复 ${replyTarget.comment_author} `
            }
            if (this.commentDate.comment_parent === id && p === this.commentDate.placeholder) {
                this.commentDate.comment_parent = null
            } else {
                this.commentDate.comment_parent = id
                this.commentDate.placeholder = p
            }
        },
        /**
         * 锁定 用户昵称
         */
        lockNickName: function () {
            if (!this.user.user_nickname) {
                this.lockNick = false
                return
            }
            this.lockNick = true
        },
        handleOk: async function () {
            try {
                let valid = await this.$refs.userinfoform.validate()
                if (valid) {
                    // 完善评论信息
                    let result = await api.npost('/api/comment/write-user', this.userCopy)
                    api.token = result.token
                    for (let key in this.user) {
                        this.user[key] = result[key]
                    }
                    this.infoModal = false
                } else {
                    let fields = this.$refs.userinfoform.fields
                    fields.forEach((field) => {
                        if (field.validateState === 'error' && field.showMessage) {
                            this.$Message.info(field.validateMessage)
                        }
                    })
                }
            } catch (e) {
                this.$Message.info(e.message)
                if (e.message === '错误的账号') {
                    this.userCopy.user_login = this.user.user_login
                }
            }
        },
        handleCommentSuccess (result, {comment_parent}) {
            if (comment_parent) {

            } else {
                this.commentList.push(result)
            }
        },
        async fetchComment () {
            this.comment_status = commentStatus.loading
            try {
                // 获取评论列表
                let result = await api.nget('/api/comment/', this.commentDate)
                this.commentList = result
                this.comment_status = commentStatus.success
                // console.log('comment load')
            } catch (e) {
                console.error(e)
                this.comment_status = commentStatus.error
            }
        }
    },
    async created () {
        async function inputQQ () {
            if (this.lockNick) return
            let qq = this.userCopy.user_login
            try {
                if (qqReg.test(qq)) {
                    let result = await api.nget(`/api/tools/qinfo`, {key: qq})
                    // console.log(result)
                    if (result) {
                        this.userCopy.user_nickname = result.nickname
                        this.userCopy.user_avatar = result.avatar
                    }
                }
            } catch (e) {
                console.log('获取qq 用户信息失败')
            }
        }

        this.inputQQ = _.debounce(inputQQ.bind(this), 500)
        this.fetchComment()

        try {
            let u = await api.nget('/api/user/auth')
            for (let key in this.user) {
                this.user[key] = u[key]
            }
            this.userCopy = _.cloneDeep(this.user)
        } catch (e) {
            console.log(e)
        }
    },
    mounted () {

    }
}
</script>
