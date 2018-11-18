<template>
    <li class="comment-list__item">
        <div class="user-avatar comment-user-avatar">
            <img :src="item.comment_author_avatar" alt="user-avatar">
        </div>
        <div class="comment-content">
            <comment-username class="comment-content__header" :user="item.user">
                <span class="float-right"># {{item.comment_karma}}</span>
            </comment-username>
            <div class="comment-content__body" v-html="renderCommentContent(item)"></div>
            <footer class="comment-content__footer">
                <font-icon type="icon-color-phone"></font-icon>
                <span class="">来自{{item.comment_agent}}设备</span>
                <time :datetime="item.createdAt">{{item.time}}</time>
                <font-icon type="icon-zan" class="opt j-logo--a"></font-icon>
                <span>0</span>
                <font-icon type="icon-oppose" class="opt j-logo--a"></font-icon>
                <span>0</span>
                <Button type="text" size="small" @click="reply()">回复</Button>
                <!--v-if="!item.user_id"-->
                <span class="float-right j-report j-logo--a">举报</span>
            </footer>
            <ul class="reply-list-warp ">
                <comment-reply-item v-for="reply in item.child" :key="reply.id" :item="reply"></comment-reply-item>
            </ul>
            <collapse-transition>
                <comment-input v-if="commentParentId === item.id" class="reply-input-warp"
                               :user="$parent.$parent.user"
                               :comment-target-id="$parent.$parent.commentTargetId"
                               :comment-parent-id="commentParentId"
                               :show-cancel="true"
                               :members="members"
                               :placeholder="placeholder"
                               @cancelReply="$emit('update:commentParentId', null)">
                </comment-input>
            </collapse-transition>
        </div>

    </li>
</template>

<script>
    import CollapseTransition from '@/utils/collapse-transition'
    import CommentInput from './comment-input'
    import CommentUsername from './comment-username'
    import CommentReplyItem from './comment-reply-item'

    const EMOJI_REG = /:([\w\\+-]+):/g
    const USER_NICKNAME_REG = /@[\u4e00-\u9fa5a-zA-Z0-9_-]{1,18}/
    export default {
        name: 'comment-item',
        components: {
            CommentReplyItem,
            CollapseTransition,
            CommentInput,
            CommentUsername
        },
        data () {
            return {
                emojiPath: 'http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/',
                placeholder: '',
                members: []
            }
        },
        props: {
            item: {
                type: Object,
                required: true
            },
            commentParentId: {
                type: Number,
                default: 0
            }
        },
        methods: {
            renderCommentContent (item) {
                let {comment_content: content} = item
                content = content.split('\n').join('<br>')
                content = content.replace(EMOJI_REG, ($1, $2)=> `<img src="${this.emojiPath}${$2}.png" title="${$2}" alt="${$2}" width="24" class="align-middle"/>`);
                content = content.replace(USER_NICKNAME_REG, ($1, $2) => {
                    // console.log($1,'=======')
                    // 用户名在 item 中验证是否存在 在进行替换
                    return `<a href="javascript:void(0);">${$1}</a>`
                })
                return content
            },
            // /**
            //  * 回复
            //  * @param id 回复的对象
            //  * @param at @ 对象
            //  */
            reply (parent) {
                let p = ''
                if (parent) {
                    p = `回复 ${parent.comment_author} `
                    this.members.push('%' + parent.user_id)
                }
                // 也有可能是关闭
                if (this.commentParentId === this.item.id && p === this.placeholder) {
                    // this.commentParentId = null
                    this.$emit('update:commentParentId', null)
                    this.placeholder = ''
                } else {
                    this.$emit('update:commentParentId', this.item.id)
                    this.placeholder = p
                }
                // this.$emit('reply', this.item.id, parent)
            //     this.replyContent = ''
            //     let p = ''
            //     if (replyTarget) {
            //         p = `回复 ${replyTarget.comment_author} `
            //         this.commentParentId = replyTarget.id
            //         // this.placeholder
            //     }
            //     // if (this.commentParentId === id) {
            //     //
            //     // }
            //     // if (this.commentDate.comment_parent === id && p === this.commentDate.placeholder) {
            //     //     this.commentDate.comment_parent = null
            //     //     this.commentDate.placeholder = ''
            //     // } else {
            //     //     this.commentDate.comment_parent = id
            //     //     this.commentDate.placeholder = p
            //     // }
            },
        },
        mounted () {
        }
    }
</script>
