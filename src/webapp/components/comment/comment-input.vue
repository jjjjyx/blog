<template>
    <form class="comment-input-warp" @submit.prevent :class="{disable: !isLogin}">
        <div class="comment-input__user comment-user-avatar">
            <img :src="$parent.currentAvatar" alt="user-avatar">
        </div>
        <div class="comment-input__body">
            <!--@input="handleInput" @focus="handleFocus" @blur="handleBlur"-->
            <textarea id="comment" class="textarea" ref="textarea"
                      name="name" rows="8" cols="80"
                      v-model="currentValue" :placeholder="placeholder">
           </textarea>
            <div class="opts-warp">
                <f-emoji @on-add-emoji="handleAddEmoji"/>
                <span class="send__tip">Ctrl+Return 发表</span>

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
            <Button type="primary" @click="handleClickSend">发表<br>评论</Button>
        </div>
    </form>
</template>

<script>
import FEmoji from './emoji.vue'
import {on, off} from '../../utils/dom'
import { getMetaKeyCode } from '../../utils/common'

export default {
    name: 'comment-input',
    data () {
        return {
            currentValue: this.value
        }
    },
    components: {
        FEmoji
    },
    computed: {
        isLogin () {
            return this.$parent.isLogin
        }
    },
    props: {
        parame: {
            type: Object,
            default: function () {
                return {
                    comment_author: '',
                    comment_author_email: '',
                    comment_author_url: '',
                    comment_author_avatar: '',
                    realLength: 0
                }
            }
        },
        value: {
            type: String,
            required: true
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
        handleClickSend (e) {
            this.$emit('on-send', this.currentValue, this.realLength)
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
            if (keyCode === 4109) { // ctrl + entry
                this.handleClickSend()
            }
        }
    },
    destroyed () {
        off(this.$refs.textarea, 'keyup', this._handleKeyUp)
    },
    mounted () {
        on(this.$refs.textarea, 'keyup', this._handleKeyUp)
        console.log(this.currentValue)
    }
}
</script>
