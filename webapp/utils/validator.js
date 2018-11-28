// verification
/**
 * 验证termName
 * @param name
 * @returns {boolean}
 */
const TERM_NAME = /^[\u4e00-\u9fa5_a-zA-Z0-9+\\.-]{1,30}$/
export const validTermName = function (name) {
    return TERM_NAME.test(name)
}
