

<template>
<div class="container" id="main">
    <!-- 图片 -->
    <div class="row">
        <div class="col-md-9">
            <div id="carousel-example-generic" class="carousel slide banner" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                </ol>

                <!-- Wrapper for slides -->
                <div class="carousel-inner" role="listbox">
                    <div class="item active">
                        <img src="http://oht47c0d0.bkt.clouddn.com/16-12-13/92824295-file_1481639354189_9148.png" alt="...">
                        <div class="acarousel-caption">
                            ...asdasd
                        </div>
                    </div>
                    <div class="item">
                        <img src="http://oht47c0d0.bkt.clouddn.com/16-12-13/57533964-file_1481639376997_9cb7.png" alt="...">
                        <div class="acarousel-caption">
                            =====
                        </div>
                    </div>
                    <div class="item">
                        <img src="http://oht47c0d0.bkt.clouddn.com/16-12-13/97222073-file_1481639391407_16df4.png" alt="..." height="300">
                        <div class="acarousel-caption">
                            =====
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <a class="left acarousel-control glyphicon glyphicon-chevron-left" href="#carousel-example-generic" role="button" data-slide="prev"></a>
                <a class="right acarousel-control glyphicon glyphicon-chevron-right" href="#carousel-example-generic" role="button" data-slide="next"></a>
            </div>

        </div>
        <div class="col-md-3 sidebar">
            <!-- 热门推荐 -->
            <div class="part">
                <div class="title">
                    <h3>
                        <span class="num">72</span>小时热文榜
                    </h3>
                    <a href="javascript:;" class="r btn btn-sm red">
                        TOP 50   &nbsp;&nbsp;<i class="fa fa-angle-right"></i>
                    </a>
                </div>
                <ol class="hot">
                    <li><a title="中国企业集体“出逃”：国内实体经济成本除了人便宜，什么都比美国贵">中国企业集体“出逃”：国内实体经济成本除了人便宜，什么都比美国贵</a></li>
                    <li><a title="在阿里“救了八年火”的程序猿，这样讲述淘宝的技术进化史">在阿里“救了八年火”的程序猿，这样讲述淘宝的技术进化史</a></li>
                    <li><a title="从 iPod 到 Apple Music 的生态涅槃，苹果的出发点从来不是“生态”而是产品">从 iPod 到 Apple Music 的生态涅槃，苹果的出发点从来不是“生态”而是产品</a></li>
                    <li><a title="高晓松IP争夺战：爱奇艺的损失就是优酷的机会吗？">高晓松IP争夺战：爱奇艺的损失就是优酷的机会吗？</a></li>
                    <li><a title="我们在钛空包了个电影院，邀你一起逃离“绝对控制”！">我们在钛空包了个电影院，邀你一起逃离“绝对控制”！</a></li>
                    <li><a title="马云所说的“新制造”来了，人工智能会扮演怎样的角色？">马云所说的“新制造”来了，人工智能会扮演怎样的角色？</a></li>
                    <li><a title="20亿兑付危机，王宝强被P2P平台京金联拖入“诈骗风波”">20亿兑付危机，王宝强被P2P平台京金联拖入“诈骗风波”</a></li>
                    <li><a title="周其仁：中国经济若想突围，唯有创新才是王道">周其仁：中国经济若想突围，唯有创新才是王道</a></li>
                    <li><a title="微信小程序重磅更新，这几点解读，你不得不看！">微信小程序重磅更新，这几点解读，你不得不看！</a></li>
                    <li><a title="天猫、苏宁们未来能淘汰家乐福、沃尔玛吗？">天猫、苏宁们未来能淘汰家乐福、沃尔玛吗？</a></li>
                </ol>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import api from '../netapi.js'

import {
    mapGetters,
    mapActions
} from 'vuex'

export default {
    data: function() {
        return {
            btn_disabled_status: false,
            keyword: ''
        }
    },
    computed: {
        // ...mapGetters([
        //     'count'
        // ]),
    },
    methods: {

    },
    mounted: function() {
        $('#carousel-example-generic').carousel()
    }
}
</script>
