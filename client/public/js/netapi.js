
let API_SERVER = "http://localhost:3878"

let REQUEST_TIMEOUT = 3000

let ERR_TIMEOUT = -255
let ERR_REUQEST_FAIL = -254

try {
    let pri = require("../../private.js");
    API_SERVER = pri.default.API_SERVER || API_SERVER;
} catch (e) {}

/**
 * 统一的错误处理器
 * [errorHandler description]
 * @param  {[type]} status       状态嘛
 * @param  {[type]} responseJSON 响应体
 * @return {[type]}
 */
let errorHandler = function({status,responseJSON}){
    let data ={code:status};
    switch (status) {
        case 400:
            data.msg = responseJSON.msg;
            layer.alert(data.msg , {
                closeBtn: 0
            });
            break;
        case 401:
            alert("尚未登录!");
            window.location.href="/";
            break;
        case 429:
            data.msg = "请求频繁";
            layer.alert(data.msg, {
                closeBtn: 0
            },()=>{
                window.location.href="/";
            });
            break;
        case 500:
            data.msg = "发生未知错误,请刷新后稍后重试！";
            layer.alert(data.msg, {
                closeBtn: 0
            },()=>{
                location.reload();
            });
            break;
        // case 0:
        default:

    }
    return data
}
$.ajaxSetup({
    // dataType: "json",
    timeout: REQUEST_TIMEOUT,
    xhrFields: {
        withCredentials: true
    },
    headers:{
        "X-Requested-With":"XMLHttpRequest"
    },
    error:errorHandler
});
/**
 * 登录
 * @param  {[type]} username 账号
 * @param  {[type]} password 密码
 * @return {[type]}
 */
export function login(username, password) {
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/user/login`, {
            username,
            password
        }).done((data) => {
            resolve(data);
        }).fail(({responseJSON={code:401}}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 退出登陆 虽然没用过
 * @return {[type]} [description]
 */
export function logOut() {
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/user/logout`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取用户的信息
 * @return {[type]} [description]
 */
export function userGetInfo() {
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/user/auth`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取全部分类
 * @param  {[type]} taxonomy [description]
 * @return {[type]}          [description]
 */
export function getAllTerm(taxonomy){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/getAllTerm`,{taxonomy}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 添加分类
 * @param {[type]} params 分类的全部字段
 */
export function addTerm(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/addTerm`,params).done((data) => {
            resolve(data);
        }).fail(({status,responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 添加标签
 * @param {[type]} params [description]
 */
export function addTag(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/addTag`,params).done((data) => {
            resolve(data);
        }).fail(({status,responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 编辑分类
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function editTermName(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/editTerm`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 删除分类
 * @param  {[type]} term_id [description]
 * @return {[type]}         [description]
 */
export function deleteTerm(term_id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/deleteTerm`,{term_id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 删除标签
 * @param  {[type]} term_id [description]
 * @return {[type]}         [description]
 */
export function deleteTag(term_id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/deleteTag`,{term_id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 新建文章
 * @param {[type]} params [description]
 */
export function addPost(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/newpost`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取全部文章，不包括内容
 * @return {[type]} [description]
 */
export function posts(){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/posts`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 删除文章
 * @param  {[type]} id 要删除的文章id
 * @return {[type]}    [description]
 */
export function delPost(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/delPost`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取文章的内容
 * @param  {[type]} id 要获取文章内容的id
 * @return {[type]}    [description]
 */
export function postContent(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/content`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 保存文章信息
 * @param  {[type]} params 保存的字段
 * @return {[type]}        [description]
 */
export function savePost(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/save`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 保存文章的标签
 * @param  {[type]} params 标签列表
 * @return {[type]}        [description]
 */
export function savePostTag(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/saveTag`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 发布文章
 * @param  {[type]} id 要发布的文章id
 * @return {[type]}    [description]
 */
export function postPublish(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/publish`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 撤销文章发布
 * @param  {[type]} id 要撤销发布的文章id
 * @return {[type]}    [description]
 */
export function postUnPublish(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/postUnPublish`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 文章解锁
 * @param  {[type]} id 将加密的文章解密
 * @return {[type]}    [description]
 */
export function postUnlock(id) {
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/postUnlock`,{id}).done((data) => {
            console.log(data);
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取上传图片的token
 * @return {[type]} [description]
 */
export function getToken(){
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/img/token`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 获取图片服务器的图片列表
 * @return {[type]} [description]
 */
export function getImgs(){
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/img/list`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 删除一个图片
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
export function delImg(key){
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/img/delImg`,{key}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 修改用户信息
 * @param  {[type]} params 修改的信息
 * @return {[type]}        [description]
 */
export function updataUserInfo(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/user/updataInfo`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
/**
 * 修改密码
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function updataUserPass(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/user/updataPass`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}

// export function savePostTag(params){
//     return new Promise((resolve, reject) => {
//         $.post(`${API_SERVER}/api/post/saveTag`,params).done((data) => {
//             resolve(data);
//         }).fail(({responseJSON}) => {
//             reject([responseJSON.code, responseJSON]);
//         });
//     });
// }
