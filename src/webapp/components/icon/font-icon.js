import ColorIcon from './icon'

const prefixCls = 'iconfont'
export default {
    name: 'font-icon',
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
    components: {
        ColorIcon
    },
    computed: {
        classes () {
            return [
                `${prefixCls}`,
                {
                    [this.type]: this.type !== '',
                    [this.custom]: this.custom !== ''
                }
            ]
        },
        styles () {
            let style = {}
            if (this.size) {
                style['font-size'] = `${this.size}px`
            }
            if (this.color) {
                style.color = this.color
            }
            return style
        }
    },
    methods: {
        handleClick (event) {
            this.$emit('click', event)
        }
    },
    render (h) {
        let {type, size, color, custom} = this
        let i
        if (type.startsWith('icon-color-')) {
            i = h('color-icon', {
                props: {
                    type, size, color, custom
                },
                on: {
                    click: this.handleClick
                }
            })
        } else if (type.startsWith('icon-')) {
            i = h('i', {
                class: this.classes,
                style: this.styles,
                on: {
                    click: this.handleClick
                }
            })
        } else {
            i = h('Icon', {
                props: {
                    type, size, color, custom
                },
                on: {
                    click: this.handleClick
                }
            })
        }
        return i
    }
}
