
// let API_SERVER = "http://121.42.198.67:8081";
let API_SERVER = "http://139.129.17.237:8081"
let FILE_API_SERVER = "http://139.129.17.237:15001"
let UPLOAD_API_SERVER = "http://121.42.198.67:9001"
    // let API_SERVER = "http://192.168.184.167:8081"
let REQUEST_TIMEOUT = 3000

let ERR_TIMEOUT = -255
let ERR_REUQEST_FAIL = -254

try {
    let pri = require("../../private.js");
    API_SERVER = pri.default.API_SERVER || API_SERVER;
} catch (e) {}

$.ajaxSetup({
    dataType: "json",
    timeout: REQUEST_TIMEOUT,
    xhrFields: {
        withCredentials: true
    }
});
export function login(username, password) {
    return new Promise((resolve, reject) => {
        $.post(`${API_SERVER}/api/user/login`, {
            username,
            password
        }).done((data) => {
            resolve([data.code, data.data]);
        }).fail((data) => {
            reject([data.code, data.data]);
        });
    });
}

export function getUserInfo() {
    return new Promise((resolve, reject) => {
        var token = cookie.get('access_token')
        console.log(token)
        $.ajax(`${API_SERVER}/api/user/verify`,{
            type:"POST",
            headers:{
                Authorization:'Bearer ' + token
            }
        }).done((data) => {
            resolve([data.code, data]);
        }).fail((data) => {
            reject([data.code, data]);
        });
    });
}
