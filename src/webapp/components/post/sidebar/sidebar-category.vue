<template>
    <div  class="demo-tabs-style2">
        <Tabs size="small" type="card">
            <TabPane label="所有分类">
                <RadioGroup v-model="vertical" vertical class="sidebar-category-list">
                    <Radio v-for="(item, index) in categoryList" :label="item.term_id" :key="index">
                        <Icon  v-if="item.icon.indexOf('iconfont') == -1" :type="item.icon" ></Icon>
                        <i v-else  :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </Radio>
                </RadioGroup>
            </TabPane>
            <TabPane label="常用">
                <RadioGroup v-model="vertical" vertical class="sidebar-category-list">
                    <Radio v-for="(item, index) in commonCategoryList" :label="item.term_id" :key="index">
                        <Icon  v-if="item.icon.indexOf('iconfont') == -1" :type="item.icon" ></Icon>
                        <i v-else  :class="item.icon"></i>
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
import CollapseTransition from '@/utils/collapse-transition'
import {verification} from '../../../utils/common'
import {mapGetters} from 'vuex'
import api from '@/utils/api'
import _ from 'lodash'
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
        ...mapGetters(['categoryList']),
        commonCategoryList: function () {
            let arr = _.orderBy(this.categoryList, ['count'], ['desc']).slice(0, 5)
            return arr
        },
        vertical: {
            get () {
                return this.$store.state.postWriter.sidebarCategoryValue
            },
            set (value) {
                this.$store.commit('updateSidebarCategoryValue', value)
            }
        }
    },
    components: {
        CollapseTransition
    },
    methods: {
        async add () {
            if (!verification(this.value)) {
                this.$Message.info('请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！')
            } else {
                // 检查是否存在
                let c = this.categoryList.find((c) => (c.name === this.value))
                if (c) {
                    // 添加失败
                    // 选中
                    this.vertical = c.term_id
                } else {
                    // 创建标签并且选中
                    this.createStatusLoading = true
                    try {
                        let result = await api.npost('/api/term/c/add', {name: this.value, description: '来自文章编辑', icon: '', slug: ''})
                        this.$store.commit('updateAddCategoryList', result)
                        this.vertical = result.term_id
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
<style>
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
    font-size: 12px;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar {
    margin-bottom: 0;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card .ivu-tabs-tabpane {
    border: 1px solid #dddee1;
    border-top-width: 0;
    padding: 10px;
    margin-bottom: 15px;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
