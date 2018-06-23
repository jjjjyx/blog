<template>
    <div class="post-writer-content">
        <div class="post-body-content">
            <div class="post-title-wrap">
                <input type="text" class="title" v-bind:value="'一个标题'">
                <!--<div class="post-title-options table-buttons">-->
                    <!--<tooltip content="标签">-->
                        <!--<i-button type="text" icon="pricetags" @click="tagWrapShow = !tagWrapShow"></i-button>-->
                    <!--</tooltip>-->
                    <!--<tooltip content="附件">-->
                        <!--<i-button type="text">-->
                            <!--<i class="iconfont icon-fujian"></i>-->
                        <!--</i-button>-->
                    <!--</tooltip>-->
                    <!--<tooltip content="笔记历史">-->
                        <!--<i-button type="text" icon="merge"></i-button>-->
                    <!--</tooltip>-->
                <!--</div>-->
            </div>
            <collapse-transition>
                <!--v-show="tagWrapShow"-->
            <div class="post-tag-wrap" >
                <span class="align-middle mr-2">标签</span>
                <Poptip placement="bottom-start" width="400" transfer>
                    <Button icon="ios-plus-empty" type="dashed" size="small" ></Button>
                    <div class="post-tag-list" slot="content">
                        222
                    </div>
                </Poptip>
                <Tag v-for="item in count" :key="item" :name="item" closable @on-close="handleClose2">标签{{ item + 1 }}</Tag>
                <input class="input-tag" autocomplete="off" tabindex="0" type="text" ref="tagInput" v-model="newTagValue" placeholder="点击此处添加标签" @keyup.enter="addTag">
            </div>
            </collapse-transition>
            <div class="post-markdown-wrap">
                <!--<span class="saving-notice">未保存</span>-->
                <mavon-editor style="height: 100%" :value="value" ref="md" @imgAdd="uploadImg" @imgDel="imgDel"></mavon-editor>
            </div>
        </div>
        <div class="postbox-container">
            <draggable :list="sidebarsOrder" class="dragArea">
                <transition-group type="transition" :name="'flip-list'">
                    <sidebar-panel v-for="sidebar in sidebarsOrder" :key="sidebar" class="postbox">
                        <template slot="title">{{$options.components[sidebar].title}}</template>
                        <components :is="sidebar"></components>
                    </sidebar-panel>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>

import SparkMD5 from 'spark-md5'
import draggable from 'vuedraggable'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import api from '@/utils/api'
import ajax from '@/utils/ajax'
import CollapseTransition from '@/utils/collapse-transition'
import sidebars from './sidebar'
import sidebarPanel from './sidebar/sidebar.vue'
// import {on} from '@/utils/dom'

const sidebarsOrder = Object.keys(sidebars)
// tmp
const value = `
# 怎么写一篇文章

我写

我演示一个列表
* a
* v
* c

|column1|column2|column3|
|-|-|-|
|aa|vv|cc|


> asdas

\`\`\`java
public void test(){
System.out.println('test');
}
\`\`\`
`

const verification = function (name) {
    let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/
    let result = reg.test(name)
    // if(!result)
    //     layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
    return result
}

function fileMd5 (file) {
    return new Promise((resolve, reject) => {
        // let file = file_blob.file;
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlicelet
        // 截取部分数据
        let chunkSize = 1024 * 128 // Read in chunks of 1M
        let spark = new SparkMD5.ArrayBuffer()
        let fileReader = new FileReader()
        fileReader.onload = function (e) {
            spark.append(e.target.result) // Append array buffer\
            let md5 = spark.end()
            console.log('md5', md5)
            resolve(md5)
        }
        fileReader.onerror = function () {
            console.warn('oops, something went wrong.')
            reject(new Error('oops, something went wrong.'))
        }
        fileReader.readAsArrayBuffer(blobSlice.call(file, 0, chunkSize))
    })
}

