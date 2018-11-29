<template>
    <aside class="comment-wrapper">
        <comment-input :user="user" :comment-target-id="commentTargetId"/>
        <div class="j-comment-head">
            <span v-if="commentList.length">{{totalDisplay}} 条评论</span>
            <span v-else>暂无评论</span>
            <ul class="float-right">
                <li v-for="item in sortList" :key="item.d" :class="{'active':filterCondition.sort === item.d}"
                    @click="filterCondition.sort = item.d, fetchComments()">
                    <a href="javascript:;">{{item.name}}</a>
                </li>
            </ul>
        </div>
        <div class="j-comment-empty" v-if="status===COMMENT_STATUS.loading">加载中评论中...</div>
        <div class="j-comment-empty" v-else-if="status===COMMENT_STATUS.error">评论加载失败..</div>
        <div class="j-comment-empty" v-else-if="status===COMMENT_STATUS.success && !commentList.length">
            <img src="https://image.cdn.mbdoge.cn/FuwU_vvhI2bw4fRq8MO1AKax0RpF" alt="[doge]">
            <div class="am-inline-block">智慧如你，不想<span @click="toComment">发表一点想法</span>咩~</div>
        </div>
        <transition-group class="comment-list-warp" tag="ul" name="comment-list-transition" :appear="true"
                          :enter-active-class="commentListTransition.enter"
                          :leave-active-class="commentListTransition.leave">
            <comment-item :item="comment" v-for="comment in commentList" :key="comment.id" @reply="handleReply" :comment-parent-id.sync="commentParentId"></comment-item>
        </transition-group>
        <div class="comment-page" v-if="commentList.length">
            <Page :total="total" show-elevator @on-change="handlePageChange" :current.sync="filterCondition.page"></Page>
        </div>
        <comment-input v-if="commentList.length >= 10" :user="user" :comment-target-id="commentTargetId"/>
        <comment-auth-modal :visible.sync="infoModal" :user="user"></comment-auth-modal>
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
    /* eslint-disable no-undef */
    import CommentUsername from './comment-username'
    import CommentInput from './comment-input'
    import {on} from '../../utils/dom'
    import * as commentApi from '@/api/comment'

    import * as userApi from '@/api/user'
    import CommentItem from './comment-item'
    import CommentAuthModal from './comment-auth-modal'

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
        scrollTop(window, sTop, to, 1000)
    }

    on(window, 'load', () => {
        let hash = location.hash
        if (!hash) {
            return
        }
        let el = document.querySelector(hash)
        if (el) {
            scorllEl(el)
        }
    })

    // import
    const COMMENT_STATUS = {
        loading: 'loading',
        error: 'error',
        success: 'success'
    }

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
                // 評論數
                total: 0,
                // 全部评论，包括回复
                totalDisplay: 0,
                // 评论列表
                commentList: [],
                // 评论列表的进入动画， 由于初始化不需要动画，所以置为空，在获取到数据结束后在赋值
                commentListTransition: {
                    enter: '',
                    leave: ''
                },
                // 当前状态
                COMMENT_STATUS,
                status: COMMENT_STATUS.success,
                // 当前登录的用户
                user,
                // 获取评论的筛选条件
                filterCondition: {
                    parent: this.commentTargetId,
                    page: 1,
                    sort: 'desc'
                },
                // 排序规则
                sortList: [
                    {name: '按时间正序', d: 'desc'},
                    {name: '按时间倒序', d: 'asc'}
                ],
                // 用户表单
                infoModal: false,
                commentParentId: null
            }
        },
        props: ['commentTargetId'],
        components: {
            CommentAuthModal,
            CommentItem,
            CommentInput,
            CommentUsername
        },
        methods: {
            /**
             * 页面滚动到指定位置
             */
            toComment () {
                let el = document.getElementById('comment')
                scorllEl(el)
                el.focus()
                // 更换 url
                let url = '#comment'
                window.history.pushState({}, 0, url)
            },

            handleCommentSuccess (result, {commentParentId}) {
                if (commentParentId) {
                    // 添加到对应才child
                    let comment = this.commentList.find(item => item.id === commentParentId)
                    if (!comment.child) {
                        comment.child = []
                    }
                    comment.child.push(result)
                    this.commentParentId = null
                } else {
                    if (this.filterCondition.sort === 'desc') {
                        this.commentList.splice(0, 0, result)
                    } else {
                        this.commentList.push(result)
                    }
                }
            },
            handlePageChange (page) {
                // this.filterCondition.page = page
                this.fetchComments()
            },
            async fetchComments () {
                this.status = COMMENT_STATUS.loading
                try {
                    // 获取评论列表
                    let {result, total, total_display: totalDisplay} = await commentApi.getComments(this.filterCondition)
                    this.commentList = result
                    this.total = total
                    this.totalDisplay = totalDisplay
                    this.status = COMMENT_STATUS.success
                    // 获取成功后才添加动画效果
                    // console.log('comment load')
                    this.$nextTick(() => {
                        this.commentListTransition.enter = 'animated fadeInDown'
                        this.commentListTransition.leave = 'animated fadeOutRight'
                    })
                } catch (e) {
                    console.error(e)
                    this.status = COMMENT_STATUS.error
                }
            },
            handleAtUser (e) {

            }
            // handleReply (id, parent) {
            //     if (this.commentParentId === id) {
            //         this.commentParentId = null
            //     } else {
            //         this.commentParentId = id
            //     }
            // }
        },
        async created () {
            this.fetchComments()

            try {
                let u = await userApi.auth()
                for (let key in this.user) {
                    this.user[key] = u[key]
                }
            } catch (e) {
                console.log(e)
            }
            this.$on('on-register', () => {this.infoModal = true})
            this.$on('comment-success', this.handleCommentSuccess)
            this.$on('on-at-user', this.handleAtUser)
        },
        mounted () {
        }
    }
</script>
