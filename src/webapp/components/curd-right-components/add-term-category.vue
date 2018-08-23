<template>
    <Card >
        <p slot="title">添加新{{prefix}}</p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem :label="prefix+ '名称'" prop="name">
                <Input v-model="formItem.name" :placeholder="`请输入${prefix}名称`" :maxlength="10"/>
            </FormItem>
            <!---->
            <Poptip placement="left-start" width="600">
                <FormItem :label="prefix+'图标'" prop="icon" v-if="prefix==='分类'">
                    <Poptip placement="bottom" trigger="hover">
                        <font-icon :type="formItem.icon" v-if="formItem.icon"></font-icon>
                        <div slot="content" style="text-align: center">
                            <font-icon :type="formItem.icon" size="100" v-if="formItem.icon"></font-icon>
                        </div>
                    </Poptip>
                    <a href="javascript:;">选择图标</a>
                    <!--<Input v-model="formItem.icon" placeholder="输入icon" />-->
                </FormItem>
                <icon-select slot="content" @on-select="handleSelectIcon"></icon-select>
            </Poptip>
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
// import IconSelect from '../../../components/icon/icon-select'

export default {
    name: 'add-term-category',
    components: {
        IconSelect: () => import('@/components/icon/icon-select')
    },
    data () {
        return {
            ruleValidate: categoryRuleValidate,
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
        },
        handleSelectIcon (icon) {
            this.formItem.icon = icon
        }
    }
}
</script>
