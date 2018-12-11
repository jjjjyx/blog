<template>
    <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <div class="upload-modal" v-show="visible">
            <div class="ivu-modal-content">
                <a class="ivu-modal-close" @click="visible = false"><i
                    class="ivu-icon ivu-icon-ios-close-empty"></i></a>
                <a class="ivu-modal-size" @click="contentVisible = !contentVisible">
                    <Icon :type="sizeIcon"></Icon>
                </a>
                <div class="ivu-modal-header">
                    <div class="ivu-modal-header-inner">
                        {{title}}
                    </div>
                </div>
                <collapse-transition>
                    <div class="ivu-alert ivu-alert-success" v-if="alertVisible"><!---->
                        <span class="ivu-alert-message">{{alertVisible}}</span>
                        <span class="ivu-alert-desc"></span>
                        <a class="ivu-alert-close" @click="alertVisible = false">
                            <i class="ivu-icon ivu-icon-ios-close"></i>
                        </a>
                    </div>
                </collapse-transition>
                <!-- 做一个最大最小化-->
                <collapse-transition>
                    <div class="ivu-modal-body" v-show="contentVisible">
                        <i-table :columns="columns4" :data="showFiles" class="upload-list" size="small"
                                 height="350"></i-table>
                        <div slot="footer" class="ivu-table-footer upload-list-footer-tip" v-show="isBigQueue">
                            表格数据过多，
                            <a href="javascript:void(0);" @click="showMore">点击显示更多数据</a>
                        </div>
                    </div>
                </collapse-transition>
            </div>
        </div>
    </transition>
</template>

<script>

import orderBy from 'lodash/orderBy'
import cloneDeep from 'lodash/cloneDeep'
import differenceBy from 'lodash/differenceBy'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'

import store from '@/store'
import ajax from '@/utils/ajax'
import CollapseTransition from '@/utils/collapse-transition'
import { randomChar, formatFileSize } from '@/utils/common'
import * as media from '../../api/media'
import { Queue, Task } from './task-queue'

const extClass = {
    // 图片
    'bmp': 'pic',
    'gif': 'pic',
    'jpg': 'pic',
    'png': 'pic',
    'tiff': 'pic',
    'pcx': 'pic',
    'tga': 'pic',
    'exif': 'pic',
    'svg': 'pic',
    'psd': 'pic',
    'cdr': 'pic'
}

function transformExtToClass (ext) {
    return extClass[ext] ? extClass[ext] : ext
}

const renderFileName = function (h, param) {
    let iconClass = ''
    let fileType
    let { row } = param
    let name = row.name && row.name !== 'null' ? row.name : row.key
    if (row.file) {
        iconClass = `file-icon-small-${transformExtToClass(row.ext)} default-small`
        fileType = 'file'
    } else {
        iconClass = 'dir-small'
        fileType = 'folder'
    }
    let imgSrc = row.raw.miniurl
    let $image = <img slot="content" src={imgSrc} class="table-file-poptip-img"/>

    let $icon = <span class={['table-file-icon', iconClass]}/>
    let $name = <a class="table-file-name" title={name} onClick={(e) => this.$emit('on-click-' + fileType, row, e)}>{name}</a>

    return <poptip placement="left-start" trigger="hover" transfer>
        {$icon}
        {$name}
        {$image}
    </poptip>
}

const renderAction = function (h, params) {
    let { row } = params
    let { status } = row
    // 准备状态为2 个按钮 开始，删除
    let $remove = <i-button type="text" size="small" icon="md-close" class="mr-2" title="删除图片" onClick={() => this.$handleRemoveFileList(params)}/>
    let dom
    switch (status) {
    case FileStatus.READY: {
        let $play = <i-button type="text" size="small" icon="md-play" class="mr-2" title="开始上传" onClick={() => this.$handleFileStartUpload(params)}/> // ()=>this.$emit('file-start-upload', params)
        dom = [$play, $remove]
        break
    }
    case FileStatus.SUCCESS: {
        dom = [$remove]
        break
    }
    case FileStatus.UPLOADING: { // 上传中 显示进度 以及取消上传 暂时不支持暂停上传（断点续传）
        // percentage
        // let $cancel =
        dom = [<i-button type="text" size="small" icon="md-pause" class="mr-2" title="终止上传"
                         onClick={() => this.$handleCancelUpload(params)}/>] // () => this.$emit('file-uploading-cancel', params)
        break
    }
    case FileStatus.FAIL: { // 上传失败 显示 重试与删除
        let $retry = <i-button type="text" size="small" icon="md-refresh" class="mr-2" title="重试"
                               onClick={() => this.$handleFailRefresh(params)}/>
        dom = [$retry, $remove]
        break
    }
    default :
        dom = null
    }
    return dom
}

