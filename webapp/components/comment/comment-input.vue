<template>
    <form class="comment-input-warp" @submit.prevent :class="{disable: !isLogin}">
        <div class="comment-input__user comment-user-avatar">
            <img :src="currentAvatar" alt="user-avatar">
        </div>
        <div class="comment-input__body">
            <div class="no-login-modal" v-if="true">
                <!--文章很不错想要评论又没有账号的点这里哦-->
                暂时关闭了游客评论，等待我实现下游客系统，之前的游客系统有安全漏洞。反正也没人来，关了也没人知道~
                <!--<Icon type="ios-megaphone"/>-->
                <!--<a href="javascript:void(0);" @click="handleRegister">游客指南评论指南</a>-->
            </div>
            <div class="no-login-modal" v-else-if="!isLogin">
                文章很不错想要评论又没有账号的点这里哦
                <Icon type="ios-megaphone"/>
                <a href="javascript:void(0);" @click="handleRegister">游客指南评论指南</a>
            </div>
            <!--@input="handleInput" @focus="handleFocus" @blur="handleBlur"-->
            <textarea id="comment" class="textarea" ref="textarea"
                      name="name" rows="8" cols="80"
                      v-model="currentValue" :placeholder="placeholder">
           </textarea>
            <div class="opts-warp">
                <f-emoji @on-add-emoji="handleAddEmoji"/>
                <span class="send__tip">Ctrl + Return 发表</span>

                <!--v-if="parame.comment_author&&parame.comment_author_email"-->
                <!--<div class="float-right" v-if="false">-->
                <!--<span class="am-margin-right-xs">{{parame.comment_author}}</span>-->
                <!--<span class="j-btn" @click="editInfo">-->
                <!--<i class="am-icon-cog"></i> 修改资料-->
                <!--</span>-->
                <!---->
                <Button size="small" v-if="showCancel" class="float-right" @click="$emit('cancelReply')">取消</Button>
            </div>
        </div>
        <div class="comment-input__submit">
            <Button type="primary" @click="handleClick" :disabled="!isLogin">发表<br>评论</Button>
        </div>
    </form>
</template>

<script>
// import api from '@/api'
import * as commentApi from '@/api/comment'

import { on, off } from '../../utils/dom'
import { getMetaKeyCode } from '../../utils/common'
import CommentMixins from './comment-mixins'
import Emitter from '../../mixins/emitter'
import FEmoji from './emoji.vue'

export default {
    name: 'comment-input',
    mixins: [CommentMixins, Emitter],
    data () {
        return {
            currentValue: this.value
        }
    },
    components: {
        FEmoji
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        commentTargetId: {
            type: String,
            required: true
        },
        commentParentId: {
            type: String,
            default: null
        },
        members: {
            type: Array,
            default: () => ([])
        },
        value: {
            type: String,
            default: ''
        },
        showCancel: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。'
        }
    },
    watch: {
        'value' (val, oldValue) {
            this.currentValue = val
            // this.$emit('input', val)
            // this.setCurrentValue(val)
        },
        currentValue (val) {
            this.$emit('input', val)
        }
    },
    methods: {
        // async handleClickSend (e) {
        //     if (this.isLogin) {
        //         // this.comment(content)
        //         let content = this.currentValue.trim()
        //         if (content.length < 2 || content.length > 1000) {
        //             this.$Message.warning('请提交不包含表情， 2 - 1000 字以内的评论')
        //             return null
        //         }
        //         try {
        //             let result = await api.npost('/api/comment', {content, ...this.$parent.commentDate})
        //             this.$emit('comment-success', result, this.$parent.commentDate)
        //             this.currentValue = ''
        //         } catch (e) {
        //             this.$Message.info(e.message)
        //         }
        //     } else {
        //         // this.infoModal = true
        //         this.$emit('auth')
        //     }
        // },
        async handleClick () {
            let content = this.currentValue.trim()
            if (content.length < 2 || content.length > 1000) {
                this.$Message.warning('请提交不包含表情， 2 - 1000 字以内的评论')
                return null
            }
            if (!this.isLogin) {
                return this.handleRegister()
            }

            try {
                let result = await commentApi.comment({
                    content: content,
                    parent: this.commentTargetId,
                    comment_parent: this.commentParentId,
                    members: this.members
                })
                this.dispatch('comment', 'comment-success', result, {
                    commentTargetId: this.commentTargetId,
                    commentParentId: this.commentParentId
                })
                this.currentValue = ''
            } catch (e) {
                this.$Message.info('评论失败')
            }
        },
        handleRegister () {
            this.dispatch('comment', 'on-register')
        },
        handleAddEmoji (value) {
            this.currentValue += value
        },
        // handleFocus (event) {
        //     this.$emit('focus', event)
        // },
        // handleInput (event, v) {
        //     const value = v || event.target.value
        //     this.$emit('input', value)
        //     this.setCurrentValue(value)
        //     this.$emit('change', value)
        // },
        setCurrentValue (value) {
            if (value === this.currentValue) return
            this.currentValue = value
        },
        selectEmoji (item) {
            this.handleInput(null, this.currentValue + item)
        },

        editInfo () {
            // this.$emit('editInfo')
            // const authorForm = $('#my-prompt')
            // authorForm.modal({width: 320})
        },
        _handleKeyUp (e) {
            let keyCode = getMetaKeyCode(e)
            switch (keyCode) {
            case 16434: // @
                this.dispatch('on-at-user', e)
                break
            case 4109:
                this.handleClickSend()
                break
            }
        }
    },
    destroyed () {
        off(this.$refs.textarea, 'keyup', this._handleKeyUp)
    },
    mounted () {
        on(this.$refs.textarea, 'keyup', this._handleKeyUp)
    }
}
</script>
