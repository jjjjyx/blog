<template>
    <div class="curd-table-title-wrap">
        <div class="category-name-icon">
            <Poptip placement="bottom" trigger="hover">
                <font-icon  :type="category.icon" ></font-icon>
                <div slot="content" style="text-align: center">
                    <font-icon  :type="category.icon"  size="100"></font-icon>
                </div>
            </Poptip>
        </div>
        <div class="category-name-wrap">
            <div class="category-name">
                <a href="javascript:;">{{category.name}}</a>
                <!--<span> &#45;&#45; 文章个数 ( <a href="javascript:;" class="u">{{category.count||0}}</a> )</span>-->
            </div>
            <button-group size="small" class="curd-table-options2">
                <i-button type="text" :disabled="isDefaultCategory" @click="$emit('edit', category)">编辑</i-button>
                <i-button type="text" :disabled="isDefaultCategory" @click="$emit('del', category)" style="color: rgb(237, 63, 20);">
                    删除
                </i-button>
                <i-button type="text">查看</i-button>
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
    .curd-table-title-wrap {
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
