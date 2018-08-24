<template>
    <Card >
        <p slot="title" v-text="title"></p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem :label="prefix+ '名称'" prop="name">
                <Input v-model="formItem.name" :placeholder="`请输入${prefix}名称`" :maxlength="30"/>
            </FormItem>
            <!---->
            <FormItem :label="prefix + '说明'" prop="description">
                <Input v-model="formItem.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       :placeholder="prefix+'备注'"/>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="confirmStatus" :disabled="!isModify"
                        @click="handleConfirm" v-text="confirmText"></Button>
                <Button type="ghost" style="margin-left: 8px" @click="reset()">重置</Button>
                <!--<Button type="text" style="margin-left: 8px" @click="cancel">取消</Button>-->
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import rightModal from './right-modal'
export default {
    mixins: [rightModal],
    name: 'right-modal',
    data () {
        return {
            prefix: '标签',
        }
    },
    methods: {
    }

}
</script>
