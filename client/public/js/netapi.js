
let API_SERVER = "http://localhost:3878"

let REQUEST_TIMEOUT = 3000

let ERR_TIMEOUT = -255
let ERR_REUQEST_FAIL = -254

try {
    let pri = require("../../private.js");
    API_SERVER = pri.default.API_SERVER || API_SERVER;
} catch (e) {}

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
    error:errorHandler
});

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

export function logOut() {
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/user/logout`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}

export function userGetInfo() {
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/user/auth`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function getAllTerm(taxonomy){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/getAllTerm`,{taxonomy}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function addTerm(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/addTerm`,params).done((data) => {
            resolve(data);
        }).fail(({status,responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function addTag(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/addTag`,params).done((data) => {
            resolve(data);
        }).fail(({status,responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function editTermName(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/editTerm`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function deleteTerm(term_id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/deleteTerm`,{term_id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function deleteTag(term_id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/term/deleteTag`,{term_id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}

export function addPost(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/newpost`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function posts(){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/posts`).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function delPost(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/delPost`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function postContent(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/content`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function savePost(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/save`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function savePostTag(params){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/saveTag`,params).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function postPublish(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/publish`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}
export function postUnPublish(id){
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/post/postUnPublish`,{id}).done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([responseJSON.code, responseJSON]);
        });
    });
}

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
export function getToken(){
    return new Promise((resolve, reject) => {
        $.get(`${API_SERVER}/api/img/token`).done((data) => {
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
