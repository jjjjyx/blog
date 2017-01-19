<template>
    <form class="row-content am-cf am-form tpl-form-border-form">
        <div class="row  am-cf">
            <div class="am-u-sm-12 am-u-md-8">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">编辑文章</div>
                        <!-- <div class="widget-function am-fr">
                            <a href="javascript:;" class="am-icon-cog"></a>
                        </div> -->
                    </div>
                    <div class=" widget-body" >
                        <!-- <form class="am-form tpl-form-border-form am-padding-top-0"> -->
                            <div class="am-form-group">
                                <label for="post_title" class="am-u-sm-12 am-form-label am-text-left am-text-sm">
                                    <i class="am-text-danger am-text-xs">*</i> 标题
                                    <span class="tpl-form-line-small-title">
                                        Title
                                    </span>
                                </label>
                                <div class="am-u-sm-12">
                                    <input type="text" class="tpl-form-input am-margin-top-xs" id="post_title" placeholder="请输入标题文字">
                                    <small>请填写标题文字10-20字左右。</small>
                                </div>
                            </div>
                            <div class="am-form-group">
                                <label for="post_title" class="am-u-sm-12 am-form-label am-text-left">
                                    <i class="am-text-danger am-text-xs">*</i> 文章内容
                                    <!-- <span class="tpl-form-line-small-title">
                                        context
                                    </span> -->
                                </label>
                                <div class="am-u-sm-12">
                                    <input type="text" class="tpl-form-input am-margin-top-xs" id="post_title" placeholder="请输入标题文字">

                                </div>
                            </div>
                        <!-- </form> -->
                    </div>
                </div>
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">摘要</div>
                    </div>
                    <div class=" widget-body" >
                        <div class="am-form-group">
                            <div class="am-u-sm-12">
                                <textarea rows="6"></textarea>
                                <small>摘要是您可以手动添加的内容概要，在展示的时候会用到这些文字。</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">自定义栏目</div>
                    </div>
                    <div class=" widget-body" >
                        <div class="am-form-group">
                            <div class="am-u-sm-12">
                                <!-- <textarea rows="6"></textarea> -->
                                <!-- <small>摘要是您可以手动添加的内容概要，在展示的时候会用到这些文字。</small> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-4">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">作者</div>
                    </div>
                    <div class=" widget-body">
                        <!-- <button class="am-btn-default am-btn am-btn-xs"></button> -->
                        <!-- <a class="am-text-primary am-text-xs "><i class="am-icon-plus"></i></a> -->
                    </div>
                </div>
                <div class="widget am-cf widget-release">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">发布</div>
                        <!-- <div class="widget-function am-fr">
                            <a href="javascript:;" class="am-icon-cog"></a>
                        </div> -->
                    </div>
                    <div class=" widget-body " >
                        <div class="am-cf am-margin-bottom-xs">
                            <button class="am-btn am-btn-default am-btn-xs am-fl">保存草稿</button>
                            <button class="am-btn am-btn-default am-btn-xs am-fr">预览</button>
                        </div>
                        <ul class="am-list am-list-static release-opt am-text-xs am-margin-bottom-0">
                            <li>
                                <i class="am-icon-paw am-icon-sm"></i> 状态: <strong>草稿</strong> <a class="am-inline-block am-padding-0" data-am-collapse="{parent: '.release-opt', target: '#do-not-say-1'}">编辑</a>
                                <div id="do-not-say-1" class="am-panel-collapse am-collapse">
                                    1
                                </div>
                            </li>
                            <li><i class="am-icon-eye am-icon-sm"></i> 可见性: <strong>公开</strong> <a class="am-inline-block am-padding-0" data-am-collapse="{parent: '.release-opt', target: '#do-not-say-2'}">编辑</a>
                                <div id="do-not-say-2" class="am-panel-collapse am-collapse">
                                    2
                                </div>
                            </li>
                            <li><i class="am-icon-calendar am-icon-sm"></i> <strong>立即</strong>发布 <a class="am-inline-block am-padding-0" data-am-collapse="{parent: '.release-opt', target: '#do-not-say-3'}">编辑</a>
                                <div id="do-not-say-3" class="am-panel-collapse am-collapse">
                                    3
                                </div>
                            </li>
                        </ul>
                    </div>
                    <footer class="widget-head am-cf am-text-sm">
                        <a class="am-text-danger">移至回收站</a>
                        <button class="am-btn am-btn-primary am-btn-sm am-fr">发布</button>
                    </footer>
                </div>
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">分类目录</div>
                    </div>
                    <div class=" widget-body " >
                        <div class="am-tabs am-text-xs am-margin-bottom-sm" data-am-tabs="{noSwipe: 1}" id="doc-tab-demo-1">
                            <ul class="am-tabs-nav am-nav am-nav-tabs" >
                                <li class="am-active"><a href="javascript: void(0)">最常用</a></li>
                                <li><a href="javascript: void(0)">所有分类</a></li>
                                <!-- <li><a href="javascript: void(0)">添加新分类目录</a></li> -->
                            </ul>

                            <div class="am-tabs-bd">
                                <div class="am-tab-panel am-active">
                                    33
                                </div>
                                <div class="am-tab-panel">
                                    444
                                </div>
                            </div>
                        </div>
                        <a class="am-text-primary am-text-xs "><i class="am-icon-plus"></i>添加新分类目录</a>
                    </div>
                </div>
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">标签</div>
                    </div>
                    <div class=" widget-body " >
                        <multiple-search ></multiple-search>
                        <!-- <button class="am-btn-default am-btn am-btn-xs"></button> -->
                        <!-- <a class="am-text-primary am-text-xs "><i class="am-icon-plus"></i></a> -->
                    </div>
                </div>
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">特殊图像</div>
                    </div>
                    <div class=" widget-body " >
                        <!-- <multiple-search class="tpl-form-border-form"></multiple-search> -->

                        <!-- <button class="am-btn-default am-btn am-btn-xs"></button> -->
                        <a class="am-text-primary am-text-xs "><i class="am-icon-plus"></i>选择图片</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .widget-release {
        .am-list>li{
            background-color: transparent;
        }
        .am-list>li:first-child {
            border-top: transparent;
        }
        .am-list>li:last-child {
            // border-bottom: transparent;
        }
        a {
            text-decoration: underline;
        }
    }

</style>
<script>
import MultipleSearch from "../../../components/MultipleSearch.vue"
export default {
    data: function() {
        return {}
    },
    components: {
        MultipleSearch
    },
    computed: {

    },
    methods: {

    },
    mounted: function() {
        console.log(this.$route)
    }
}
</script>
