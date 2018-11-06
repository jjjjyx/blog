<template>
    <div class="error-page error__404">
        <div class="error__404-warp">
            <span>4</span>
            <span><span class="screen-reader-text">0</span></span>
            <span>4</span>
        </div>
        <h1 v-t="'error.404'"></h1>
        <p v-t="'error.404_desc'"></p>

        <Button  class="mt-3 error-btn" to="/">返回首页</Button>
    </div>
</template>

<script>
export default {
    name: 'error-404'
}
</script>
