<template>
    <div  class="demo-tabs-style2">
        <Tabs size="small" type="card" class="cm-tabs-style" value="">
            <TabPane label="常用" style="max-height: 300px; overflow-y: auto;">
                <RadioGroup v-model="categoryValue" vertical class="sidebar-category-list">
                    <Radio v-for="(item, index) in commonCategoryList" :label="item.id" :key="index">
                        <font-icon :type="item.icon"></font-icon>
                        <span>{{item.name}}</span>
                    </Radio>
                </RadioGroup>
            </TabPane>
            <TabPane label="所有分类" style="max-height: 300px; overflow-y: auto;">
                <RadioGroup v-model="categoryValue" vertical class="sidebar-category-list">
                    <Radio v-for="(item, index) in categoryList" :label="item.id" :key="index">
                        <font-icon :type="item.icon"></font-icon>
                        <span>{{item.name}}</span>
                    </Radio>
                </RadioGroup>
            </TabPane>
        </Tabs>
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header mb-2">
                    <Button size="small" type="text" @click.prevent="collapseStatus1 = !collapseStatus1">添加新分类</Button>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus1" style="padding: 0">
                        <i-Input v-model="value" class="mb-2" placeholder="Enter something..." size="small"></i-Input>
                        <Button size="small" type="primary" @click="add" :loading="createStatusLoading">确认添加</Button>
                    </div>
                </collapse-transition>
            </div>
        </div>
    </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import {mapState} from 'vuex'
import api from '@/api'
import { validTermName } from '@/utils/validator'
import CollapseTransition from '@/utils/collapse-transition'

export default {
    name: 'sidebar-category',
    title: '分类',
    data: () => {
        return {
            collapseStatus1: false,
            value: '',
            createStatusLoading: false
        }
    },
    computed: {
        ...mapState({
            'categoryList': state => state.data.categoryList
        }),
        commonCategoryList: function () {

            return orderBy(this.categoryList, ['count'], ['desc']).slice(0, 5)
        },
        categoryValue: {
            get () {
                return this.$store.getters.categoryValue
            },
            set (value) {
                this.$store.commit('updateCategoryValue', value)
            }
        }
    },
    components: {
        CollapseTransition
    },
    methods: {
        async add () {
            if (!validTermName(this.value)) {
                this.$Message.info('请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！')
            } else {
                // 检查是否存在
                let c = this.categoryList.find((c) => (c.name === this.value))
                if (c) {
                    // 添加失败
                    // 选中
                    this.vertical = c.id
                } else {
                    // 创建标签并且选中
                    this.createStatusLoading = true
                    try {
                        let result = await api.npost('/api/term/category/add', {name: this.value, description: '来自文章编辑', icon: '', slug: ''})
                        this.$store.commit('addCategoryList', result)
                        this.vertical = result.id
                        this.collapseStatus1 = false
                        this.value = ''
                    } catch (e) {
                        this.createStatusLoading = false
                        this.$Message.info('添加标签失败')
                    } finally {
                        this.createStatusLoading = false
                    }
                }
            }
        }
    },
    mounted () {
    }
}
</script>
