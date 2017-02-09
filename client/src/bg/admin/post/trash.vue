<template>
    <div class="row-content am-cf">
        <div class="row  am-cf">
            <div class="middle-warpper ">
                <h2 class="trash-title"><i class="am-icon-trash"></i> 回收站</h2>
                <ul class="am-list am-text-xs">
                    <li v-for="item in trashList">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> {{item.post_title}}</a>
                        <span data-destroy-date="将于2017/3/21">40天后清除</span>
                    </li>
                </ul>
                <a class="clear-trash">清空回收站</a>
            </div>
        </div>
    </div>

</template>
<script>
import * as api from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            trashList:[]
        }
    },
    components: {},
    computed: {

    },
    methods: {

    },
    mounted:async  function() {
        // let data = api.getPostTrash();
    }
}
</script>
<style lang="less" scoped>
    .middle-warpper {
        left: 1px;
        width: 320px;
    }
    .trash-title{
        padding: 5px 10px;
        margin: 0;
        border-bottom: 1px solid #d9d9d9;
        font-size: 20px;
        font-weight: normal;
    }
    .am-list {
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