export default {
    name: 'post-writer',
    data () {
        return {
            tagWrapShow: false,
            newTagValue: '',
            value,
            count: [0, 1, 2],
            sidebarsOrder
        }
    },
    components: {
        mavonEditor,
        draggable,
        CollapseTransition,
        sidebarPanel,
        ...sidebars
    },
    methods: {
        addTag () {
            // let r = this.tagList.find((item)=>item.name==this.text);
            // 添加标签，添加的标签只是暂时存放，在未保存文章前不会保存到数据库
            if (!verification(this.newTagValue)) {
                this.$Message.info('请提交正确的标签名称，且名称只能包含中文英文，下划线，数字,且在长度不超过8！')
            } else {
                console.debug('添加标签', this.newTagValue)
            }
            this.newTagValue = ''
        },
        qiniuUpload: function (file) {
            return new Promise(async (resolve, reject) => {
                try {
                    let md5 = await fileMd5(file)
                    let tokenParam = {md5, name: file.name, ext: file.type}
                    let result = await api.nget('/api/img/token', tokenParam)
                    if (result.code !== 0) {
                        return reject(new Error('获取上传凭证失败！'))
                    }
                    let {token, domain} = result.data
                    let url = `http://up-z2.qiniu.com/putb64/${file.size}`

                    ajax({
                        headers: {
                            'Authorization': `UpToken ${token}`,
                            'Content-Type': 'application/octet-stream'
                        },
                        isBase64: true,
                        file: file.miniurl,
                        action: url,
                        onProgress: e => {
                            // 文章图片都是小图片 ，不允许上传太大的 超过2M 的
                            console.log('onProgress', e)
                            // this.handleProgress(e, file)
                        },
                        onSuccess: res => {
                            // this.handleSuccess(res, file)
                            let hash = res.key
                            resolve(domain + hash)
                        },
                        onError: (err, response) => {
                            // this.handleError(err, response, file)
                            // console.log('onError', err, response)
                            reject(err)
                        }
                    })
                } catch (e) {
                    return reject(e)
                }
            })
        },
        async uploadImg (pos, file) {
            // console.log(pos, file)
            let failCall = (msg) => {
                // 给出提示信息，
                this.$Message.info(msg)

                let imgList = this.$refs.md.$refs.toolbar_left.img_file
                let index = imgList.findIndex((img) => {
                    return img[1] === pos
                })
                // 解决连续删除错误的问题
                // 删除图片
                let delImg = imgList.splice(index, 1)[0]
                this.$refs.md.$refs.toolbar_left.$emit('imgDel', delImg)
                // this.$refs.md.$refs.toolbar_left.s_img_dropdown_open = false
            }
            try {
                let result = await this.qiniuUpload(file)
                // console.log('上传成功', result)
                file.url = result
                this.$refs.md.$img2Url(pos, result)
            } catch (e) {
                // 上传失败
                failCall(e.message)
            }
        },
        imgDel (file) {
            console.log('del img', file)
        },
        handleClose2 (event, name) {
            const index = this.count.indexOf(name)
            this.count.splice(index, 1)
        }
    },
    mounted () {
        console.log(this.$refs.md)
        // let vNoteTextarea = this.$refs.md.$refs.vNoteTextarea;
        // let vTextarea = vNoteTextarea.$refs.vTextarea;
        // console.log(vTextarea)
        // // this.$nextTick(()=>{
        // //
        // // })
        // on(vTextarea,'paste', async function (e) {
        //     var clipboardData = e.clipboardData;
        //     if (clipboardData) {
        //         for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        //             let item = e.clipboardData.items[i];
        //             if (item.kind === "file" && item.type == 'image/png') {
        //                 let pasteFile = item.getAsFile();
        //                 console.log(pasteFile)
        //                 // self.qiniuUpload(pasteFile,(key,domain)=>{
        //                 //     let img = `![](${domain}${key})\n`;
        //                 //     self.editormd.insertValue(img);
        //                 // })
        //             }
        //         }
        //     }
        // })
    }
}
</script>
