<template>
<div class="row-content am-cf">
    <div class="row">
        <div class="am-u-sm-12 am-u-md-8">
            <div class="widget am-cf">
                <div class="widget-head am-cf">
                    <div class="widget-title am-fl">
                        站点设置
                    </div>
                    <div class="widget-function am-fr">
                        <a href="javascript:;" class="am-icon-cog"></a>
                    </div>
                </div>
                <form class="am-form tpl-form-border-form tpl-form-border-br widget-body  am-fr ">
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">标题 / Title</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="标题 / Title">
                            <small>网站标题</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">关键词 / Keyword</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="关键词 / keyword">
                            <small>关键词</small>
                        </div>
                    </div>

                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">描述 / description</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="描述 / description">
                            <small>描述下网站</small>
                        </div>
                    </div>

                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">首页签名 / Sign</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="首页签名 / sign">
                            <small>来句个性标语</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">首页背景 / Background</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="首页背景 / Background">
                            <small>来张时髦的首页图片</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">首页头像 / Avatar</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" placeholder="首页头像 / Avatar">
                            <small>首页头像要酷，要有逼格</small>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {
        console.log("404");
    }
}
</script>
