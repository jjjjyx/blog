<template>
    <Card>
        <p slot="title" v-text="title"></p>
        <Form :model="formItem" :label-width="100" ref="form" :rules="ruleValidate">
            <FormItem :label="$t('tag.modal.name')" prop="name">
                <Input v-model="formItem.name" :placeholder="$t('tag.modal.name_placeholder')" :maxlength="30"/>
            </FormItem>
            <!---->
            <FormItem :label="$t('tag.modal.desc')" prop="description">
                <Input v-model="formItem.description" type="textarea"
                       :maxlength="140"
                       :autosize="{minRows: 2,maxRows: 5}"
                       :placeholder="$t('tag.modal.desc_placeholder')"/>
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
        data () {
            return {
                prefix: 'tag'
            }
        },
        methods: {
            ...mapActions({
                insertAction: 'addTermTag',
                updateAction: 'updateTermTag'
            })
        }

    }
</script>
