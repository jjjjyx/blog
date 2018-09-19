<template>
    <form class="comment-input-warp" @submit.prevent>
        <div class="comment-input__user comment-user-avatar">
            <img :src="$parent.currentAvatar" alt="user-avatar">
        </div>
        <div class="comment-input__body">
            <textarea id="comment" class="textarea"
                      name="name" rows="8" cols="80"
                      ref="textarea"
                      v-model="currentValue"
                      @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                      placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。">
           </textarea>
            <div class="opts-warp">
                <Dropdown trigger="click">
                    <Button size="small"><font-icon type="icon-biaoqing"></font-icon> 表情</Button>
                    <f-emoji slot="list"/>
                </Dropdown>
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
            <Button type="primary">发表<br>评论</Button>
        </div>
    </form>
</template>

<script>
import FEmoji from './emoji.vue'

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
    computed: {},
    props: {

        parame: {
            type: Object,
            default: function () {
                return {
                    comment_author: '',
                    comment_author_email: '',
                    comment_author_url: '',
                    comment_author_avatar: ''
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
        }
    },
    watch: {
        'value' (val, oldValue) {
            this.setCurrentValue(val)
        }
    },
    methods: {
        openEmojiDown () {

            // $(this.$refs['j-emoji-down']).dropdown('open')
        },
        handleBlur (event) {
            this.$emit('blur', event)
        },
        handleFocus (event) {
            this.$emit('focus', event)
        },
        handleInput (event, v) {
            const value = v || event.target.value
            this.$emit('input', value)
            this.setCurrentValue(value)
            this.$emit('change', value)
        },
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
        }
    },
    mounted () {

    }
}
</script>
