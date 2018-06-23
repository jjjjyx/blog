<template>
    <div  class="demo-tabs-style2">
        <Tabs size="small" type="card">
            <TabPane label="所有分类">所有分类</TabPane>
            <TabPane label="常用">常用</TabPane>
        </Tabs>
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header mb-2">
                    <Button size="small" type="text" @click.prevent="collapseStatus1 = !collapseStatus1">添加新分类</Button>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus1" style="padding: 0">
                        <i-Input v-model="value" class="mb-2" placeholder="Enter something..." size="small"></i-Input>

                        <Button size="small" type="primary">确认添加</Button>
                    </div>
                </collapse-transition>
            </div>
        </div>
    </div>
</template>

<script>
import CollapseTransition from '@/utils/collapse-transition'
export default {
    name: 'sidebar-category',
    title: '分类',
    data: () => {
        return {
            collapseStatus1: false,
            value: ''
        }
    },
    components: {
        CollapseTransition
    },
    methods: {
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
