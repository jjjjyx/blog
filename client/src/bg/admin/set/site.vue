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
                <form class="am-form tpl-form-border-form tpl-form-border-br widget-body  am-fr " id="site" @submit.prevent>
                    <div class="am-form-group">
                        <label for="site-title" class="am-u-sm-3 am-form-label">标题 / Title</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="site-title" name="title" :value="site.title" placeholder="标题 / Title">
                            <small>网站标题</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="site-keyword" class="am-u-sm-3 am-form-label">关键词 / Keyword</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="site-keyword" name="keyword" :value="site.keyword" placeholder="关键词 / keyword">
                            <small>关键词</small>
                        </div>
                    </div>

                    <div class="am-form-group">
                        <label for="site-description" class="am-u-sm-3 am-form-label">描述 / description</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="site-description" name="description" :value="site.description" placeholder="描述 / description">
                            <small>描述下网站</small>
                        </div>
                    </div>

                    <div class="am-form-group">
                        <label for="site-sign" class="am-u-sm-3 am-form-label">首页签名 / Sign</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="site-sign" name="sign" :value="site.sign" placeholder="首页签名 / sign">
                            <small>来句个性标语</small>
                        </div>
                    </div>
                    <div class="am-form-group am-form-file">
                        <label for="site-avatar" class="am-u-sm-3 am-form-label">首页头像 / Avatar</label>
                        <div class="am-u-sm-9">
                            <div class="tpl-form-file-img am-thumbnail am-margin-0" style="    width: 145px;height: 145px;">
                                <img :src="site.avatar" alt="" class="">
                            </div>
                            <button type="button" class="am-btn am-btn-danger am-btn-sm">
                                <i class="am-icon-cloud-upload"></i> 添加首页头像图片</button>
                            <input id="site-avatar" type="file">
                            <small>首页头像要酷，要有逼格</small>
                        </div>
                    </div>
                    <div class="am-form-group am-form-file">
                        <label for="doc-form-file" class="am-u-sm-3 am-form-label">首页背景 / Background</label>
                        <div class="am-u-sm-9">
                            <div class="tpl-form-file-img am-thumbnail am-margin-0">
                                <img :src="site.background" alt="">
                            </div>
                            <button type="button" class="am-btn am-btn-danger am-btn-sm">
                                <i class="am-icon-cloud-upload"></i> 添加封面图片</button>
                            <!-- <input type="text" id="user-name" :value="site.background"  placeholder="首页背景 / Background"> -->
                            <input id="doc-form-file" type="file">
                            <small>来张时髦的首页图片</small>
                        </div>
                    </div>

                    <div class="am-form-group">
                        <div class="am-u-sm-9 am-u-sm-push-3">
                            <button type="submit" class="am-btn am-btn-primary">保存修改</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex'
import * as api from "../../../../public/js/netapi.js";
import {onValid,onInValid} from "../../../../public/js/tools.js";
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {
        ...mapGetters([
            'site'
        ])
    },
    methods: {

    },
    mounted: function() {
        $('#site').validator({
            onValid,
            onInValid,
            submit: async function() {
                if (this.isFormValid()) {
                    let data = await api.updataSiteInfo(this.$element.serializeArray())
                    if(data.code==0){
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
