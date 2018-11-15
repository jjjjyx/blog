<template>
    <div class="profile-info-row" :class="{'profile-info-row--hasedit': edit}">
        <div class="profile-info-row__label">{{label}}:</div>
        <div class="profile-info-row__value">
            <template v-if="!editStatus">
                <slot>{{value}}</slot>
                <font-icon class="edit-btn" type="ios-create" @click="handle" v-if="edit"/>
            </template>
            <template v-else>
                <slot name="edit">
                    <i-input v-model="tempValue" size="small" style="width: 200px"/>
                </slot>
                <ButtonGroup size="small" class="ml-2">
                    <Button icon="md-checkmark" type="success" @click="handleOk"></Button>
                    <Button icon="md-close" @click="handleCancel"></Button>
                </ButtonGroup>
            </template>


        </div>
    </div>
</template>

<script>
    export default {
        name: 'info-row',
        data ()  {
            return {
                editStatus: false,
                tempValue: this.value
            }
        },
        props: {
            label: {
                type: String
            },
            value: {
                type: String
            },
            edit: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handle () {
                this.editStatus = true
            },
            handleOk () {
                this.$emit('input', this.tempValue)
            },
            handleCancel () {
                this.editStatus = false
            }
        }
    }
</script>
