<template>
    <svg class="svg-icon" aria-hidden="true" :style="styles" @click="handleClick">
        <use v-bind:xlink:href="iconHref" :fill="fill"></use>
    </svg>
</template>

<script>
// import
export default {
    name: 'b-icon',
    props: {
        type: {
            type: String,
            default: ''
        },
        size: [Number, String],
        color: String,
        custom: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconHref () {
            return `#${this.type}`
        },
        fill () {
            if (this.color) {
                return this.color
            }
        },
        styles () {
            let style = {};
            if (this.size) {
                style['font-size'] = `${this.size}px`;
            }

            return style;
        }
    },
    methods: {
        handleClick (event) {
            this.$emit('click', event);
        }
    }
}
</script>
