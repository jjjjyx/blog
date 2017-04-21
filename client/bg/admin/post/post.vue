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
                                        <th>缩略图</th>
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
                                        <td>{{item.id}}</td>
                                        <td class="am-text-middle">
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
                                                <a href="javascript:;">
                                                    <i class="am-icon-thumb-tack"></i>
                                                </a>
                                                <a href="javascript:;" class="tpl-table-black-operation-del">
                                                    <i class="am-icon-trash"></i>
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

    </div>
</template>
<script>
// import
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "public/js/netapi.js";
export default {
    data: function() {
        return {
            filterCategory:0,
            tremObj :{},
            status:{
                'publish':'公开',
                'auto-draft':"自动草稿",
                'inherit':"继承",
                'trash':"回收站",
                ////
            },
            currPage:0,
            rowsNum:8,
            searchname:'',
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'categoryList',
            'posts',
        ]),
        max(){
            return this.filterPosts.length
        },
        pageNum(){
            return Math.ceil(this.filterPosts.length/this.rowsNum);
        },
        filterPosts(){
            return this.posts.filter((item)=>{
                if(this.filterCategory){
                    return (item.post_title.indexOf(this.searchname)>=0)&&item.term_id==this.filterCategory&&!item.delete_at;
                }else{
                    return (item.post_title.indexOf(this.searchname)>=0)&&!item.delete_at;
                }
            })
        },
        pageList(){
            return this.filterPosts.slice(this.currPage*this.rowsNum,(this.currPage+1)*this.rowsNum)
        }
    },
    methods: {
        ...mapMutations([
            'setPosts'
        ]),
        formatDate(_time){
            let time = new Date(_time);
            return time.format('yyyy/MM/dd hh:mm');
        },
        fetchTermName(id){
            return this.tremObj[id];
        },
        prev(){
            if(this.currPage>0)
                this.currPage=this.currPage-1;
        },
        next(){
            if(this.currPage<this.pageNum-1)
                this.currPage=this.currPage+1;
        },
    },
    mounted:async function() {
        // console.log(this.$route)
        let tremObj = {}
        this.categoryList.forEach((item)=>{
            tremObj[item.term_id]=item.name
        })
        this.$set(this,'tremObj',tremObj);
        let self = this;
        $('#category').selected({btnSize: 'sm',searchBox:'1',maxHeight:200}).on('change', function() {
            // var action = $(this).data('selected');
            self.filterCategory = $(this).val()
        });
    }
}
</script>