const renderStatus = function (h, params) {
    let { row } = params
    let { status } = row
    // let statusDom = h('span', FileStatusText[status])
    return <span class="file-status">{FileStatusText[status]}</span>
}

const renderSpace = function (h, { row }) {
    let { space } = row
    // console.log(store.getters.imgSpaces)
    // console.log(row)  onOn-change={()=>}
    if (row._editSpace) {
        // <Option v-for="(v, k) in " value={k} key={k}>{{ v }}</Option>

        return [<i-select style="width:60px" placeholder="选择图片空间" value={space} size="small" onInput={(v) => this.$handleChangeFileSpace(row, v)}>
            {Object.keys(store.getters.imgSpaces).map((k) => <i-option value={k}>{store.getters.imgSpaces[k]}</i-option>)}
        </i-select>]
    } else {
        let editSpaceBtn = <font-icon type="ios-create-outline" size="20" onClick={ () => (row._editSpace = true) }/>
        return [<span class="table-file-space">{store.getters.imgSpaces[space]}</span>, editSpaceBtn]
    }
}

const renderFileSize = function (h, { row }) {
    if (!row.file) {
        return <span>-</span>
    }
    return <span class="table-file-size">{formatFileSize(row.size)}</span>
}

const UploadComponentsStatus = {
    'FULFIL': 'fulfil',
    'READY': 'ready',
    'UPLOADING': 'uploading',
    'FINISH_ERROR': 'finish-error',
    'ERROR': 'error'
}

const FileStatus = {
    UPLOADING: '0_uploading',
    READY: '1_ready',
    ERROR: '2_error',
    FAIL: '3_fail',
    QUEUE: '4_queue',
    SUCCESS: '5_success'
}

const FileStatusText = {
    [FileStatus.UPLOADING]: '上传中',
    [FileStatus.READY]: '准备',
    [FileStatus.ERROR]: '错误',
    [FileStatus.FAIL]: '上传失败',
    [FileStatus.QUEUE]: '等待中',
    [FileStatus.SUCCESS]: '完成'
}

