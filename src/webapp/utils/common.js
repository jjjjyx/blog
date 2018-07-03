
export const verification = function (name) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
    let result = reg.test(name)
    // if(!result)
    //     layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
    return result
}
