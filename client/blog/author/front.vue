<template>
<div class="j-unit-box">
    <!-- 概览 -->
    <div class="j-pt-overview">
        <div class="j-pt-overview-name">
            <i class="iconfont" :class="icon"></i>
            <h3>{{title}}</h3>
        </div>
        <div class="j-pt-overview-sub-menu">
            <li v-for="item in subMenu">
                <div class="title">{{item}}</div>
            </li>
            <li>
                <div class="title">...</div>
            </li>
        </div>
    </div>
    <!-- 详细 -->
    <div class="j-pt-detail">
        <div class="j-pt-detail-name">
            <i class="iconfont" :class="icon"></i>
            <h3>{{title}}</h3>
        </div>
        <div class="j-pt-detail-sub-menu">
            <li v-for="item in subMenu">
                <div class="title">{{item}}</div>
            </li>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data: function() {
        return {
            title:'前端',
            icon:'icon-qianduan',
            subMenu:['1',2,3]
        }
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted: function() {

    }
}
</script>
