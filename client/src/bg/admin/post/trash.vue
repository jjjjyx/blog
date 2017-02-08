<template>
    <div class="row-content am-cf">
        <div class="row  am-cf">
            <div class="middle-warpper ">
                <h2 class="trash-title"><i class="am-icon-trash"></i> 回收站</h2>
                <ul class="am-list am-text-xs">
                    <li class="active">
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> 每个人都有一个死角， 自己走不出来，别人也闯不进去。</a>
                        <span data-destroy-date="将于2017/3/21">40天后清除</span>
                    </li>
                    <li>
                        <a class="am-text-truncate"><i class="am-icon-file-text"></i> 每个人都有一个死角， 自己走不出来，别人也闯不进去。</a>
                    </li>
                </ul>
                <a class="clear-trash" style="display: block;" href="javascript:void(null)">清空回收站</a>
            </div>
        </div>
    </div>

</template>
<script>
// import
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
    }
</style>
