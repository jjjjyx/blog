<style>

.list-item {
    display: inline-block;
    margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
    transition: all 1s;
}

.list-enter,
.list-leave-active {
    opacity: 0;
    transform: translateY(30px);
}

.test_tttt {}

.test_tttt>div.htable {
    position: relative;
    overflow: hidden;
    height: 400px;
    width: 800px;
}

.test-ul,
.test-ul>li {
    display: inline-block;
    margin-right: 5px;
}

</style>

<template>

<div class="test_tttt">
    <button class="ui red button">test info 通知</button>
    <!-- <button class="ui orange button">Orange</button>
    <button class="ui yellow button">Yellow</button>
    <button class="ui olive button">Olive</button>
    <button class="ui green button">Green</button>
    <button class="ui teal button">Teal</button>
    <button class="ui blue button">Blue</button>
    <button class="ui violet button">Violet</button>
    <button class="ui purple button">Purple</button>
    <button class="ui pink button">Pink</button>
    <button class="ui brown button">Brown</button>
    <button class="ui grey button">Grey</button>
    <button class="ui black button">Black</button> -->


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
