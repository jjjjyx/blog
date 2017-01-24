<template>
    <form class="post-form markdown">
        <input class="title am-text-truncate" :value="title"/>

    </form>
</template>
<style lang="less" scoped>
    .post-form {
        .title {
            width: 100%;
            height: 61px;
            padding: 0 30px 10px 40px;
            margin-bottom: 0;
            border: none;
            border-bottom: 1px solid #d9d9d9;
            font-size: 30px;
            font-weight: normal;
            line-height: 30px;
            box-shadow: none;
            outline: none;
            -webkit-appearance: none;

        }
    }
</style>
<script>
export default {
    data: function() {
        return {
            title:'无标题文章'
        }
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {
        // console.log("404");
    }
}
</script>
