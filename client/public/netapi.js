
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

export default {
    userSignin: (username, password) => {
        return new Promise((resolve, reject) => {
            $.post(`${API_SERVER}/api/user/signin`, {
                username,
                password
            }).done((data) => {
                // if (data.code === 0) {
                //     sockapi.init();
                // }
                resolve([data.code, data]);
            }).fail((data) => {
                reject([data.code, data]);
            });
        });
    },

    userSignout: () => {
        return new Promise((resolve, reject) => {
            $.post(`${API_SERVER}/api/user/signout`).done((data) => {
                // sockapi.disconnect();
                resolve([data.code, null]);
            }).fail(() => {
                resolve([ERR_REUQEST_FAIL, null]);
            });
        });
    },

    userGetInfo: () => {
        return new Promise((resolve, reject) => {
            $.post(`${API_SERVER}/api/user/auth`).done((data) => {
                resolve([data.code, data.data]);
            }).fail((data) => {
                resolve([ERR_REUQEST_FAIL, data.data]);
            });
        });
    },

    getSheetInfoByFileName: (fileName) => {
        return new Promise((resolve, reject) => {
            $.get(`${FILE_API_SERVER}/api/table/info/${fileName}`).done((data) => {
                resolve([data.code, data.token]);
            }).fail((data) => {
                resolve([ERR_REUQEST_FAIL, data.data]);
            });
        });
    },

    getSheelContentBySheetName : (fileName,{sheetName='Sheet1',page = 1}) => {
        return new Promise((resolve, reject) => {
            $.get(`${FILE_API_SERVER}/api/table/${fileName}/${sheetName}/${page}`).done((data) => {
                resolve([data.code, data.data]);
            }).fail((data) => {
                resolve([ERR_REUQEST_FAIL, data.data]);
            });
        });
    },

    getUploadFileToken: (file_info) => {
        return new Promise((resolve, reject) => {
            $.get(`${UPLOAD_API_SERVER}/api/upload/token`,file_info).done((data) => {
                resolve([data.code, data.token]);
            }).fail((data) => {
                resolve([ERR_REUQEST_FAIL, null]);
            });
        });
    },
}
