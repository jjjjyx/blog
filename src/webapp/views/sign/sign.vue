<template>
    <div class="login-container">
        <div class="login__navigation">
            <div class="login__navigation__item" :class="'login__navigation__item--' + item.color" @click="$router.push({name: item.view, query: $route.query})"
                 v-if="$route.name !== item.view"
                 :key="item.view"
                 v-for="item in views">{{$t(item.key)}}</div>
        </div>
        <transition name="fade-transform" mode="out-in">
            <router-view class="login-form-warp"></router-view>
        </transition>
    </div>
</template>

<script>

	export default {
		name: 'login',
		data () {
			return {
				currView: 'view-login',
				views: [
                    {key: 'login.login', view: 'sign_in', color: 'red'},
                    // {key: 'login.register', view: 'sign_up', color: 'green'},
                    {key: 'login.forgot-pass', view: 'sign_forgot_pass' , color: 'orange'},
                ]
			}
		},
		computed: {

		},
		methods: {}
	}
</script>
