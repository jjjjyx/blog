<template>
<div class="row-content am-cf" id="file-drop">
    <div class="row">
        <div class="am-u-sm-12 am-u-md-12 am-u-lg-12">
            <div class="widget am-cf">
                <div class="widget-head am-cf">
                    <div class="widget-title  am-cf">
                        上传列表2
                    </div>
                </div>
                <div class="widget-body  am-fr">
                    <div class="am-u-sm-12 am-u-md-6 am-u-lg-6">
                        <div class="am-form-group">
                            <div class="am-btn-toolbar">
                                <div class="am-btn-group am-btn-group-xs">
                                    <button type="button" class="am-btn am-btn-default am-btn-success" id="pickfiles"><span class="am-icon-plus"></span> </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="am-u-sm-12 am-u-md-6 am-u-lg-3">
                        <div class="am-form-group tpl-table-list-select">
                            <!-- <select name="category" id="category" >
                                    <option :value="item.term_id" v-for="item in categoryList">{{item.name}}</option>
                                </select> -->
                        </div>
                    </div>
                    <div class="am-u-sm-12 am-u-md-12 am-u-lg-3">
                        <div class="am-input-group am-input-group-sm tpl-form-border-form cl-p">
                            <input type="text" class="am-form-field ">
                            <span class="am-input-group-btn">
                                    <button class="am-btn  am-btn-default am-btn-success tpl-table-list-field am-icon-search" type="button"></button>

                                 </span>
                        </div>
                    </div>
                    <div class="am-u-sm-12">
                        <ul data-am-widget="gallery" class="am-gallery am-avg-sm-7 am-gallery-imgbordered" data-am-gallery="{pureview: true}" id="abcd">
                            <li v-for="(item,index) in imgList">
                                <div class="am-gallery-item">
                                    <div style="" class="j-img-p">
                                        <img :src="domain+item.key+'?imageView2/1/w/200/h/200'" :alt="item.key" :data-rel="domain+item.key" />
                                    </div>
                                    <h3 class="am-gallery-title">{{item.key}}</h3>
                                    <div class="am-gallery-desc">
                                        <i class="am-icon-cube"></i> {{formatFileSize(item.fsize)}}&nbsp;
                                        <i class="am-icon-clock-o"></i> {{formatDate(item.putTime)}}
                                    </div>
                                    <div class="j-img-opt am-text-center tpl-table-black-operation">
                                        <a ref="copy" class="copy-list" :data-clipboard-text="domain + item.key">
                                            <i class="am-icon-copy"></i>
                                        </a>
                                        <a ref="copyMd" class="copy-list-md" :data-clipboard-text="'!['+item.key+'](' + domain + item.key + ')'">
                                            <i class="am-icon-maxcdn"></i>
                                        </a>
                                        <div class="am-dropdown" data-am-dropdown >
                                          <i class="am-icon-cog am-dropdown-toggle"  data-am-dropdown-toggle></i>
                                          <ul class="am-dropdown-content am-text-xs">
                                            <li><a >设置用户头像</a></li>
                                            <li class="am-divider"></li>
                                            <li><a @click="setSite('avatar',item.key)">设置为首页头像</a></li>
                                            <li><a @click="setSite('background',item.key)">设置首页背景</a></li>
                                            <li>
                                                <a @click='del(item.key,index)' class="tpl-table-black-operation-del am-text-danger">
                                                    <i class="am-icon-trash"></i> 删除
                                                </a>
                                            </li>
                                          </ul>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="am-u-lg-12 am-text-center" v-if="next">
                        <button class="am-btn am-round gray btn-bordered am-btn-sm" @click="getImgList(next)">
                                <i class="am-icon-spinner am-icon-spin am-text-xs" v-if="loading"></i> {{loading?'loading...':'加载更多'}}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="am-modal img-view" tabindex="-1" id="doc-modal-1">
            <div class="am-modal-dialog" :style="imgContent">
                <div class="am-modal-hd">图片查看
                    <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
                </div>
                <div class="am-modal-bd am-vertical-align" :style="bdContent">
                    <img :src="src" class="am-img-thumbnail am-radius am-vertical-align" alt="" />
                </div>
                <div class="am-modal-footer">
                    <span class="am-modal-btn" data-am-modal-close>确定</span>
                </div>
            </div>
        </div>
    </div>

