<template>
    <span class="text-icon">
        <i :style="childrenStyle" ref="children">{{text}}</i>
    </span>
</template>

<script>

let $div = document.createElement('div')
// let $i = document.createElement('span')
// $div.appendChild($i)
document.body.appendChild($div)
function getTextWidth (el) {
	let cloneEl = el.cloneNode(true)
    let $span = cloneEl.childNodes[0]
	$div.appendChild(cloneEl)
    let width = $span.offsetWidth
    let w1 = cloneEl.getBoundingClientRect().width
	$div.removeChild(cloneEl)
    return [w1, width]
}

export default {
    name: 'text-icon',
    data () {
        return {
            scale: 1,
            childrenWidth: 0,
            isSlotShow: false
        }
    },
    props: {
        text: {
            required: true,
            type: String
        },
        color: {
            // required: true,
            type: String
        }
    },
    computed: {
        childrenStyle () {
            return {
                msTransform: `scale(${this.scale})`,
                WebkitTransform: `scale(${this.scale})`,
                transform: `scale(${this.scale})`,
                position: 'absolute',
                display: 'inline-block',
                fontStyle: 'normal',
                left: `calc(50% - ${Math.round(this.childrenWidth / 2)}px)`
            }
        }
    },
    methods: {
        setScale () {

            // set children width again to make slot centered
            let [avatarWidth, childrenWidth] = getTextWidth(this.$el)
            this.childrenWidth = childrenWidth // this.$refs.children.offsetWidth
            // console.log(avatarWidth, childrenWidth)
            // const avatarWidth = this.$el.getBoundingClientRect().width
            // console.log(this.childrenWidth, this.$el.getBoundingClientRect().width)
            // add 4px gap for each side to get better performance
            if (avatarWidth - 8 < this.childrenWidth) {
                this.scale = (avatarWidth - 8) / this.childrenWidth
            } else {
                this.scale = 1
            }

        }
    },
    mounted () {
        this.setScale()
    },
    updated () {
        this.setScale()
    }
}
</script>
<style lang="scss">
    .ivu-menu-submenu-title span > i {
        margin-right: 0 !important;
    }
    .text-icon {
        text-align: center;
        background: transparent;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        vertical-align: middle;
        display: inline-block;
        font-size: 1.3rem;
        width: 2rem;
        height: 2rem;
        line-height: 2rem;
    }
    .text-icon i {
        text-transform: capitalize;
    }
</style>
