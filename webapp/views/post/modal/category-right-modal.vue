<template>
    <Card>
        <p slot="title" v-text="title"></p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate">
            <FormItem :label="$t('category.modal.name')" prop="name">
                <Input v-model="formItem.name" :placeholder="$t('category.modal.name_placeholder')" :maxlength="30"/>
            </FormItem>
            <!---->
            <Poptip placement="left-start" width="600">
                <FormItem :label="$t('category.modal.icon')" prop="icon">
                    <Poptip placement="bottom" trigger="hover">
                        <font-icon :type="formItem.icon" v-if="formItem.icon"></font-icon>
                        <div slot="content" style="text-align: center">
                            <font-icon :type="formItem.icon" size="100" v-if="formItem.icon"></font-icon>
                        </div>
                    </Poptip>
                    <a href="javascript:;" v-text="$t('category.modal.icon_select_text')"></a>
                    <!--<Input v-model="formItem.icon" placeholder="输入icon" />-->
                </FormItem>
                <icon-select slot="content" @on-select="handleSelectIcon"></icon-select>
            </Poptip>
            <FormItem :label="$t('category.modal.desc')" prop="description">
                <Input v-model="formItem.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       :placeholder="$t('category.modal.desc_placeholder')"/>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="confirmStatus" :disabled="!isModify"
                        @click="handleConfirm" v-text="confirmText"></Button>
                <Button style="margin-left: 8px" @click="reset()" v-text="$t('curd.action.reset')"></Button>
                <!--<Button type="text" style="margin-left: 8px" @click="cancel">取消</Button>-->
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import rightModal from './right-modal'
import { mapActions } from 'vuex'

export default {
    mixins: [rightModal],
    name: 'right-modal',
    components: {
        IconSelect: () => import('@/components/icon/icon-select')
    },
    data () {
        return {
            prefix: 'category'
        }
    },
    methods: {
        ...mapActions({
            insertAction: 'addTermCategory',
            updateAction: 'updateTermCategory'
        }),
        handleSelectIcon (icon) {
            this.formItem.icon = icon
        }
    }
}
</script>
