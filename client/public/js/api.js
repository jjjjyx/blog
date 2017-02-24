
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
            // data.msg = responseJSON.msg||"";
            // // layer.alert(data.msg , {
            // //     closeBtn: 0
            // // });
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
        case 0:
        default:
            data.msg = "发生未知错误,请刷新后稍后重试！";
            layer.alert(data.msg, {
                closeBtn: 0
            },()=>{
                location.reload();
            });
    }
    return data
}
$.ajaxSetup({
    dataType: "json",
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
export function loadMore(params) {
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/`,params,null,'html').done((data) => {
            resolve(data);
        }).fail(({responseJSON}) => {
            reject([500]);
        });
    });
}
