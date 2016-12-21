<style>

.test-reg{
    width: 500px;
    margin: auto;
}
</style>

<template>

<div class="test_tttt">
    <form role="form" class="test-reg" @submit.prevent>
  <div class="form-group">
    <label for="exampleInputEmail1">账号</label>
    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">密码</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
   <div class="form-group">
     <label for="exampleInputPassword2">确认密码</label>
     <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
   </div>
  <button type="button" class="btn btn-default">Submit</button>
</form>
    <button class="ui red button">test info 通知</button>

</div>

</template>

<script>

import api from '../netapi.js'

import {mapGetters,mapActions} from 'vuex'
export default {
    data() {
        return {
        }

    },
    components: {
    },
    computed: {
        ...mapGetters({}),
    },

    methods: {
        ...mapActions([
            'info',
            'success',
            'notify',
            'error',
            'warning'
        ]),
    },
    watch: {

    },

    mounted() {

    }
}

</script>
