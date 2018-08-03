<template>
    <Card >
        <p slot="title">选择多项</p>
        <div>
            <i-button type="ghost" icon="trash-a" @click="$parent.remove()" :disabled="$parent.selectedNum === 0">删除</i-button>
        </div>
    </Card>
</template>

<script>
export default {
    name: 'default-right'
}
</script>
