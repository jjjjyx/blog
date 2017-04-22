<template>
<div class="row-content am-cf">
    <div class="row">
        <div class="am-u-sm-12 am-u-md-12 am-u-lg-12">
            <div class="widget am-cf">
                <div class="widget-head am-cf">
                    <div class="widget-title  am-cf">
                        文章列表
                    </div>
                </div>
                <div class="widget-body  am-fr">
                    <div class="am-u-sm-12 am-u-md-6 am-u-lg-6">
                        <div class="am-form-group">
                            <div class="am-btn-toolbar">
                                <div class="am-btn-group am-btn-group-xs">
                                    <!-- <button type="button" class="am-btn am-btn-default am-btn-success"><span class="am-icon-plus"></span> </button> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="am-u-sm-12 am-u-md-6 am-u-lg-3">
                        <div class="am-form-group tpl-table-list-select">
                            <select name="category" id="category" v-model="filterCategory">
                                    <option value="0" >全部</option>
                                    <option :value="item.term_id" v-for="item in categoryList" class="am-capitalize">{{item.name}}</option>
                                </select>
                        </div>
                    </div>
                    <div class="am-u-sm-12 am-u-md-12 am-u-lg-3">
                        <div class="am-input-group am-input-group-sm tpl-form-border-form cl-p">
                            <input type="text" class="am-form-field " v-model="searchname">
                            <span class="am-input-group-btn">
                                    <button class="am-btn  am-btn-default am-btn-success tpl-table-list-field am-icon-search" type="button"></button>
                                 </span>
                        </div>
                    </div>
                    <div class="am-u-sm-12">
                        <table class="am-table am-table-compact am-table-striped tpl-table-black ">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>标题</th>
                                    <th>类别</th>
                                    <th>作者/创建时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in pageList">
                                    <td>{{item.id}}</td>
                                    <td class="am-text-middle">
                                        <img :src="item.post_img+'?imageView2/1/w/120/h/120'" class="am-fr" v-if="item.post_img"/>
                                        <a class="table-post-title" v-if="item.post_status=='publish'" :href="'/p/'+item.guid" target="_blank">{{item.post_title}}</a>
                                        <p class="table-post-title" v-else>{{item.post_title}}</p>

                                    </td>
                                    <td class="am-text-middle am-capitalize">{{fetchTermName(item.term_id)}}</td>
                                    <td class="am-text-middle">{{item.author}}<br />{{formatDate(item.create_at)}}</td>
                                    <td class="am-text-middle">{{status[item.post_status]}}</td>
                                    <td class="am-text-middle">
                                        <div class="tpl-table-black-operation">
                                            <router-link :to="{path:`/post/category/${item.term_id}/article/${item.id}`}">
                                                <i class="am-icon-pencil"></i>
                                            </router-link>
                                            <!-- <a href="javascript:;">
                                                    <i class="am-icon-thumb-tack"></i>
                                                </a> -->
                                            <a href="javascript:;" class="tpl-table-black-operation-del">
                                                <i class="am-icon-trash"></i>
                                            </a>
                                            <a href="javascript:;" class="" data-am-modal="{target: '#post-modal'}" @click="pPost = item">
                                                <i class="am-icon-cog"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="am-u-lg-12">
                        <ul class="am-pagination">
                            <li class="am-pagination-prev" v-if="currPage"><a href="javascript:;" @click="prev">&laquo; Prev</a></li>
                            <li class="am-pagination-next" v-if="currPage<pageNum-1"><a href="javascript:;" @click="next">Next &raquo;</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="am-modal am-modal-no-btn" tabindex="-1" id="post-modal">
        <div class="am-modal-dialog">
            <div class="am-modal-hd">《{{pPost.post_title}}》 详情信息
                <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
            </div>
            <form class="am-modal-bd am-form">
                <post-info class="am-margin-bottom-0" :current-post="pPost" @changePost="save"></post-info>
                <div class="j-post-img am-text-sm">
                    <a class="am-margin-bottom-sm" id="uploadfile" :class="[pPost.post_img?'j-post-img-preview':'uploadfile']">
                        <img :src="pPost.post_img+'?imageView2/1/w/120/h/120'" alt="..." class="am-img-thumbnail am-radius" v-if="pPost.post_img">
                        <i class="am-icon-upload" v-else></i>
                    </a>
                    <a class="" @click="changePostImg">选择已有图片</a>
                    <div class="j-post-img-pa " v-if="pPost.post_img">
                        <span>位置：</span>
                        <select class="am-input-sm" v-model="pPost.post_img_position">
                            <option value="top">顶</option>
                            <option value="left">左</option>
                            <option value="right">右</option>
                        </select>
                    </div>

                </div>
            </form>
        </div>
    </div>
    <select-img v-if="show" @close="show= !show" @select="select"></select-img>
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
import PostInfo from "./post-info"
import SelectImg from "../select-img"
export default {
    data: function() {
        return {
            filterCategory: 0,
            tremObj: {},
            status: {
                'publish': '公开',
                'auto-draft': "自动草稿",
                'inherit': "继承",
                'trash': "回收站",
            },
            currPage: 0,
            rowsNum: 8,
            searchname: '',
            pPost:{},
            pass:'',
            show:false,
        }
    },
    components: {PostInfo,SelectImg},
    computed: {
        ...mapGetters([
            'categoryList',
            'posts',
            'activeImg'
        ]),
        max() {
            return this.filterPosts.length
        },
        pageNum() {
            return Math.ceil(this.filterPosts.length / this.rowsNum);
        },
        filterPosts() {
            return this.posts.filter((item) => {
                if (this.filterCategory) {
                    return (item.post_title.indexOf(this.searchname) >= 0) && item.term_id == this.filterCategory && !item.delete_at;
                } else {
                    return (item.post_title.indexOf(this.searchname) >= 0) && !item.delete_at;
                }
            })
        },
        pageList() {
            return this.filterPosts.slice(this.currPage * this.rowsNum, (this.currPage + 1) * this.rowsNum)
        },
    },
    methods: {
        ...mapMutations([
            'setPosts'
        ]),
        ...mapActions(['merge']),
        formatDate(_time) {
            let time = new Date(_time);
            return time.format('yyyy/MM/dd hh:mm');
        },
        fetchTermName(id) {
            return this.tremObj[id];
        },
        prev() {
            if (this.currPage > 0)
                this.currPage = this.currPage - 1;
        },
        next() {
            if (this.currPage < this.pageNum - 1)
                this.currPage = this.currPage + 1;
        },
        async save({index} = {}){
            let data = await api.savePost(this.pPost);
            if(data.code==0)
                this.merge(data.data);
            if(index)
                layer.close(index)
            layer.msg(data.msg)
        },
        async changePostImg(){
            this.show = true;
            // api.setPostImg({
            //     id:this.pPost.id,
            //     imgUrl:'http://oht47c0d0.bkt.clouddn.com/0fe807a0-00b3-11e7-89fa-17d9cf406414.png',
            //     position:'left'
            // })
            // layer.open({
            //   type: 1,
            //   skin: 'layui-layer-rim', //加上边框
            //   area: ['420px', '240px'], //宽高
            //   content: 'html内容'
            // });
        },
        select(){
            this.show = false;
            let domain = 'http://oht47c0d0.bkt.clouddn.com/';
            this.pPost.post_img = domain+"/"+this.activeImg.key;
            this.save();
        }
    },
    watch:{
        'pPost.post_img_position':function(v){
            if(v){
                this.save();
            }
        }
    },
    mounted: async function() {
        // console.log(this.$route)
        let tremObj = {}
        this.categoryList.forEach((item) => {
            tremObj[item.term_id] = item.name
        })
        this.$set(this, 'tremObj', tremObj);
        let self = this;
        $('#category').selected({
            btnSize: 'sm',
            searchBox: '1',
            maxHeight: 200
        }).on('change', function() {
            // var action = $(this).data('selected');
            self.filterCategory = $(this).val()
        });

        Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'uploadfile',
            drop_element: 'uploadfile',
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
                'FilesAdded': function(up, files) {},
                'BeforeUpload': function(up, file) {},
                'UploadProgress': function(up, file) {},
                'UploadComplete': function() {},
                'FileUploaded': function(up, file, info) {
                    let domain = up.getOption('domain');
                    self.pPost.post_img = domain+"/"+ JSON.parse(info).key;
                    self.save();
                },
                'Error': function(up, err, errTip) { },
            }
        });
    }
}
</script>
<style lang="less" scoped>
    .j-post-img {
        position: absolute;
        top: 50px;
        right: 35px;
        width: 200px;
        text-align: center;
        img {
            cursor: pointer;
        }

    }
    .j-post-img > a.uploadfile {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        border: 3px dashed #ccc;
        border-radius: 19px;
        i {
            color: #ccc;
            font-size: 50px;
        }
    }
    .j-post-img > a.j-post-img-preview {
        display: block;
        width: 120px;
        margin: 0 auto;
        position: relative;
        &:hover::before {
            opacity: .3;
        }
        &::before {
            content: '';
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg,rgba(0,0,0,.01) 10%,rgba(0,0,0,.95) 300%);
            transition: opacity .4s ease-in-out;
            position: absolute;
            opacity: 0;
            z-index: 1;
        }
    }
    .am-text-middle {
        img {
            width: 80px;
            margin-right: 50px;
            border: 3px solid #FFF;
            box-shadow: 0 0 3px rgba(0,0,0,.35);
        }
    }
    .j-post-img-pa select{
        display: inline-block;
        width: auto;
        min-width: 50px;
    }
</style>
