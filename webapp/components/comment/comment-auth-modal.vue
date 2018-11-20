<template>
    <Modal v-model="infoModal" title="一个必须填写的表单" scrollable="true">
        <div class="user-info-wrap">
            <div class="sidebar-user-avatar">
                <a href="javascript:void(0)" class="user-avatar-area">
                    <img :src="formData.user_avatar || defaultAvatar" alt="">
                </a>
                <a @click="changeAvatar" class="edit-avatar">不喜欢，点击换一个</a>
            </div>
            <Form :model="formData" :label-width="80" :rules="ruleValidate" class="wrapper-base-info"
                  ref="userinfoform">
                <FormItem label="qq" prop="user_login">
                    <Input v-model="formData.user_login" placeholder="输入qq 号 快速评论" @on-blur="inputQQ"/>
                </FormItem>
                <FormItem label="昵称" prop="user_nickname">
                    <Input v-model="formData.user_nickname" placeholder="nickname" @on-change="lockNickName"/>
                </FormItem>
                <FormItem label="邮箱" prop="user_email">
                    <Input v-model="formData.user_email" placeholder="email"/>
                </FormItem>
                <FormItem label="网址" prop="user_url">
                    <Input v-model="formData.user_url" placeholder="email"/>
                </FormItem>
            </Form>
        </div>
        <Button slot="footer" type="text" @click="infoModal = false">取消</Button>
        <Button slot="footer" type="primary" @click="handleOk">确认</Button>
    </Modal>
</template>

<script>
    import api from '@/api'
    import * as toolsApi from '@/api/tools'
    import * as commentApi from '@/api/comment'
    import CommentMixins from './comment-mixins'

    const qqReg = /[1-9][0-9]{4,}/

    export default {
        name: 'comment-auth-modal',
        mixins: [CommentMixins],
        data () {
            return {
                infoModal: this.visible,
                formData: _.cloneDeep(this.user),
                // 是否修改过昵称
                lockNick: false,
                // 账号验证规则
                ruleValidate: {
                    user_nickname: [{
                        type: 'string',
                        min: 1,
                        max: 18,
                        trigger: 'blur',
                        message: '虽然知道你很长，但是请控制在18个长度以内哦~'
                    }],
                    user_email: [{type: 'email', trigger: 'blur', message: '不要调皮，邮箱格式你心里没点`atob(\'Qg==\');`数吗'}],
                    user_url: [{type: 'url', trigger: 'blur', message: '网址格式不正确'}],
                    user_login: [{
                        type: 'regexp',
                        min: 3,
                        max: 18,
                        trigger: 'blur',
                        message: '虽然知道你很长，但是请控制在18个长度以内哦~',
                        pattern: /^[a-zA-Z0-9_\\-]{3,18}$/
                    }]
                },

            }
        },
        props: {
            visible: {
                type: Boolean,
                required: true
            }
        },
        watch: {
            infoModal: function (val) {
                if (!val) {
                    this.$emit('update:visible', false)
                }
            },
            visible: function (val) {
                if (val) {
                    this.infoModal = true
                }
            },
            user: {
                deep: true,
                handler (val) {
                    this.formData = _.cloneDeep(val)
                }
            }
        },
        methods: {
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
            async changeAvatar () {
                // console.log(11)
                try {
                    let data = await commentApi.changeAvatar()
                    console.log(data)
                    this.formData.user_avatar = data
                } catch (e) {
                    this.$Message.info(e.message)
                }
            },
            handleOk: async function () {
                try {
                    let valid = await this.$refs.userinfoform.validate()
                    if (valid) {
                        // 完善评论信息
                        let result = await commentApi.writeUser(this.formData)
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
                        this.formData.user_login = this.user.user_login
                    }
                }
            },
        },
        async created () {
            async function inputQQ () {
                if (this.lockNick) return
                let qq = this.formData.user_login
                try {
                    if (qqReg.test(qq)) {
                        let result = await toolsApi.getQQInfo(qq)
                        // console.log(result)
                        if (result) {
                            this.formData.user_nickname = result.nickname
                            this.formData.user_avatar = result.avatar
                        }
                    }
                } catch (e) {
                    console.log('获取qq 用户信息失败')
                }
            }

            this.inputQQ = _.debounce(inputQQ.bind(this), 500)

        }
    }
</script>