</div>
</template>
<script>
// import
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex'
import * as api from "public/js/netapi.js";
import {
    formatFileSize
} from "public/js/tools.js"
export default {
    data: function() {
        return {
            imgList: [],
            domain: '',
            src: "",
            last: '',
            next: '',
            loading: false
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'contentHeight'
        ]),
        imgContent() {
            let height = this.contentHeight;
            height -= 56;
            return {
                height: `${height}px`
            }
        },
        bdContent() {
            let height = this.contentHeight;
            height -= (48 + 44 + 56);
            return {
                height: `${height}px`
            }
        }
    },
    methods: {
        ...mapActions([
            'mergeSite'
        ]),
        ...mapMutations([]),
        formatFileSize,
        formatDate(_time) {
            let time = new Date(_time / 10000);
            return time.format('yyyy/MM/dd hh:mm');
        },
        async del(key, index) {
            $('.imgListTable [data-am-dropdown]').dropdown('close')
            let data = await api.delImg(key);
            layer.msg(data.msg);
            if (data.code == 0) {
                this.imgList.splice(index, 1)
            }
        },
        fileInput() {

        },
        view(key) {
            $("#doc-modal-1").focus();
            this.src = this.domain + key;
        },
        async setSite(key, url) {
            let params = {
                [key]: this.domain + url
            }
            let data = await api.updataSiteInfo(params);
            layer.msg(data.msg);
            if (data.code == 0)
                this.mergeSite(params)
        },
        async getImgList(marker) {
            this.loading = true
            let data = await api.getImgs({
                marker
            });
            this.imgList = this.imgList.concat(data.data);
            this.domain = data.domain;
            this.next = data.next;
            let fn = () => {
                layer.msg('复制成功')
            }
            this.$nextTick(() => {
                $("#abcd").pureview();
                let clib = new ZeroClipboard(this.$refs.copy),
                    clib2 = new ZeroClipboard(this.$refs.copyMd);
                clib.on('aftercopy', fn);
                clib2.on('aftercopy', fn);
                $('.j-img-opt [data-am-dropdown]').dropdown();

            });
            this.loading = false
        }
    },
    mounted: async function() {
        // console.log(this.$route)
        $('#category').selected({
            btnSize: 'sm'
        });
        this.getImgList();
        // let clib = null;

        Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            // container: 'container',
            drop_element: 'file-drop',
            max_file_size: '1000mb',
            flash_swf_url: '/Moxie.swf',
            unique_names: true,
            dragdrop: true,
            chunk_size: '4mb',
            uptoken_url: "/api/img/token",
            domain: "http://oht47c0d0.bkt.clouddn.com/",
            get_new_uptoken: false,
            auto_start: true,
            log_level: 5,
            init: {
                'FilesAdded': function(up, files) {
                    // $('table').show();
                    // $('#success').hide();
                    // plupload.each(files, function(file) {
                    //     var progress = new FileProgress(file, 'fsUploadProgress');
                    //     progress.setStatus("绛夊緟...");
                    //     progress.bindUploadCancel(up);
                    // });
                    console.log(111);
                },
                'BeforeUpload': function(up, file) {},
                'UploadProgress': function(up, file) {},
                'UploadComplete': function() {},
                'FileUploaded': function(up, file, info) {
                    console.log(info, file);
                    let imageInfoObj = Qiniu.imageInfo(info.key);
                    console.log(imageInfoObj)
                },
                'Error': function(up, err, errTip) {
                    console.log(errTip);
                },
                // 'Key': function(up, file) {
                //     var key = "123123";
                //     // do something with key
                //     return key
                // }
            }
        });

    }
}
</script>
