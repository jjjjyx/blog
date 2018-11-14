<template>
    <Form ref="formItem" :model="formItem" :rules="ruleInline">
        <h1 class="login__title">{{$t('login.register_title')}}</h1>
        <FormItem prop="username">
            <Input type="text" v-model="formItem.username" placeholder="账号">
            <Tooltip content="账号" slot="prepend">
                <Icon type="ios-mail-outline"></Icon>
            </Tooltip>
            </Input>
        </FormItem>
        <FormItem prop="nickname">
            <Input type="text" v-model="formItem.nickname" placeholder="昵称">
            <Tooltip content="昵称" slot="prepend">
                <Icon type="ios-person-outline"></Icon>
            </Tooltip>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="formItem.password" placeholder="密码">
            <Tooltip content="密码" slot="prepend">
                <Icon type="ios-lock-outline"></Icon>
            </Tooltip>
            </Input>
        </FormItem>
        <FormItem prop="cp">
            <Input type="password" v-model="formItem.cp" placeholder="确认密码">
            <Tooltip content="确认密码" slot="prepend">
                <Icon type="ios-lock-outline"></Icon>
            </Tooltip>
            </Input>
        </FormItem>

        <div class="ivu-form-inline">
            <FormItem prop="checkbox">
                <Checkbox v-model="formItem.checkbox">{{$t('login.protocol')}} <a href="javascript:void(0);"
                                                                                  @click="openProtocol">{{$t('login.protocol_name')}}</a>
                </Checkbox>
            </FormItem>
        </div>
        <Button type="success" class="login__btn" @click="handleSubmit('formItem')" shape="circle" :loading="loading"
                icon="md-arrow-round-forward"/>
    </Form>
</template>

<script>
	import api from '@/utils/api'
	import signMixins from './sign-mixins'

	export default {
		mixins: [signMixins],
		name: 'view-register',
		data () {

			return {
				formItem: {
					nickname: '',
					username: '',
					password: '',
					cp: '',
					checkbox: false

				}
			}
		},
		computed: {
			ruleInline () {

				return {
					username: [
						{required: true, message: this.$t('messages.form.username_empty'), trigger: 'blur'},
						{min: 6, max: 24, message: this.$t('messages.form.username_up_length'), trigger: 'blur'}
					],
					nickname: [
						{required: true, max: 24, message: this.$t('messages.form.nickname_empty'), trigger: 'blur'}
					],
					password: [
						{required: true, trigger: 'blur', message: this.$t('messages.form.password_empty')},
						{type: 'string', min: 8, max: 32, message: this.$t('messages.form.password_up_length')},
						{validator: this.validatePass, trigger: 'blur'}
					],
					cp: [
						{validator: this.validatePassCheck, trigger: 'blur'}
					],
					checkbox: [
						{validator: this.validatorProtocol}
					]
				}
			}
		},
		methods: {
			validatePass (rule, value, callback) {
				if (value === '') {
					callback(new Error(this.$t('messages.form.password_empty')))
				} else {
					if (this.formItem.cp !== '') {
						// 对第二个密码框单独验证
						this.$refs.formItem.validateField('cp')
					}
					callback()
				}
			},
			validatePassCheck (rule, value, callback) {
				if (value === '') {
					callback(new Error(this.$t('messages.form.pass_check_empty')))
				} else if (value !== this.formItem.password) {
					callback(new Error(this.$t('messages.form.pass_check')))
				} else {
					callback()
				}
			},
			validatorProtocol (rule, value, callback) {
				if (value) {
					callback()
				} else {
					callback(new Error(this.$t('messages.form.terms_false')))
				}
			},
			openProtocol () {

			},
			async handleSubmit (name) {
				this.loading = true
				let valid = await this.$refs[name].validate()

				if (!valid) {
					this.loading = false
					return this.$Message.error(this.$t('messages.signup_valid_error'))
				}
				try {
					let {token} = await api.npost('/api/user/signup', this.formItem)
					api.token = token
					this.$router.push({path: this.redirect || '/'})
					// this.$router.push('/')
					// 注册成功， 直接登录 调整到首页
					// console.log(result)
				} catch (e) {
					this.$Message.error(this.$t('messages.signup_error'))
				} finally {
					this.loading = false
				}
			},
			handleReset (name) {
				this.$refs[name].resetFields()
			}
		}
	}
</script>
