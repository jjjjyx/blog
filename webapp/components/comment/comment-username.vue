<template>
    <div>
        <a class="comment-user-name name">{{user.user_nickname}}</a>
        <Tooltip :content="user.display_name" placement="right" v-if="user.role === 100">
            <font-icon type="icon-color-king" :title="user.display_name"  size="18"></font-icon>
        </Tooltip>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'comment-username',
    props: {
        user: {
            type: Object
        }
    }
}
</script>
