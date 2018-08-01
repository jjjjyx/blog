<template>
    <div class="cms-table-title-wrap">
        <div class="category-name-icon">
            <Icon  v-if="category.icon.indexOf('iconfont') == -1" :type="category.icon" ></Icon>
            <i v-else  :class="category.icon"></i>
        </div>
        <div class="category-name-wrap">
            <div class="category-name">
                <a href="javascript:;">{{category.name}}</a> <span> -- 文章个数 ( <a href="javascript:;" class="u">{{category.count}}</a> )</span>
            </div>
            <button-group size="small" class="cms-table-options">
                <i-button type="ghost">编辑</i-button>

                <i-button type="ghost" :disabled="isDefaultCategory" @click="$emit('del', $event, category)" style="color: rgb(237, 63, 20);">
                    <!--<Tooltip content="默认分类不可删除">-->
                    删除
                </i-button>
                <i-button type="ghost">预览</i-button>
            </button-group>
        </div>
    </div>
</template>

<script>
// import {mapState, mapActions, mapGetters} from 'vuex'
export default {
    name: 'category-name',
    props: {
        category: {
            type: Object,
            required: true
        }
    },
    computed: {
        isDefaultCategory () {
            return this.category.id === this.$store.getters.defaultCategoryValue
        }
    },
    methods: {
        // del () {
        //
        // }
    }
}
</script>
<style scoped>
    .cms-table-title-wrap {
        display: flex;
        align-items: center;
    }

    .category-name-icon {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
    }
    .category-name {
        margin-bottom: .5rem;
    }
    .category-name span {
        font-size: 1rem;
    }
    .category-name .u {
        text-decoration: underline;
        color: initial;
    }
</style>
