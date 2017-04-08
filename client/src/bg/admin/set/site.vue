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
                    <div class="am-form-group" v-for="item in site">
                        <label for="site-title" class="am-u-sm-3 am-form-label">{{item.text}} / {{item.key}}</label>
                        <div class="am-u-sm-9">
                            <input type="text" id="site-title" :name="item.key" :value="item.value" :placeholder="item.text +' / '+item.key">
                            <small>{{item.textSmall}}</small>
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
