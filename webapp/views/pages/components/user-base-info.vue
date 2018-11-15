<template>
    <div class="user-base-profile-warp" style="margin-left: 4rem;">
        <div class="user-base-profile__header">
            <div class="float-right">
                <Button type="success" style="width: 100px" :disabled="!isModify" @click="save" class="mr-2"
                        v-t="'curd.action.save'"></Button>
                <!--<Button type="error" style="width: 100px" :disabled="!isModify" @click="reset" v-t="'curd.action.reset'"></Button>-->
            </div>
            <h2>{{user.user_login}} - 基本资料</h2>

        </div>
        <hr>
        <Form ref="formValidate" :rules="ruleValidate" :model="userBaseInfo" label-position="right" :label-width="200">
            <FormItem label="nickname" prop="user_nickname">
                <i-input v-model="userBaseInfo.user_nickname" size="small"/>
            </FormItem>
            <FormItem label="display name" prop="display_name">
                <i-input v-model="userBaseInfo.display_name" size="small"/>
            </FormItem>
            <FormItem label="email" prop="user_email">
                <i-input v-model="userBaseInfo.user_email" size="small"/>
            </FormItem>
            <FormItem label="join data">{{dateFormat(user.createdAt)}}</FormItem>

            <!--<info-row label="last online" value="-"/>-->
            <FormItem label="last online">-</FormItem>
            <FormItem label="website" prop="user_url">
                <i-input v-model="userBaseInfo.user_url" size="small"/>
            </FormItem>

            <!--<FormItem label="about me">-->
            <!--<i-input v-model="userBaseInfo.aa"  size="small" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" />-->
            <!--</FormItem>-->
        </Form>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import isEqual from 'lodash/isEqual'
    import { dateFormat } from '../../../utils/common'
    import { mapState, mapActions} from 'vuex'
    import * as user from '@/api/user'
    import api from '@/api'
    export default {
        name: 'user-base-info',
        data () {
            return {
                userBaseInfo: cloneDeep(this.$store.state.user),
                isModify: false,
                ruleValidate: {
                    user_nickname: [
                        {required: true, message: 'The nick name cannot be empty', trigger: 'blur'}
                    ],
                    display_name: [
                        {required: true, message: 'The display name cannot be empty', trigger: 'blur'}
                    ],
                    user_email: [
                        {required: true, message: 'The email cannot be empty', trigger: 'blur'},
                        {type: 'email', message: 'Incorrect email format', trigger: 'blur'}
                    ],
                    user_url: [
                        {type: 'url', message: 'Incorrect url format', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapState({
                'user': state => state.user
            })
        },
        methods: {
            dateFormat,
            ...mapActions(['mergeUser']),
            async save () {
                // 保存
                let valid = await this.$refs.formValidate.validate()
                if (!valid) {
                    return this.$Message.error(this.$t('messages.curd.valid_fail'))
                }
                try {
                    // 更新token
                    api.token = await user.update(this.userBaseInfo)
                    // 更新当前页面信息
                    this.mergeUser(this.userBaseInfo)
                    this.$Message.success(this.$t('messages.curd.update_success'))
                } catch (e) {
                    this.$Message.error(this.$t('messages.curd.update_fail', e))
                }

            },
            reset () {
                this.userBaseInfo = cloneDeep(this.user)
            }
        },
        watch: {
            userBaseInfo: {
                handler: function (val) {
                    this.isModify = !isEqual(val, this.user)
                },
                deep: true
            }
        }
    }
</script>
