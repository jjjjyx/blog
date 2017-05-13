<template>
<div>
    <label v-if="label">{{ label }}</label>

    <input ref="input" v-bind:value="value" v-on:input="updateValue($event.target.value)">
</div>
</template>
<script>
export default {
    data: function() {
        return {}
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    },
    methods: {
        updateValue: function(value) {
            this.$refs.input.value = value
            this.$emit('input', value)
        },
    },
    mounted: function() {
        console.log("404");
    }
}
</script>
