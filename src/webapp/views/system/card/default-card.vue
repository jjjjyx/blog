<template>
    <Card dis-hover>
        <h4 slot="title">{{layoutItem.name}}</h4>
        <Form label-position="top">
            <FormItem v-for="key in layoutItem.items" :key="key">
                <h3 slot="label">{{siteMap[key].text}}</h3>
                <small slot="label">{{siteMap[key].textSmall}}</small>
                <Input v-model="siteMap[key].value"/>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
export default {
    name: 'index-card',
    props: {
        layoutItem: {
            type: Object,
            required: true
        }
    },
    computed: {
        siteMap () {
            return this.$parent.siteMap
        }
    }
}
</script>
