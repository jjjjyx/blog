'use strict'

function getError (action, option, xhr) {
    const msg = `fail to post ${action} ${xhr.status}'`
    const err = new Error(msg)
    err.status = xhr.status
    err.method = 'post'
    err.url = action
    return err
}

function getBody (xhr) {
    const text = xhr.responseText || xhr.response
    if (!text) {
        return text
    }

    try {
        return JSON.parse(text)
    } catch (e) {
        return text
    }
}

const ajax = function (option) {
    if (typeof XMLHttpRequest === 'undefined') {
        return
    }

    const xhr = new XMLHttpRequest()
    const action = option.action

    if (xhr.upload) {
        xhr.upload.onprogress = function progress (e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100
            }
            option.onProgress(e)
        }
    }

    xhr.onerror = function error (e) {
        option.onError(e)
    }

    xhr.onload = function onload () {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr), getBody(xhr))
        }

        option.onSuccess(getBody(xhr))
    }

    xhr.open('post', action, true)

    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
    }

    const headers = option.headers || {}

    // if (headers['X-Requested-With'] !== null) {
    //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // }

    for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item])
        }
    }
    if (option.isBase64) { // base64 的文件上传不带data 参数
        let base64 = option.file
        let dIndex = base64.indexOf(',') + 1
        let fileBase64 = base64.substring(dIndex)
        // 需要把参数添加在url 后面
        // let _action = action
        // if (option.data) {
        //     let url = new URL(action)
        //     Object.keys(option.data).map(key => {
        //         url.searchParams.append(key, option.data[key])
        //     })
        //     _action = url.toString()
        // }

        xhr.send(fileBase64)
    } else {
        xhr.open('post', action, true)
        const formData = new FormData()
        if (option.data) {
            Object.keys(option.data).map(key => {
                formData.append(key, option.data[key])
            })
        }

        formData.append(option.filename, option.file)

        xhr.send(formData)
    }
}

export default ajax
