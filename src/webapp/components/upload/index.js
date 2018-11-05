import Vue from 'vue'
import _ from 'lodash'
import { on } from '@/utils/dom'
import Upload from './upload'
import { randomChar } from '@/utils/common'

const UploadConstructor = Vue.extend(Upload)

let instance

function handleFileSelect (e) {
    e.preventDefault()
    e.stopPropagation()
    let items = e.dataTransfer.items
    // 生成一个随机key 作为同的依据
    let key = randomChar(16)
    // let files = []
    // let addFile = _.debounce(instance.uploadFiles, 500)
    let eachEntry = function (entries) {
        for (let i = 0; i < entries.length; i++) {
            let entry = _.isFunction(entries[i].webkitGetAsEntry) ? entries[i].webkitGetAsEntry() : entries[i]
            if (entry.isFile) {
                entry.file(function (file) {
                    // console.log(file, entry, this)
                    file.fullPath = entry.fullPath
                    file.serial_id = key
                    // console.log('entry.fullPath = ', file.fullPath)
                    // files.push(file)
                    // addFile.call(instance, files)
                    instance.uploadFiles(file)
                })
            } else {
                entry.createReader().readEntries(eachEntry)
            }
        }
    }
    eachEntry(items)
}

function initDropDom () {
    let $div = document.createElement('div')
    $div.innerText = '上传文件到当前目录下'
    $div.style.cssText = 'position: absolute; background: rgba(255, 255, 255, 0.6); border: 3px dashed rgb(204, 204, 204); z-index: 1000000; color: rgb(153, 153, 153); font-size: 40px; text-align: center; overflow: hidden;bottom:0; top: 0px; left: 0px;right:0;display: none;'
    document.body.appendChild($div)
    // $div.setAttribute('id','')
    // 拖拽进入body  显示dom
    on(document.body, 'dragenter', function (e) {
        let items = e.dataTransfer.items
        // 没有包含文件则退出
        let fileFlag = false
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                fileFlag = true
                break
            }
        }
        if (!fileFlag) return
        e.preventDefault()
        let height = `${document.body.clientHeight}px`
        $div.style.height = height
        $div.style.lineHeight = height
        $div.style.display = 'block'
        // console.log('dragenter');
    })
    // 拖拽离开
    on($div, 'dragleave', function (e) {
        e.preventDefault()
        $div.style.display = 'none'
    })
    // 移动中 需要阻止默认事件
    on($div, 'dragover', function (e) {
        e.preventDefault()
    })

    on($div, 'drop', function (e) {
        handleFileSelect(e)
        $div.style.display = 'none'
    })
}

// function initDownDom () {
//     let ifa = document.createElement("iframe")
//     ifa.setAttribute("id","down-file-iframe");
//
//     let ifr = document.createElement("form")
//     ifr.setAttribute("target","down-file-iframe")
//     ifr.setAttribute("method","post");
//     ifr.setAttribute("action",url);
//
//     ifa.appendChild(ifr)
//     document.body.appendChild(ifa)
//     ifr.submit();
//     document.body.removeChild(ifa);
// }

function init (options) {
    options = options || {}
    instance = new UploadConstructor({
        data: options
    })
    instance.$mount()

    document.body.appendChild(instance.$el)

    // instance.visible = true
    // 创建拖拽上传dom
    initDropDom()
    // initDownDom()

    return instance
}

// class UploadOption {
//     static get instance () {
//         return instance
//     }
// }
function install (Vue, opts = {}) {
    init(opts)
    // 增加实例方法
    Vue.prototype.$uploadFiles = instance.uploadFiles
    // Vue.prototype.$uploadFile = instance.upload
}

// export {
//     install
// }
export default install
