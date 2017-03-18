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
                            <table class="am-table am-table-compact am-table-striped tpl-table-black imgListTable">
                                <thead>
                                    <tr>
                                        <th>预览</th>
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
                                                <a  href="javascript:;" data-am-modal="{target: '#doc-modal-1', closeViaDimmer: 1}" @click="view(item.key)">
                                                    <i class="am-icon-eye"></i>
                                                </a>
                                                <!--  @click="copy($event,item.key)" -->
                                                <a ref="copy" class="copy-list" :data-clipboard-text="domain + item.key">
                                                    <i class="am-icon-copy"></i>
                                                </a>
                                                <a ref="copyMd" class="copy-list-md" :data-clipboard-text="'![](' + domain + item.key + ')'">
                                                    markdown
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
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                      <img :src="src" class="am-img-thumbnail am-radius am-vertical-align" alt=""/>
                </div>
                <div class="am-modal-footer">
                 <span class="am-modal-btn" data-am-modal-close>确定</span>
               </div>
              </div>
            </div>
        </div>

    </div>
</template>
<style lang='less' scoped>
    // #doc-modal-1 {
    //     // img{
    //     //     max-height: 430px;
    //     //     margin: 0 auto;
    //     // }
    // }
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
            'contentHeight'
        ]),
        imgContent(){
            let height = this.contentHeight;
            height -= 56;
            return {
                height:`${height}px`
            }
        },
        bdContent(){
            let height = this.contentHeight;
            height -= (48+44+56);
            return {
                height:`${height}px`
            }
        }
    },
    methods: {
        ...mapActions([
            'mergeSite'
        ]),
        ...mapMutations([
        ]),
        formatFileSize,
        formatDate(_time){
            let time = new Date(_time/10000);
            return time.format('yyyy/MM/dd hh:mm');
        },
        async del(key,index){
            $('.imgListTable [data-am-dropdown]').dropdown('close')
            let data = await api.delImg(key);
            layer.msg(data.msg);
            if(data.code==0){
                this.imgList.splice(index,1)
            }
        },
        view(key){
            $("#doc-modal-1").focus();
            this.src=this.domain+key;
        },
        async setSite(key,url){
            let params = {
                [key]:this.domain+url
            }
            let data = await api.updataSiteInfo(params);
            layer.msg(data.msg);
            if(data.code==0)
                this.mergeSite(params)
        }
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
            $('.imgListTable [data-am-dropdown]').dropdown()
        })
    }
}
</script>
