

<template>
<div class="container" id="main">
 <!-- 图片 -->
    <div class="row img-paly">
        <div class="col-md-8" >
            图片轮播
        </div>
        <div class="col-md-4">
            search or other
        </div>
    </div>
    <!-- 推广 -->
    <div class="row img-paly">
        <div class="col-md-8" >
            --推广--
        </div>
        <div class="col-md-4">

        </div>
    </div>

    <!-- 最新文章 -->
    <div class="row img-paly">
        <div class="col-md-8" >
            最新文章
        </div>
        <div class="col-md-4">
            最新评论
        </div>
    </div>

</div>
</template>

<script>
import api from '../netapi.js'

import { mapGetters, mapActions } from 'vuex'

export default {
    data: function () {
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
    mounted: function () {
    }
}
</script>
