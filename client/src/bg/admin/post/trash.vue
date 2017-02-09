<template>
    <div class="row-content am-cf">
        <div class="row  am-cf">
            <div class="middle-warpper ">
                <h2 class="trash-title"><i class="am-icon-trash"></i> 回收站</h2>
                <ul class="am-list am-text-xs am-margin-0" :style="uHeight">
                    <li v-for="item in trashList">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> {{item.post_title}}</a>
                        <span :data-destroy-date="formatDate(item.delete_at)">{{formatTime(item.delete_at)}}天后清除</span>
                    </li>
                    <li v-for="item in trashList">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> {{item.post_title}}</a>
                        <span :data-destroy-date="formatDate(item.delete_at)">{{formatTime(item.delete_at)}}天后清除</span>
                    </li>
                    <li v-for="item in trashList">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> {{item.post_title}}</a>
                        <span :data-destroy-date="formatDate(item.delete_at)">{{formatTime(item.delete_at)}}天后清除</span>
                    </li>
                    <li v-for="item in trashList">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> {{item.post_title}}</a>
                        <span :data-destroy-date="formatDate(item.delete_at)">{{formatTime(item.delete_at)}}天后清除</span>
                    </li>
                </ul>
                <a class="clear-trash">清空回收站</a>
            </div>
            <div class="right-warpper" :style="autoHeight">
                <div class="article-title">
                    <h3>无标车</h3>
                </div>
                <div class="article-content" :style="cHeight">
                    
                </div>
                <div class="article-toolbar">
                    <button type="button" class="am-btn am-btn-success">恢复文章</button>
                    <button type="button" class="am-btn am-btn-danger">彻底删除</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import * as api from "../../../../public/js/netapi.js";
import { mapGetters, mapActions,mapMutations } from 'vuex'
export default {
    data: function() {
        return {
            // trashList:[]
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'posts',
            'trashList',
            'contentHeight',
            'autoHeight'
        ]),
        uHeight(){
            let height = (this.contentHeight-102)+'px';
            return{
                height,
            }
        },
        cHeight(){
            let height = (this.contentHeight-66-60)+'px';
            return{
                height,
            }
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function(){

        }
    },
    methods: {
        ...mapMutations([
            'setPosts'
        ]),
        formatTime(_time){
            let time = new Date(_time);
            let start = new Date();
            let day = Math.floor((start.getTime() - time.getTime())/(24*60*60*1000));
            return 60-day;
        },
        formatDate(_time){
            let time = new Date(_time);
            time.setDate(time.getDate()+60);
            return time.format('将于yyyy/MM/dd');
        }
    },
    mounted:async  function() {
        if(!this.posts||!this.posts.length){
            let data = await api.posts();
            if(data.code==0){
                this.setPosts(data.data);
            }else{
                layer.alert('发生异常，请刷新后重试');
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .middle-warpper {
        left: 1px;
        width: 320px;
    }
    .right-warpper {
        margin-left: 322px;
        background-color: #fff;
        height: 100%;
        overflow: hidden;
    }
    .trash-title{
        padding: 5px 10px;
        margin: 0;
        // border-bottom: 1px solid #d9d9d9;
        font-size: 20px;
        font-weight: normal;
    }
    .article-title{
        min-height: 48px;
        padding-top: 20px;
        padding-bottom: 20px;
        background: #eeeeee;
        border-bottom: 1px solid #eeeeee;
        text-align: center;
        h3 {
            display: inline-block;
            margin: 0;
            // font-size: 24.5px;
        }
    }
    .article-toolbar{
        position: absolute;
        left: 0px;
        bottom: 0px;
        box-sizing: border-box;
        width: 100%;
        padding: 11px 0;
        border-top: 1px solid #d9d9d9;
        text-align: center;
    }
    .am-list {
        overflow: auto;
        li {
            position: relative;
            padding: 12px 10px;
            cursor: pointer;
        }
        li.active{
            background-color: whitesmoke;
            border-right: 3px solid #3bb4f2;
        }
        li:hover {
            background-color: #eeeeee;
            &>a {
                width: 140px;
            }
            &>span:before{
                content: attr(data-destroy-date);
                position: relative;
                right: -15px;
                z-index: 4;
                background-color: #eeeeee;
            }
        }
        li>a {
            padding: 0;
            width: 180px;
            font-size: 14px;
            color: #8e8e8e;
        }
        li>span{
            position: absolute;
            top: 15px;
            right: 10px;
            display: block;
            color: #b1b1b1;
        }
    }
    .clear-trash {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 17px 0;
        display: block;
        border-top: 1px solid #d9d9d9;
        font-size: 16px;
        text-align: center;
        color: #3bb4f2;
        opacity: .8;
        &:hover {
            opacity: 1;
        }
    }
</style>
