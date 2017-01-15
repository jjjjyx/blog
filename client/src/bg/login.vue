<template>
<form action="http://localhost:3878/authenticate" method="post">
    <input type="text" name="username" placeholder="Username" v-model="username"/>
    <input type="password" name="password" placeholder="Password" v-model="password"/>
    <input type="button" value="Login" @click="login" />
    <button type="button" name="button" @click="verify"></button>
</form>
</template>
<script>
import {login,getUserInfo} from "../../public/js/netapi.js";
export default {
    data() {
        return {
            username:'',
            password:'',
            token :'',
        }
    },
    components: {},
    computed: {

    },
    methods: {
        async login() {
            let [code,data] = await login(this.username,this.password)
            console.log(data);
            cookie.set("access_token",data.token)

        },
        async verify() {
            let s = await getUserInfo()
            console.log(s);
        }
    },
    mounted: function() {
        // console.log("login");
    }
}
</script>
