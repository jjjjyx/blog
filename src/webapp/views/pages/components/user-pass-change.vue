<template>
    <div class="user-pass-change-warp">
        <h2>修改密码</h2>
        <hr>
        <Form ref="formData" :rules="ruleInline" :model="formData" label-position="right" :label-width="200">
            <FormItem label="旧密码" prop="oldPass">
                <i-input v-model="formData.oldPass"/>
            </FormItem>
            <FormItem label="新密码" prop="newPass">
                <i-input v-model="formData.newPass"/>
            </FormItem>
            <FormItem label="确认密码" prop="confirmPass">
                <i-input v-model="formData.confirmPass"/>
            </FormItem>

            <FormItem class="mt-3">
                <i-button type="primary" @click="save">确认修改</i-button>
            </FormItem>
            <!--<FormItem label="about me">-->
            <!--<i-input v-model="userBaseInfo.aa"  size="small" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" />-->
            <!--</FormItem>-->
        </Form>
    </div>
</template>

<script>
    import * as user from '@/api/user'
    const passReg = new RegExp(
        '^(?![a-zA-z]+$)(?!\\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\\d!@#$%^&*]+$)[a-zA-Z\\d!@#$%^&*]+$')
    export default {
        name: 'user-pass-change',
        data () {
            return {
                formData: {
                    oldPass: '',
                    newPass: '',
                    confirmPass: ''
                }
            }
        },
        computed: {
            ruleInline () {
                return {
                    newPass: [
                        {required: true, trigger: 'blur', message: this.$t('messages.form.password_empty')},
                        {validator: this.validatePass, trigger: 'blur'}
                    ],
                    confirmPass: [
                        {validator: this.validatePassCheck, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            validatePass (rule, value, callback) {
                if (value === '') {
                    callback(new Error(this.$t('messages.form.password_empty')))
                } else if (value === this.formData.oldPass) {
                    callback(new Error(this.$t('messages.form.password_old')))
                } else if (!passReg.test(value)) {
                    callback(new Error(this.$t('messages.form.password_fail')))
                } else {
                    if (this.formData.confirmPass !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formData.validateField('confirmPass')
                    }
                    callback()
                }
            },
            validatePassCheck (rule, value, callback) {
                if (value === '') {
                    callback(new Error(this.$t('messages.form.pass_check_empty')))
                } else if (value !== this.formData.newPass) {
                    callback(new Error(this.$t('messages.form.pass_check')))
                } else {
                    callback()
                }
            },
            async save () {

                let valid = await this.$refs.formData.validate()
                if (!valid) {
                    return this.$Message.error(this.$t('messages.curd.valid_fail'))
                }

                try {
                    await user.changePass(this.formData)
                    this.$Message.success(this.$t('messages.curd.update_success'))
                } catch (e) {
                    this.$Message.error(this.$t('messages.curd.update_fail', e))
                }

            }
        }
    }
</script>
