

<template>
<div class="container" id="main">
 <!-- 图片 -->
    <div class="row">
        <div class="col-md-9" >
            <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
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
        <div class="col-md-3">
            search or other
        </div>
    </div>
    <!-- 推广 -->
    <div class="row img-paly">
        <div class="col-md-9" >
            --推广--
        </div>
        <div class="col-md-3">

        </div>
    </div>

    <!-- 最新文章 -->
    <div class="row img-paly">
        <div class="col-md-9" >
            最新文章
        </div>
        <div class="col-md-3">
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
        $('#carousel-example-generic').carousel()
    }
}
</script>
