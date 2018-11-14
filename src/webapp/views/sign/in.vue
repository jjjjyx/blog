<template>
    <Form ref="formItem" :model="formItem" :rules="ruleInline">
        <h1 class="login__title">{{$t('login.login_title')}}</h1>
        <FormItem prop="username">
            <Input type="text" v-model="formItem.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="formItem.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
        </FormItem>


        <div class="ivu-form-inline">
            <FormItem>
                <Checkbox v-model="formItem.checkbox">{{$t('login.remember_me')}}</Checkbox>
            </FormItem>
            <FormItem style="float: right;">
                <Dropdown trigger="click" placement="bottom-end" @on-click="handleChangeI18n">
                    <a href="javascript:void(0)">
                        {{$t('navbar.language')}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem :key="item.name" :selected="language === item.name" :name="item.name"
                                      v-for="item in langs">
                            {{item.label}}
                        </DropdownItem>
                        <!--<DropdownItem name="zh-TW">中文繁体</DropdownItem>-->
                        <!--<DropdownItem name="en-US">English</DropdownItem>-->
                    </DropdownMenu>
                </Dropdown>
            </FormItem>
        </div>
        <Button type="error" :loading="loading" class="login__btn" @click="handleSubmit('formItem')" shape="circle"
                icon="md-arrow-round-forward"/>
    </Form>
</template>

<script>
	import api from '@/api'
    import user from '@/api/user'
	// import config from '@/config'
	// const {token_key} = config
	import { mapActions, mapState } from 'vuex'
	import signMixins from './sign-mixins'

	export default {
		mixins: [signMixins],
		name: 'view-login',
		data () {
			return {
				langs: [
					{name: 'zh-CN', label: '中文简体'},
					{name: 'zh-TW', label: '中文繁体'},
					{name: 'en-US', label: 'English'}
				],
				formItem: {
					username: '',
					password: ''
				},
			}
		},
		computed: {
			...mapState({
				'language': 'language'
			}),
			ruleInline () {
				return {
					username: [{required: true, message: this.$t('messages.form.username_empty'), trigger: 'blur'}, {
						type: 'string',
						min: 2,
						message: this.$t('messages.form.username_length'),
						trigger: 'blur'
					}],
					password: [{required: true, message: this.$t('messages.form.password_empty'), trigger: 'blur'}, {
						type: 'string',
						min: 6,
						message: this.$t('messages.form.password_length'),
						trigger: 'blur'
					}]
				}
            }
		},
		methods: {
			...mapActions(['setLanguage']),
			async handleSubmit (name) {
				this.loading = true
				let valid = await this.$refs[name].validate()

				if (!valid) {
					this.loading = false
					return this.$Message.error(this.$t('messages.signin_valid_error'))
				}
				try {
					let {token} = await user.login(this.formItem.username, this.formItem.password)
					api.token = token
					// // 没有勾选 清除掉 localStorage 这样仅
					// localStorage.setItem(token_key, '')
					this.$router.push({path: this.redirect || '/'})
				} catch (e) {
					this.$Message.error(this.$t('messages.signin_error'))
				} finally {
					this.loading = false
				}
			},
			handleChangeI18n (lang) {
				this.$i18n.locale = lang
				this.setLanguage(lang)
				this.$Message.success(this.$t('messages.switch_language'))
			}
		}
	}
</script>
