<template>

    <div class="row-content am-cf">
        <div class="row  am-cf">
            <div class="am-u-sm-12 am-u-md-12 am-u-lg-4">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">月度财务收支计划</div>
                        <div class="widget-function am-fr">
                            <a href="javascript:;" class="am-icon-cog"></a>
                        </div>
                    </div>
                    <div class="widget-body am-fr">
                        <div class="am-fl">
                            <div class="widget-fluctuation-period-text">
                                ￥61746.45
                                <button class="widget-fluctuation-tpl-btn">
                                    <i class="am-icon-calendar"></i>
                                    更多月份
                                  </button>
                            </div>
                        </div>
                        <div class="am-fr am-cf">
                            <div class="widget-fluctuation-description-amount text-success" am-cf>
                                +￥30420.56

                            </div>
                            <div class="widget-fluctuation-description-text am-text-right">
                                8月份收入
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-6 am-u-lg-4">
                <div class="widget widget-primary am-cf">
                    <div class="widget-statistic-header">
                        本季度利润
                    </div>
                    <div class="widget-statistic-body">
                        <div class="widget-statistic-value">
                            ￥27,294
                        </div>
                        <div class="widget-statistic-description">
                            本季度比去年多收入 <strong>2593元</strong> 人民币
                        </div>
                        <span class="widget-statistic-icon am-icon-credit-card-alt"></span>
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-6 am-u-lg-4">
                <div class="widget widget-purple am-cf">
                    <div class="widget-statistic-header">
                        本季度利润
                    </div>
                    <div class="widget-statistic-body">
                        <div class="widget-statistic-value">
                            ￥27,294
                        </div>
                        <div class="widget-statistic-description">
                            本季度比去年多收入 <strong>2593元</strong> 人民币
                        </div>
                        <span class="widget-statistic-icon am-icon-support"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row am-cf">
            Hello world
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
        console.log(this.$route)
        console.log("hello world");
    }
}
</script>
