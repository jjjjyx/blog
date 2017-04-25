<template>
<form action="http://localhost:3878/authenticate" method="post">
    <input type="text" name="username" placeholder="Username" v-model="username" />
    <input type="password" name="password" placeholder="Password" v-model="password" />
    <input type="button" value="Login" @click="login" />
    <button type="button" name="button" @click="verify">verify</button>
    <button type="button" name="button" @click="logout">logout</button>
</form>
</template>
<script>

import { login, userGetInfo, logOut } from "../public/js/netapi";

export default {
    data() {
        return {
            username: "",
            password: "",
            token: ""
        };
    },
    components: {},
    computed: {

    },
    methods: {
        async login() {
            await login(this.username, this.password);
            // cookie.set("access_token",data.token)
            // cookie.set("access_token",data.token,+new Date(Date.now()+1000*60*60*24*7),"/","localhost:3878")
        },
        async verify() {
            try {
                await userGetInfo();
            } catch (e) {
            }
        },
        async logout() {
            await logOut();
        }
    },
    mounted() {
        // console.log("login");
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
};
</script>
