<template>
<div class="cm-container cm-container--flex medium__warp">
    <div class="cm-container--flex__left">
        <!--<div class="medium__img-opt">-->
        <Form ref="formItem" :model="formItem" :rules="ruleInline" inline class="medium__img-opt">
            <div class="ivu-form-item">
                <label class="ivu-form-item-label">目录：</label>
            </div>
            <form-item prop="space">
                <Select v-model="formItem.space" style="width:200px" placeholder="选择图片空间">
                    <Option v-for="(v, k) in imgSpaces" :value="k" :key="k">{{ v }}</Option>
                </Select>
            </form-item>
            <!--<div class="ivu-form-item">-->
                <!--<label class="ivu-form-item-label">尺寸</label>-->
            <!--</div>-->
            <!--<form-item prop="size">-->
            <!--</form-item>-->
            <div class="ivu-form-item">
                <label class="ivu-form-item-label">hash：</label>
            </div>
            <form-item prop="hash">
                <Input v-model="formItem.hash" placeholder="hash"/>
            </form-item>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formItem')">搜索</Button>
            </FormItem>
            <FormItem class="float-right">
                <Button type="primary" @click="handleUpload">上传新图片</Button>
            </FormItem>
        </Form>
        <!--</div>-->
        <div class="medium__img-warp">
            <pre>
                {{data}}
            </pre>
        </div>
    </div>
    <div class="cm-container--flex__modal medium__right">
        <h2 class="ivu-card-head">
            图片信息
        </h2>
    </div>
    <form class="h5-uploader-form" action="javascript:void(0);" @change="handleUploadChange" style="position: absolute; opacity: 0; top: -999px; left: 0; width: 0%; height: 0; cursor: pointer; opacity: 0;">
        <input title="点击选择文件" id="h5Input0" ref="h5Input0" multiple accept="image/*" type="file" name="html5uploader"
               style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;">
    </form>
</div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'
import crud from './crud'
import api from '@/utils/api'
// <!--mapState mapActions-->
export default {
    mixins: [crud],
    name: 'media-management',
    data () {
        return {
            formItem: {
                space: 'all',
                hash: ''
            },
            ruleInline: {},
            idKey: 'hash',
            active: 'img',
            page: 1
        }
    },
    computed: {
        ...mapGetters({
            imgSpaces: 'imgSpaces'
        }),
        ...mapState({
            data: state => state.data.imgList
        })
    },
    methods: {
        ...mapActions({'_fetch': 'fetchMedia'}),
        async fetch () {
            await this._fetch(this.page)
            this.page++
        },
        handleSubmit () {},
        handleUpload: function (name = 'file') {
            // upload.openSelectFile(name)
            // if (name === 'folder') { // 选择文件夹
            //     // this.$Notice.open({
            //     //     title: '通知',
            //     //     desc: '上传文件夹暂时不可用'
            //     // })
            //     this.$refs.h5Input0.setAttribute('webkitdirectory', true)
            //     this.$refs.h5Input0.setAttribute('directory', true)
            //     // return
            // } else {
            //     this.$refs.h5Input0.removeAttribute('webkitdirectory')
            //     this.$refs.h5Input0.removeAttribute('directory')
            // }
            this.$refs.h5Input0.click()
        },
        handleUploadChange: async function (e) {
            const files = e.target.files
            if (!files) {
                return
            }
            let postFiles = Array.prototype.slice.call(files)
            // this.uploadFiles(files);
            let data = {'x:space': this.formItem.space}
            let token = await api.nget('/api/img/token')

            this.$uploadFiles(postFiles, {
                space: this.formItem.space,
                token,
                data,
                onSuccess: (res) => {
                    console.log(res)
                }
            })
            this.$refs.h5Input0.value = null
            // console.log(files)
        },
        cancel () {}
    }
}
</script>
