<template>
    <Modal transfer v-model="modalVisible">
        <!--<curd-update/>-->

        <Form class="curd-fun-container" label-position="top" ref="form" :model="formData">
            <h3 class="curd-fun__title">
                {{$t('curd.fun_update_title', {name: labelName, key: value[idKey]})}}
            </h3>
            <FormItem :label="$t(`${name}.columns.${column.key}`)" v-for="(column, index) in formItems" :key="index" v-if="column.type === 'text'">
                <Input v-model="formData[column.key]" placeholder=""/>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="modalVisible = false">{{$t('curd.action.cancel')}}</Button>
            <Button type="primary" @click="handleSave" :disabled="!isModify">{{$t('curd.action.save')}}</Button>
        </div>
    </Modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import isEqualWith from 'lodash/isEqualWith'

const noAllowTypes = ['index', 'selection', 'expand', 'html', 'PK']
export default {
    name: 'curd-update',
    props: {
        name: {
            type: String
        },
        labelName: {
            type: String
        },
        columns: {
            type: Array,
            required: true
        },
        value: {
            type: Object,
            required: true
        },
        visible: {
            type: Boolean,
            required: true
        },
        idKey: {
            type: String,
            default: 'id'
        }
    },
    data () {
        return {
            formData: cloneDeep(this.value),
            formItems: [],
            isModify: false,
            modalVisible: this.visible
        }
    },
    created () {
        this.formItems = this.columns.filter((item) => {
            if (item.type) {
                return noAllowTypes.indexOf(item.type) === -1
            } else {
                return false
            }
        })
    },
    mounted () {
        // console.log('123123')
    },
    watch: {
        visible (val) {
            if (val) {
                this.modalVisible = val
            }
        },
        modalVisible (val) {
            this.$emit('update:visible', val)
        },
        formData: {
            handler: function (value) {
                this.isModify = !isEqualWith(value, this.value)
            },
            deep: true
        },
        value: {
            handler: function (value) {
                this.formData = cloneDeep(this.value)
            }
            // deep: true
        }
    },
    methods: {
        async handleSave () {
            let $p = this.$parent
            let result = await $p._updateToServer(this.formData)
            if (result) {
                this.modalVisible = false
                Object.assign(this.value, this.formData)
                // this.formData = {}
                // $p.$refs.addPoptip.cancel()
            }
        },
        handleReset () {
            this.$refs['form'].resetFields()
        }
    }
}
</script>
