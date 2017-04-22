<template>
    <div class="am-modal am-modal-active" id="selectImgPanel" style="display:block">
        <section class="am-panel am-panel-default am-modal-dialog" style="width: 960px;">
            <header class="am-panel-hd am-modal-hd">
                <h3 class="am-panel-title">选择图片</h3>
                <a class="am-close" @click="close">&times;</a>
            </header>
            <main class="am-panel-bd">
                <form class="am-form-inline">
                    <div class="am-form-group">
                        <input type="text" class="am-form-field" placeholder="关键字">
                    </div>
                    <button type="submit" class="am-btn am-btn-default">搜索</button>
                </form>
                <ul class="j-select-img-list am-avg-sm-6">
                    <li v-for="(item,index) in imgList" @click="select(item)" :class="{'selected':item.select}">
                        <div class="am-gallery-item">
                            <div style="" class="j-img-p">
                                <img :src="'http://oht47c0d0.bkt.clouddn.com/'+item.key+'?imageView2/1/w/120/h/120'" :alt="item.key" />
                                <span>{{item.key}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="am-text-center" v-if="marker">
                    <button class="am-btn am-round gray btn-bordered am-btn-sm" @click="getImgList()">
                        <i class="am-icon-spinner am-icon-spin am-text-xs" v-if="loading"></i> {{loading?'loading...':'加载更多'}}
                    </button>
                </div>
            </main>
            <footer class="am-panel-footer">
                <button type="button" class="am-btn am-btn-default" @click="close">取消</button>
                <button type="button" class="am-btn am-btn-primary" @click="save">确认</button>
            </footer>
        </section>
    </div>
</template>
<script>
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex';
import * as api from "public/js/netapi.js";
export default {
    data: function() {
        return {
            loading:false
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'contentHeight', 'imgList','marker'
        ]),
    },
    methods: {
        ...mapMutations([
            'deleteImgList',
            'addImgList',
            'setMarker'
        ]),
        formatDate(_time) {
            let time = new Date(_time / 10000);
            return time.format('yyyy/MM/dd hh:mm');
        },
        async getImgList() {
            this.loading = true
            let data = await api.getImgs({
                marker:this.marker
            });
            // this.imgList = this.imgList.concat(data.data);
            this.addImgList(data.data)
            this.domain = data.domain;
            this.setMarker(data.next);
            this.loading = false
        },
        select(item){
            this.imgList.forEach((i)=>{
                i.select = false;
            })
            item.select = true;
        },
        save(){
            this.$emit('select')
        },
        close(){
            this.$emit('close')
        }
    },
    mounted: function() {
        if(!this.imgList.length){
            this.getImgList();
        }
    }
}
</script>
<style lang="less" scoped>
.j-select-img-list {
    margin: 15px 0;
    height: 370px;
    overflow: auto;
    li {
        border: 2px solid transparent;
        margin: 6px 0;
    }
    li.selected {
        border: 2px solid #fc8383;
    }
    .j-img-p{
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }
    li img+span {
        display: block;
        position: absolute;
        bottom: 0;
        height: 20px;
        background: rgba(0,0,0,.5);
        left: 0;
        right: 0;
        color: #fff;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        opacity: 0;
        transform: translate(0,20px);
        transition: all .2s ease;
    }
    li:hover img+span{
        opacity: 1;
        transform: translate(0,0);
    }
}
</style>
