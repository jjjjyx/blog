

export default {
    data () {
        return {
            defaultAvatar: 'https://image.cdn.mbdoge.cn/FuNJUwEY1vEWt5ncFeVXhVG4-R6S',
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        currentAvatar () {
            return this.user.user_avatar || this.defaultAvatar
        },
        isLogin () {
            return !!this.user.id
        }
    }

}
