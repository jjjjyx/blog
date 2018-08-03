<template>
    <Card >
        <p slot="title">编辑{{prefix}} - #{{target.id}}-{{target.name}}</p>
        <Form :model="targetForm" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem :label="prefix+ '名称'" prop="name">
                <Input v-model="targetForm.name":placeholder="`请输入${prefix}名称`" :maxlength="10"/>
            </FormItem>
            <!--todo 一个选择图标的方案-->
            <!--<Poptip placement="left" width="800">-->
            <!--<FormItem label="分类图标">-->
            <!--<a href="javascript:;">选择图标</a>-->
            <!--&lt;!&ndash;<Input v-model="targetForm.icon" placeholder="Enter something..." />&ndash;&gt;-->
            <!--</FormItem>-->
            <!--<div class="icon-select-panel" slot="content">-->

            <!--</div>-->
            <!--</Poptip>-->
            <FormItem :label="prefix+'图标'" prop="icon" v-if="prefix==='分类'">
                <!--<a href="javascript:;">选择图标</a>-->
                <Input v-model="targetForm.icon" placeholder="输入icon" />
            </FormItem>
            <FormItem :label="prefix+'说明'" prop="description">
                <Input v-model="targetForm.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       :placeholder="prefix+'备注'"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save" :disabled="!isModify">保存</Button>
                <Button type="ghost" style="margin-left: 8px" @click="reset" :disabled="!isModify">重置</Button>
                <Button type="text" style="margin-left: 8px" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import _ from 'lodash'
import {categoryRuleValidate, reset} from './common'

export default {
    name: 'add-term-category',
    data () {
        return {
            ruleValidate: categoryRuleValidate,
            isModify: false,
            targetForm: _.cloneDeep(this.target),
        }
    },
    props: {
        target: {
            type: Object
        },
        prefix: {
            type: String,
            default: '分类'
        }
    },
    methods: {
        reset,
        async save () {
            let valid = await this.$refs.form.validate()
            if (valid) {
                let result = await this.$parent.saveEdit(this.targetForm)
                if (result) { // 添加完成 清空表单
                    // this.$refs.form.resetFields()
                }
            }
        },
        cancel () {
            this.$parent.unEdit()
        }
    },
    watch: {
        target: {
            handler: function (v) {
                if (v) {
                    // 回填
                    // 深度复制一份 在保存修改后重新赋值回去
                    this.targetForm = _.cloneDeep(this.target)
                }
            },
            deep: true
        },
        targetForm: {
            handler: function (val) {
                this.isModify = !_.isEqualWith(val, this.target)
                // if (val) {
                //     this.isModify = true;
                // }
            },
            deep: true
        }
    },
}
</script>
