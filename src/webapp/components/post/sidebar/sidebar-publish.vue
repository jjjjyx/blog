<template>
    <div class="">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="flag"></Icon>
                    <span>状态:</span>
                    <b>已发布</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus1 = !collapseStatus1">编辑</a>
                </div>
                <collapse-transition>
                <div class="j-collapse-body" v-show="collapseStatus1">
                    <Select size="small" style="width:100px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Button size="small" type="ghost">确定</Button>
                    <Button size="small" type="text">取消</Button>
                </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="eye"></Icon>
                    <span>公开度:</span>
                    <b>已发布</b>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus2 = !collapseStatus2">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus2">
                        <RadioGroup v-model="tmpp" vertical>
                           <Radio label="apple">
                               <Icon type="social-apple"></Icon>
                               <span>Apple</span>
                           </Radio>
                           <Checkbox class="ml-4" :disabled="tmpp !='apple'">Checkbox</Checkbox>
                            <Radio label="android">
                                <Icon type="social-android"></Icon>
                                <span>Android</span>
                            </Radio>
                            <Radio label="windows">
                                <Icon type="social-windows"></Icon>
                                <span>Windows</span>
                            </Radio>
                        </RadioGroup>
                        <br>
                        <Button size="small" type="ghost">确定</Button>
                        <Button size="small" type="text">取消</Button>
                    </div>
                </collapse-transition>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-timer"></Icon>
                    <span>版本:</span>
                    <b>6</b>
                    <a href="javascript:void(0);">查看</a>
                </div>
            </div>

            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-calendar-outline"></Icon>
                    <span>发布于:</span>
                    <span>2018年6月23日 23:46</span>
                    <a href="javascript:void(0);" @click.prevent="collapseStatus3 = !collapseStatus3">编辑</a>
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus3">
                        <DatePicker size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="Select date and time(Excluding seconds)" style="width: 100%"></DatePicker>
                    </div>
                </collapse-transition>
            </div>
        </div>
        <div class="postbox-options">
            <Button size="small" type="text" style="color: #ed3f14">移至回收站</Button>
            <Button size="small" class="float-right " type="primary">发布</Button>
            <Button size="small" class="float-right mr-1" type="success">
                <a href="" style="color: inherit;">预览更改</a>
            </Button>
        </div>
    </div>
</template>

<script>
import CollapseTransition from '@/utils/collapse-transition'
export default {
    components: {
        CollapseTransition
    },
    name: 'sidebar-publish',
    title: '发布',
    data: () => {
        return {
            allowPostStatus: ['draft', 'pending'],
            collapseStatus1: false,
            collapseStatus2: false,
            collapseStatus3: false,
            collapseStatus4: false,
            tmpp: '',
            statusList: [
                {
                    value: 'New York',
                    label: 'New York'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                }
            ]
        }
    },
    props: ['currentPost'],
    methods: {}
}
</script>