export default {
    name: 'upload',
    data: function () {
        return {
            visible: false,
            contentVisible: false,
            alertVisible: false,
            fileList: [],
            tempIndex: 1,
            maxSize: 1073741824, // 1G  单位b
            format: [], // 支持的文件类型，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用
            options: {
                headers: {},
                action: 'https://up-z2.qiniup.com',
                token: '', // api or token
                inputName: 'file',
                data: {}, // 上传时附带的额外参数,
                onSuccess: () => {
                }
            },
            columns4: [
                { title: '文件(夹)名', key: 'name', render: renderFileName.bind(this) },
                { title: '大小', key: 'size', width: 90, render: renderFileSize.bind(this) },
                // 需要获取当前所在目录
                { title: '位置', key: 'uploader', width: 100, render: renderSpace.bind(this) },
                { title: '状态', key: 'status', width: 80, render: renderStatus.bind(this) },
                { title: ' ', key: 'renderAction', width: 95, render: renderAction.bind(this) }
            ],
            // 是否自动上传
            autoUpload: true,
            // 是否开启队列模式
            queueMode: true,
            queueLength: 3,
            bigQueueLimit: 50, // 是否是大队列的阈值
            reqs: {},
            showLimit: 10, // 点击查看更多的时候增加显示多少，
            viewNum: 0 // 当队列是大队列的时候，多显示多少
        }
    },
    components: {
        CollapseTransition
    },
    computed: {
        sizeIcon: function () {
            // ios-arrow-down
            return this.contentVisible ? 'ios-arrow-down' : 'ios-arrow-up'
        },
        title: function () {
            let str
            let statusAudit = this.currFileListStatusAudit
            let length = this.fileList.length
            switch (this.currStatus) {
            case UploadComponentsStatus.READY:
                str = '准备上传'
                break
            case UploadComponentsStatus.UPLOADING:
                str = `上传中 (${statusAudit[FileStatus.SUCCESS]}/${length})`
                break
            case UploadComponentsStatus.FINISH_ERROR:
                str = `上传成功, 但是有错误 (${statusAudit[FileStatus.FAIL]}/${length})`
                break
            case UploadComponentsStatus.ERROR:
                str = '上传失败'
                break
            case UploadComponentsStatus.FULFIL:
            default:
                str = '上传完成'
            }
            return str
        },
        currFileListStatusAudit: function () {
            let statusAudit = {}
            this.fileList.forEach((item) => {
                statusAudit[item.status] = (statusAudit[item.status] || 0) + 1
            })
            return statusAudit
        },
        currStatus: function () {
            // 当前状态的判定：
            // 队列为空                     状态：finish
            // 队列中有在上传的文件          状态：uploading
            // 队列中全是准备状态文件的时候   状态：ready
            // 队列中全部上传完成            状态：finish
            // 队列中全部上传完成，但是有错误 状态：finish-error
            // 队列中全是错误                状态：error
            // -- 暂停状态暂时没有
            let length = this.fileList.length
            if (length === 0) { // 队列为空
                return UploadComponentsStatus.FULFIL
            }
            let statusAudit = this.currFileListStatusAudit

            if (statusAudit[FileStatus.FAIL] === length) { // 队列中全是错误
                return UploadComponentsStatus.ERROR
            } else if (statusAudit[FileStatus.SUCCESS] === length) { // 队列中全部上传完成
                return UploadComponentsStatus.FULFIL
            } else if (statusAudit[FileStatus.READY] === length) { // 队列中全是准备状态文件的时候
                return UploadComponentsStatus.READY
            } else if (statusAudit[FileStatus.UPLOADING] > 0 || statusAudit[FileStatus.QUEUE] > 0) { // 队列中有在上传的文件 以及队列中包含有任务队列中的数据
                return UploadComponentsStatus.UPLOADING
            } else if (statusAudit[FileStatus.FAIL] > 0 && (statusAudit[FileStatus.FAIL] + statusAudit[FileStatus.SUCCESS]) === length) { // 队列中全部上传完成，但是有错误
                return UploadComponentsStatus.UPLOADING
            }
            // 默认状态
            return UploadComponentsStatus.FULFIL
        },
        showFiles: function () {
            let files = this.fileList.slice(0, this.bigQueueLimit + this.viewNum)
            // 排序
            // 按照状态 排序，UPLOADING > READY > ERROR > FAIL > QUEUE >SUCCESS
            return orderBy(files, ['status', 'name'], ['asc', 'asc'])
        },
        isBigQueue: function () {
            return this.fileList.length > this.bigQueueLimit
        }
    },
    watch: {
        currStatus: function (val) {
            // let statusAudit = this.currFileListStatusAudit
            if (val) {
                if (!this.visible) this.visible = true
                if (this.fileList.length) this.contentVisible = true
                switch (this.currStatus) {
                case UploadComponentsStatus.READY:
                    break
                case UploadComponentsStatus.UPLOADING:
                    break
                case UploadComponentsStatus.FINISH_ERROR:
                    break
                case UploadComponentsStatus.ERROR:
                    break
                case UploadComponentsStatus.FULFIL:
                default:
                    this.$emit('upload-fulfil')
                    this.contentVisible = false
                    // let length = this.fileList.length
                    this.alertVisible = '上传成功！'
                    // this.$Notice.close('upload-notice')
                    // this.$Notice.success({
                    //     title: `上传完成`,
                    //     name: 'upload-notice',
                    //     duration: 5,
                    //     render: (h) => {
                    //         return h('ul', {domProps: {className: 'upload-notice-list'}}, [
                    //             h('li', `共计上传：${length}`),
                    //             h('li', `成功上传：${statusAudit[FileStatus.SUCCESS] || '无'}`),
                    //             h('li', `失败文件：${statusAudit[FileStatus.FAIL] || '无'}`),
                    //             h('li', `拒绝上传：0`)
                    //         ])
                    //     }
                    // })
                }
            }
        }
    },
    methods: {
        submit () {
            // 开始上传文件 开始全部
        },
        showMore () {
            // 显示更多项
            if (this.isBigQueue) {
                this.viewNum += this.showLimit
            }
        },
        handleStart (rawFile, space = 'all') {
            rawFile.uid = Date.now() + this.tempIndex++

            let index1 = rawFile.name.lastIndexOf('.')
            let index2 = rawFile.name.length
            let ext = rawFile.name.substring(index1 + 1, index2) // 后缀名
            // console.log(rawFile)
            let _file = {
                status: FileStatus.READY,
                space,
                // serial_id: rawFile.serial_id,
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                file: true,
                ext: ext,
                uid: rawFile.uid,
                showProgress: true,
                raw: rawFile,
                _editSpace: false
            }
            this.fileList.push(_file)
        },

        uploadFiles: function (files, opts = {}) {
            let { space } = opts
            // 队列的最大值不限制， 但是限制同上上传的格式

            if (!isArray(files)) {
                files = [files]
                // let postFiles = Array.prototype.slice.call(files)
            }
            if (files.length === 0) return
            // 如果上传的是数组，清空当前列表
            // 并且数量将超出最大限制的时候，清空列表中成功的文件
            // this.fileList
            if (this.fileList.length + files.length > this.bigQueueLimit) {
                let successFiles = this.fileList.filter(item => item.status === FileStatus.SUCCESS)
                this.fileList = differenceBy(this.fileList, successFiles, 'uid')
            }
            // 提交一个数组 作为一个批次
            // 生成随机key
            const handleFileItem = (rawFile) => {
                rawFile.serial_id = randomChar(16)
                if (!rawFile.miniurl) {
                    let fr = new FileReader()
                    fr.onload = (oFREvent) => {
                        rawFile.miniurl = oFREvent.target.result
                        this.handleStart(rawFile, space)
                        if (this.autoUpload) {
                            this.upload(rawFile, opts)
                        }
                    }
                    fr.readAsDataURL(rawFile)
                } else {
                    this.handleStart(rawFile, space)
                    if (this.autoUpload) {
                        this.upload(rawFile, opts)
                    }
                }
            }
            files.forEach(handleFileItem)
        },
        // 取消上传， 如果不传参数则取消全部
        abort (file) {
            let { reqs } = this
            if (file) {
                let uid = file
                if (file.uid) uid = file.uid
                if (reqs[uid]) {
                    reqs[uid].abort()
                }
            } else {
                Object.keys(reqs).forEach((uid) => {
                    if (reqs[uid]) reqs[uid].abort()
                    delete reqs[uid]
                })
            }
        },
        beforeUpload: function () { // file
            //
            // file
            // 队列上传控制 验证 秒传
            // 手动上传
            // this.data.fullPath = file.fullPath || file.webkitRelativePath
            return true
        },

        upload (rawFile, opts = {}) {
            opts = Object.assign({}, cloneDeep(this.options), opts)
            opts.rawFile = rawFile
            this.post(opts)
            // const before = this.beforeUpload(rawFile)
            // if (before && before.then) {
            //     before.then(processedFile => {
            //         const fileType = Object.prototype.toString.call(processedFile)
            //         if (fileType === '[object File]') {
            //             this.post(processedFile)
            //         } else {
            //             this.post(rawFile)
            //         }
            //     }, () => {
            //         this.handleRemove(null, rawFile)
            //     })
            // } else if (before !== false) {
            //     this.post(rawFile)
            // } else {
            //     // 手动控制文件上传
            //     this.handleRemove(null, rawFile)
            // }
        },
        post: function (opts) {
            // 添加到队列中，
            // 检查是否是队列模式
            if (this.queueMode) {
                // let queueList = this.queueList
                // let queueMaxLength = this.queueLength
                let { rawFile } = opts
                let file = this.getFile(rawFile)
                file.status = FileStatus.QUEUE
                const cb = (resolve) => {
                    // setTimeout(resolve, 1500)
                    this._post(opts, resolve)
                }
                const task = new Task()

                Object.defineProperty(task, 'start', {
                    value: cb.bind(this)
                })
                this.$queue.addTask(task)
                // this.$queue.
            } else {
                this._post(opts)
            }
        },
        _post: function (opts, resolve) {
            let { rawFile, data, headers, inputName, action, onSuccess, onError, token } = opts
            const { uid } = rawFile
            // const req = this.httpRequest(options);
            if (this.format.length) {
                const fileFormat = rawFile.name.split('.').pop().toLocaleLowerCase()
                const checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat)
                if (!checked) {
                    this.onFormatError(rawFile, this.fileList)
                    return false
                }
            }
            // check maxSize
            if (this.maxSize) {
                console.log('rawfile.size = [%s] this.masSize = [%s]', rawFile.size, this.maxSize)
                if (rawFile.size > this.maxSize * 1024) {
                    this.onExceededSize(rawFile, this.fileList)
                    return false
                }
            }

            let isBase64 = rawFile.isBase64
            if (!isBase64) {
                data.token = token
                data['x:name'] = rawFile.name
            }

            let options = {
                data,
                headers,
                isBase64,
                file: isBase64 ? rawFile.miniurl : rawFile,
                filename: inputName,
                action: action,
                onProgress: e => {
                    this.handleProgress(e, rawFile)
                },
                onSuccess: res => {
                    if (resolve) {
                        resolve()
                    }
                    this.handleSuccess(res, rawFile)
                    if (isFunction(onSuccess)) {
                        onSuccess(res)
                    }
                    delete this.reqs[uid]
                },
                onError: err => {
                    this.handleError(err, rawFile)
                    if (isFunction(onError)) {
                        onError(err)
                    }
                }
            }
            this.reqs[uid] = ajax(options)
        },
        onFormatError: function (...a) {
            console.log('onFormatError', a)
        },
        onExceededSize: function (...a) {
            console.log('onExceededSize', a)
        },
        handleProgress: function (ev, rawFile) {
            const file = this.getFile(rawFile)
            // this.onProgress(ev, file, this.uploadFiles);
            file.status = FileStatus.UPLOADING
            file.percentage = ev.percent || 0
        },
        handleSuccess: function (res, rawFile) {
            const file = this.getFile(rawFile)
            if (file) {
                file.status = FileStatus.SUCCESS
                Object.assign(file, res.data)
                file.response = res
                // this.onSuccess(res, file, this.uploadFiles);
                // this.onChange(file, this.uploadFiles);
            }
        },
        handleError: function (e, rawFile) {
            const file = this.getFile(rawFile)
            // const fileList = this.fileList
            file.status = FileStatus.FAIL
            // fileList.splice(fileList.indexOf(file), 1);
            // this.onError(err, file, this.uploadFiles);
            // this.onChange(file, this.uploadFiles);
        },
        handleRemove (...a) {
            console.log('handleRemove', a)
            // const fileList = this.fileList
            // fileList.splice(fileList.indexOf(file), 1)
            // this.handleRemove(file, fileList)
        },
        handlePreview (file) {
            if (file.status === 'finished') {
                this.onPreview(file)
            }
        },
        clearFiles () {
            this.fileList = []
        },
        getFile (rawFile) {
            let fileList = this.fileList
            let target
            fileList.every(item => {
                target = rawFile.uid === item.uid ? item : null
                return !target
            })
            return target
        },
        async $handleRemoveFileList ({ row, index }) {
            try {
                await media.deleteImg(row.key)
                this.fileList.splice(index, 1)
                this.alertVisible = '删除成功！'
            } catch (e) {
                this.alertVisible = '删除失败！'
            }

            this.$emit('file-item-remove', row, index)
        },
        $handleFileStartUpload ({ row, index }) {
            console.log('方法未实现')
            this.$emit('file-item-start-upload', row, index)
        },
        $handleCancelUpload ({ row, index }) {
            console.log('方法未实现')
            this.$emit('file-item-cancel-upload', row, index)
        },
        $handleFailRefresh ({ row, index }) {
            console.log('方法未实现')
            this.$emit('file-item-refresh-upload', row, index)
        },
        async $handleChangeFileSpace (row, space) {
            try {
                await media.move(row.key, space)
                this.alertVisible = '移动成功！'
                row.space = space
            } catch (e) {
                this.alertVisible = '移动失败！'
            } finally {
                row._editSpace = false
            }
        }
    },
    mounted () {
        if (this.queueMode) {
            this.$queue = new Queue(this.queueLength)
        }
    }
}
</script>
