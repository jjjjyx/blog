<template>
    <Card >
        <p slot="title">添加新{{prefix}}</p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem :label="prefix+ '名称'" prop="name">
                <Input v-model="formItem.name" :placeholder="`请输入${prefix}名称`" :maxlength="10"/>
            </FormItem>
            <!--todo 一个选择图标的方案-->
            <!--<Poptip placement="left" width="800">-->
            <!--<FormItem label="分类图标">-->
            <!--<a href="javascript:;">选择图标</a>-->
            <!--&lt;!&ndash;<Input v-model="formItem.icon" placeholder="Enter something..." />&ndash;&gt;-->
            <!--</FormItem>-->
            <!--<div class="icon-select-panel" slot="content">-->

            <!--</div>-->
            <!--</Poptip>-->
            <FormItem :label="prefix+'图标'" prop="icon" v-if="prefix==='分类'">
                <!--<a href="javascript:;">选择图标</a>-->
                <Input v-model="formItem.icon" placeholder="输入icon" />
            </FormItem>
            <FormItem :label="prefix+'说明'" prop="description">
                <Input v-model="formItem.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       :placeholder="prefix+'备注'"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="add">添加</Button>
                <Button type="ghost" style="margin-left: 8px" @click="reset">重置</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import {categoryRuleValidate, reset} from './common'
export default {
    name: 'add-term-category',
    data () {
        return {
            ruleValidate: categoryRuleValidate
        }
    },
    props: {
        formItem: {
            type: Object
        },
        prefix: {
            type: String,
            default: '分类'
        }
    },
    methods: {
        reset,
        async add () {
            let valid = await this.$refs.form.validate()
            if (valid) {
                let result = await this.$parent.add()
                if (result) { // 添加完成 清空表单
                    this.$refs.form.resetFields()
                }
            }
        }
    }
}
</script>
