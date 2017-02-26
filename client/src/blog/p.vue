<template>
    <div class="my-app">
        这是一个 404 页面sss
        {{haa}}
        <input type="text" v-model="haa" />
        a
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            haa:'hello'
        }
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {
        console.log("404");
    }
}
</script>
