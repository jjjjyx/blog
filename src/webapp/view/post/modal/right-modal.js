import _ from 'lodash'
import api from '@/utils/api'
export default  {
    data () {
        return {
            ruleValidate: {
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' },
                    {type: 'string', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/, trigger: 'blur', message: '名称只能包含中文英文，下划线，数字,且在长度不超过10！'}
                ],
                description: [
                    {type: 'string', max: 140, trigger: 'blur', message: '备注请控制在140字内'}
                ]
            },
            prefix: '',
            formItem: _.cloneDeep(this.target),
            isModify: false,
            confirmStatus: false
        }
    },
    props: {
        url: {
            type: String,
            required: true
        },
        action: {
            type: String,
            default: 'insert',
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ['insert', 'update'].indexOf(value) !== -1
            }
        },
        target: {
            type: Object,
            required: true
        }
    },
    computed: {
        urlToLine () {
            return this.url.replace(/\/(\w)/g, '-$1')
        },
        title () {
            if (this.action === 'insert') {
                return `添加新${this.prefix}`
            } else {
                return `编辑${this.prefix} # ${this.formItem.id} - ${this.formItem.name}`
            }
        },
        confirmText () {
            if (this.action === 'insert') {
                return "增加"
            } else {
                return "修改"
            }
        }
    },
    methods: {
        async __insert () {
            this.confirmStatus = true
            let flag = true
            try {
                let result = await api.npost(`/api/${this.url}/add`, this.formItem)
                this.$store.dispatch('add_' + this.url, result)
                this.$Message.success('添加成功')
            } catch (e) {
                this.$Message.error('参数错误, 添加失败')
                flag = false
            }
            this.confirmStatus = false
            return flag
        },
        async __update () {
            this.confirmStatus = true
            let flag = true
            try {
                await api.npost(`/api/${this.url}/edit`, this.formItem)
                this.$store.dispatch('edit_' + this.url, this.formItem)
                // 此时的target对象是表格copy 的对象 与vuex管理的不是同一个对象 需要手动更新target对象的值
                _.merge(this.target, this.formItem)
                this.$Message.success('修改成功')
            } catch (e) {
                this.$Message.error('参数错误, 添加失败')
                flag = false
            }
            this.confirmStatus = false
            return flag
        },
        handleConfirm () {
            return this[`__${this.action}`]()
        },
        reset (form = 'form') {
            _.merge(this.formItem, this.target)
            // console.log(this.formItem)
        }
    },
    watch: {
        target: {
            handler: function (v) {
                if (v) {
                    // 回填
                    // 深度复制一份 在保存修改后重新赋值回去
                    this.formItem = _.cloneDeep(this.target)
                }
            },
            deep: true
        },
        formItem: {
            handler: function (val) {
                this.isModify = !_.isEqualWith(val, this.target)
            },
            deep: true
        }
    }
}
