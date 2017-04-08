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
                        本日访问量
                    </div>
                    <div class="widget-statistic-body">
                        <div class="widget-statistic-value">
                            11 次
                        </div>
                        <!-- <div class="widget-statistic-description">
                            本季度比去年多收入 <strong>2593元</strong> 人民币
                        </div> -->
                        <span class="widget-statistic-icon am-icon-credit-card-alt"></span>
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-6 am-u-lg-4">
                <div class="widget widget-purple am-cf">
                    <div class="widget-statistic-header">
                        本月发文量
                    </div>
                    <div class="widget-statistic-body">
                        <div class="widget-statistic-value">
                            5 篇
                        </div>
                        <!-- <div class="widget-statistic-description">
                            本季度比去年多收入 <strong>2593元</strong> 人民币
                        </div> -->
                        <span class="widget-statistic-icon am-icon-support"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row am-cf">
            <div class="am-u-sm-12 am-u-md-8">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">博客系统待做项目</div>
                        <div class="widget-function am-fr">
                            <a href="javascript:;" class="am-icon-cog"></a>
                        </div>
                    </div>
                    <div class="widget-body widget-body-md am-fr">
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-4">
                <div class="widget am-cf">
                    <div class="widget-head am-cf">
                        <div class="widget-title am-fl">专用服务器负载</div>
                        <div class="widget-function am-fr">
                            <a href="javascript:;" class="am-icon-cog"></a>
                        </div>
                    </div>
                    <div class="widget-body widget-body-md am-fr">

                        <div class="am-progress-title">CPU Load <span class="am-fr am-progress-title-more">28% / 100%</span></div>
                        <div class="am-progress">
                            <div class="am-progress-bar" style="width: 15%"></div>
                        </div>
                        <div class="am-progress-title">CPU Load <span class="am-fr am-progress-title-more">28% / 100%</span></div>
                        <div class="am-progress">
                            <div class="am-progress-bar  am-progress-bar-warning" style="width: 75%"></div>
                        </div>
                        <div class="am-progress-title">CPU Load <span class="am-fr am-progress-title-more">28% / 100%</span></div>
                        <div class="am-progress">
                            <div class="am-progress-bar am-progress-bar-danger" style="width: 35%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row am-cf">
            <div class="am-u-sm-12 am-u-md-12 am-u-lg-4 widget-margin-bottom-lg ">
                <div class="tpl-user-card am-text-center widget-body-lg">
                    <div class="tpl-user-card-title">
                        {{user.user_nickname}}
                    </div>
                    <div class="achievement-subheading">
                        月度最佳管理员
                    </div>
                    <img class="achievement-image" src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="">
                    <div class="achievement-description">
                        {{user.user_nickname}}在
                        <strong>30天内</strong> 发布了
                        <strong>5</strong>篇文章。<br>
                        {{user.user_nickname}}在
                        <strong>30天内</strong> 完成了
                        <strong>20</strong>个任务。
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions,mapMutations } from 'vuex'
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {
        ...mapGetters([
            'user',
            'contentHeight',
        ]),
        indexHeight (){
            let height = this.contentHeight;
            height -= 138;
            return {
                height:`${height}px`
            }
        }
    },
    methods: {

    },
    mounted: function() {
        // console.log(this.$route)
        console.log("hello world");
    }
}
</script>
