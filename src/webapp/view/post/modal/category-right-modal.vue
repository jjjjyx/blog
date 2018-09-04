<template>
    <Card >
        <p slot="title" v-text="title"></p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate" >
            <FormItem :label="prefix+ '名称'" prop="name">
                <Input v-model="formItem.name" :placeholder="`请输入${prefix}名称`" :maxlength="30"/>
            </FormItem>
            <!---->
            <Poptip placement="left-start" width="600">
                <FormItem :label="prefix+'图标'" prop="icon">
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
    components: {
        IconSelect: () => import('@/components/icon/icon-select')
    },
    data () {
        return {
            prefix: '分类'
        }
    },
    methods: {
        handleSelectIcon (icon) {
            this.formItem.icon = icon
        }
    }
}
</script>
