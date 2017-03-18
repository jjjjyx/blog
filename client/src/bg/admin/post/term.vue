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
                        <div class="am-u-sm-12 am-u-md-9 am-u-lg-9">
                            <div class="am-form-group">
                                <div class="am-btn-toolbar">
                                    <div class="am-btn-group am-btn-group-xs">
                                        <!-- <button type="button" class="am-btn am-btn-default am-btn-success"><span class="am-icon-plus"></span> </button> -->
                                    </div>
                                </div>
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
                                        <th>图片/图标</th>
                                        <th>名称</th>
                                        <th>说明</th>
                                        <th>文章数/创建时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in pageList">
                                        <td>{{item.term_id}}</td>
                                        <td class="am-text-middle category-table-icon"><i :class="item.icon"></i></td>
                                        <td class="am-text-middle">
                                            <!-- <a class="table-post-title" v-if="item.post_status=='publish'" :href="'/p/'+item.guid" target="_blank">{{item.post_title}}</a> -->
                                            <p class="table-post-title am-capitalize">{{item.name}}</p>
                                        </td>
                                        <td class="am-text-middle ">{{item.description}}</td>
                                        <td class="am-text-middle">共 <b>{{item.count}}</b> 篇文章<br />{{formatDate(item.create_at)}}</td>
                                        <td class="am-text-middle">
                                            <div class="tpl-table-black-operation">
                                                <a href="javascript:;" data-am-modal="{target: '#edit-category', closeViaDimmer: 1}" @click="activeItem = item">
                                                    <i class="am-icon-pencil"></i>
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

            <div class="am-modal am-text-xs" tabindex="-1" id="edit-category">
              <div class="am-modal-dialog">
                <div class="am-modal-hd">编辑分类
                  <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
                </div>
                <form class="am-modal-bd am-form am-text-left am-cf" id="edit-category-form">
                    <div class="am-form-group am-u-md-6">
                     <label for="doc-ipt-name-1">分类名称</label>
                     <input type="text" class="" id="doc-ipt-name-1" placeholder="分类名称" name="name" :value="activeItem.name">
                   </div>
                   <div class="am-form-group am-u-md-6">
                    <label for="doc-ipt-name-1">图标</label>
                    <input type="text" class="" id="doc-ipt-name-1" placeholder="图标" name="icon" :value="activeItem.icon">
                  </div>
                   <div class="am-form-group am-u-md-12">
                    <label for="doc-ipt-description-1">分类说明</label>
                    <input type="text" class="" id="doc-ipt-description-1" placeholder="分类说明" name="description" :value="activeItem.description">
                  </div>

                </form>
                <div class="am-modal-footer">
                  <span class="am-modal-btn" data-am-modal-cancel>取消</span>
                  <span class="am-modal-btn" data-am-modal-confirm>提交</span>
                </div>
              </div>
            </div>
        </div>

    </div>
</template>
<script>
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
import {onValid,onInValid} from "../../../../public/js/tools.js";
export default {
    data: function() {
        return {
            currPage:0,
            rowsNum:8,
            searchname:'',
            activeItem:{}
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'categoryList'
        ]),
        max(){
            return this.filterPosts.length
        },
        pageNum(){
            return Math.ceil(this.filterCategory.length/this.rowsNum);
        },
        filterCategory(){
            return this.categoryList.filter((item)=>{
                return (item.name.indexOf(this.searchname)>=0)&&!item.delete_at;
            })
        },
        pageList(){
            return this.filterCategory.slice(this.currPage*this.rowsNum,(this.currPage+1)*this.rowsNum)
        }
    },
    methods: {
        prev(){
            if(this.currPage>0)
                this.currPage=this.currPage-1;
        },
        next(){
            if(this.currPage<this.pageNum-1)
                this.currPage=this.currPage+1;
        },
        formatDate(_time){
            let time = new Date(_time);
            return time.format('yyyy/MM/dd hh:mm');
        },
    },
    mounted: function() {
        // TODO 到这里
        $("#edit-category-form").validator({
            onValid,
            onInValid,
            submit: async function() {
                if (this.isFormValid()) {
                    let data = await api.updataUserInfo(this.$element.serializeArray())
                    if(data.code==0){
                        self.mergeUser(data.data);
                        layer.msg("修改成功")
                    }else{
                        layer.msg(data.msg)
                    }
                }
                return false;
            }
        });
    }
}
</script>
