// 分类- 标签名称
const TERM_NAME_REG = /^[\u4e00-\u9fa5_a-zA-Z0-9+\\.-]{1,30}$/
// 分类标签短id规则
const TERM_SLUG_REG = /^[a-zA-Z0-9\-_]{1,30}$/
// 文章别名
const POST_NAME_REG = /^[_a-zA-Z0-9-]{1,60}$/
// 评论提交的用户正则
const COMMENT_MEMBERS_REG = /([%|@])(\d+)/

module.exports.TERM_NAME_REG = TERM_NAME_REG
module.exports.TERM_SLUG_REG = TERM_SLUG_REG
module.exports.POST_NAME_REG = POST_NAME_REG
module.exports.COMMENT_MEMBERS_REG = COMMENT_MEMBERS_REG
