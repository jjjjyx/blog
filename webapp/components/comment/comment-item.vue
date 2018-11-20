<template>
    <li class="comment-list__item">
        <div class="user-avatar comment-user-avatar">
            <img :src="item.comment_author_avatar" alt="user-avatar">
        </div>
        <div class="comment-content">
            <comment-username class="comment-content__header" :user="item.user">
                <span class="float-right"># {{item.comment_karma}}</span>
            </comment-username>
            <comment-content :item="item"></comment-content>
            <!--<div class="comment-content__body" v-html="renderCommentContent(item)"></div>-->
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
    import CommentContent from './comment-content'

    export default {
        name: 'comment-item',
        components: {
            CommentContent,
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
            },
        },
        mounted () {
        }
    }
</script>
