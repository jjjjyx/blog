<template>
    <Card >
        <p slot="title">添加新分类</p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem label="分类名称" prop="name">
                <Input v-model="formItem.name" placeholder="请输入分类名称" :maxlength="10"/>
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
            <FormItem label="分类图标" prop="icon">
                <!--<a href="javascript:;">选择图标</a>-->
                <Input v-model="formItem.icon" placeholder="输入icon" />
            </FormItem>
            <FormItem label="分类说明" prop="description">
                <Input v-model="formItem.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       placeholder="分类备注"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="add">添加</Button>
                <Button type="ghost" style="margin-left: 8px" @click="reset">重置</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
export default {
    name: 'add-term-category',
    data () {
        return {
            ruleValidate: {
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' },
                    {type: 'string', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/, trigger: 'blur', message: '名称只能包含中文英文，下划线，数字,且在长度不超过10！'}
                ],
                description: [
                    {type: 'string', max: 140, trigger: 'blur', message: '备注请控制在140字内'}
                ]
            }
        }
    },
    props: {
        formItem: {
            type: Object
        }
    },
    mounted () {
        console.log(this.$parent)
    },
    methods: {
        reset() {
            this.$refs.form.resetFields()
        },
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
