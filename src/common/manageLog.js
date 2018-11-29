// class ManageLog {
//
// }
// const config = require('../../config')
const Enum = require('./enumerate')

// let {de}
// const defaultAvatar = config.defaultAvatar

/*
// 谁 做了什么, 参数是
// value = 关联的值
WHO_TYPE + MANAGE_OPERATION + RELATED_TYPE + value
    = 显示内容
用户${user} 创建${什么} ${value}
用户${user} 修改${什么} ${value1}=>(${old}=>${new}) ${value2}=>(${old}=>${new})
用户${user} 登陆
用户${user} 退出
用户${user} 上传${什么} ${url}
xx 访问网站
xx 访问文章 xx
xx 评论 文章 ${title}
xx 回复 用户
*/
function base (req, mop, rt, value = {}) {

    let user = req.user
    if (user) {
        value['user_id'] = user.id
        value['user_nickname'] = user.nickname
        value['user_display_name'] = user.display_name
        // value['user_avatar'] = user.avatar
    } else {
        value['user_id'] = req.req.cookies[Enum.const.VISITOR_KEY]
    }
}

function login (req) {}

function logout () {}

function update () {}

function create () {}

function access () {}

// function access (){}



