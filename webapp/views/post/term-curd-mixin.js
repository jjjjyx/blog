import cloneDeep from 'lodash/cloneDeep'

import {mapActions} from 'vuex'
let modalForm = {name: '', slug: '', description: '', icon: ''}
export default {
    data () {
        return {
            action: 'insert',
            modalFormItem: modalForm,
            cloneModalFormItem: cloneDeep(modalForm)
        }
    },
    methods: {
        ...mapActions({'fetchTerms': 'fetchTerms'}),
        insert () {
            this.modalFormItem = cloneDeep(this.cloneModalFormItem)
            this.action = 'insert'
        },
        edit (target) {
            this.action = 'update'
            this.modalFormItem = target
        }
    }
}
