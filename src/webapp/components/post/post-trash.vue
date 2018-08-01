<template>
<div class="cm-container trash-container">
    <div class="trash-list-warp">
        列表
    </div>
    <div class="trash-post-preview">
        预览
    </div>
</div>
</template>

<script>
export default {
    name: 'post-trash'
}
</script>

<style scoped>
    .trash-container {
        display: flex;
        flex-direction: row;
    }
    .trash-list-warp {
        width: 300px;
        flex-shrink: 0;
    }
    .trash-post-preview {
        width: 100%;
    }
</style>
