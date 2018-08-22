export const categoryRuleValidate = {
    name: [
        { required: true, message: 'The name cannot be empty', trigger: 'blur' },
        {type: 'string', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/, trigger: 'blur', message: '名称只能包含中文英文，下划线，数字,且在长度不超过10！'}
    ],
    description: [
        {type: 'string', max: 140, trigger: 'blur', message: '备注请控制在140字内'}
    ]
}

export function reset (form = 'form') {
    this.$refs[form].resetFields()
}
