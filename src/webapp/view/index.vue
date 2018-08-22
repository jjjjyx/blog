<template>
    <div>
        index.vue
        <color-icon type="icon-ziyuan" size="100" color="#f00"></color-icon>
        <font-icon type="icon-ziyuan1" size="100"></font-icon>
        <font-icon type="ionic" size="100"></font-icon>
        <Page :current="1" :total="100"></Page>
    </div>
</template>

<script>
export default {
    name: 'index'
}
</script>
