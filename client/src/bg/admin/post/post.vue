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
                                        <button type="button" class="am-btn am-btn-default am-btn-success"><span class="am-icon-plus"></span> </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="am-u-sm-12 am-u-md-6 am-u-lg-3">
                            <div class="am-form-group tpl-table-list-select">
                                <select name="category" id="category" >
                                    <option :value="item.term_id" v-for="item in categoryList">{{item.name}}</option>
                                </select>
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
                                        <th>ID</th>
                                        <th>缩略图</th>
                                        <th>标题</th>
                                        <th>作者</th>
                                        <th>创建时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in posts">
                                        <td>{{item.id}}</td>
                                        <td>{{item.id}}</td>
                                        <td class="am-text-middle">{{item.post_title}}</td>
                                        <td class="am-text-middle">{{item.author}}</td>
                                        <td class="am-text-middle">{{item.create_at}}</td>
                                        <td class="am-text-middle">
                                            <div class="tpl-table-black-operation">
                                                <router-link :to="{path:`/post/category/${item.term_id}/article/${item.id}`}">
                                                    <i class="am-icon-pencil"></i> 编辑
                                                </router-link>
                                                <a href="javascript:;">
                                                    <i class="am-icon-thumb-tack"></i> 置顶
                                                </a>
                                                <a href="javascript:;" class="tpl-table-black-operation-del">
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
        </div>

    </div>
</template>
<script>
// import
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {
        ...mapGetters([
            'categoryList',
            'posts',
        ]),
    },
    methods: {
        ...mapMutations([
            'setPosts'
        ])
    },
    mounted:async function() {
        // console.log(this.$route)
        $('#category').selected({btnSize: 'sm'});
    }
}
</script>
