<template>
    <div class="row-content am-cf">
        <div class="row">
            <div class="am-u-sm-12 am-u-md-12 am-u-lg-12">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title  am-cf">
                            上传列表
                        </div>
                    </div>
                    <div class="widget-body  am-fr">
                        <div class="am-u-sm-12 am-u-md-6 am-u-lg-6">
                            <div class="am-form-group">
                                <div class="am-btn-toolbar">
                                    <div class="am-btn-group am-btn-group-xs">
                                        <button type="button" class="am-btn am-btn-default am-btn-success"><span class="am-icon-plus"></span> </button>
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
                            <table class="am-table am-table-compact am-table-striped tpl-table-black ">
                                <thead>
                                    <tr>
                                        <th>文件名</th>
                                        <th>文件类型</th>
                                        <th>文件大小</th>
                                        <th>最后更新</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in imgList">
                                        <td :title="item.key"><img :src="domain+item.key+'?imageView2/2/w/100'" class="tpl-table-line-img" alt=""></td>
                                        <td class="am-text-middle" >{{item.mimeType}}</td>
                                        <td class="am-text-middle">{{formatFileSize(item.fsize)}}</td>
                                        <td class="am-text-middle">{{formatDate(item.putTime)}}</td>
                                        <td class="am-text-middle">
                                            <div class="tpl-table-black-operation">
                                                <a href="javascript:;" data-am-modal="{target: '#doc-modal-1', closeViaDimmer: 1}" @click="view(item.key)">
                                                    <i class="am-icon-eye"></i>
                                                </a>
                                                <!--  @click="copy($event,item.key)" -->
                                                <a ref="copy" class="copy-list" :data-clipboard-text="domain + item.key">
                                                    <i class="am-icon-copy"></i>
                                                </a>
                                                <a ref="copyMd" class="copy-list-md" :data-clipboard-text="'![](' + domain + item.key + ')'">
                                                    markdown
                                                </a>
                                                <a @click='del(item.key,index)' class="tpl-table-black-operation-del">
                                                    <i class="am-icon-trash"></i> 删除
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="am-modal am-modal-no-btn" tabindex="-1" id="doc-modal-1">
              <div class="am-modal-dialog" style="width: 80%;height: 80%;min-height: 500px;">
                <div class="am-modal-hd">图片查看
                  <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
                </div>
                <div class="am-modal-bd">
                      <img :src="src" class="am-img-responsive am-img-thumbnail am-radius" alt=""/>
                </div>
              </div>
            </div>
        </div>

    </div>
</template>
<style lang='less' scoped>
    #doc-modal-1 {
        img{
            max-height: 430px;
            margin: 0 auto;
        }
    }
</style>
<script>
// import
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
import {formatFileSize} from "../../../../public/js/tools.js"
export default {
    data: function() {
        return {
            imgList:[],
            domain:'',
            src:"",
        }
    },
    components: {},
    computed: {
        ...mapGetters([
        ]),
    },
    methods: {
        ...mapMutations([
        ]),
        formatFileSize,
        formatDate(_time){
            let time = new Date(_time/10000);
            return time.format('yyyy/MM/dd hh:mm');
        },
        async del(key,index){
            let data = await api.delImg(key);
            layer.msg(data.msg);
            if(data.code==0){
                this.imgList.splice(index,1)
            }
        },
        view(key){
            this.src=this.domain+key;
        },
    },
    mounted:async function() {
        // console.log(this.$route)
        $('#category').selected({btnSize: 'sm'});
        let data = await api.getImgs();
        this.imgList = data.data;
        this.domain=data.domain;
        // let clib = null;
        let fn = ()=>{
            layer.msg('复制成功')
        }
        this.$nextTick(()=>{
            let clib  = new ZeroClipboard(this.$refs.copy),
                clib2 = new ZeroClipboard(this.$refs.copyMd);
                clib.on('aftercopy',fn);
                clib2.on('aftercopy',fn);
        })
    }
}
</script>
