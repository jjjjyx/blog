<template>
<ul class="am-pagination am-pagination-centered">
    <li @click="btnClick(cur!=1,cur-1)"  :class="{'am-disabled':showFirst}"><a>&laquo;</a></li>
    <template v-if="isFirstOrLast && cur>=groups">
        <li title="首页" @click="btnClick(true,1)"><a>1</a></li>
        <li><span>...</span></li>
    </template>
    <li v-for="index in indexs" @click="btnClick(index!=cur,index)" :class="{'am-active':index==cur}"><a>{{index}}</a></li>
    <template v-if="isFirstOrLast && cur<all-less">
        <li><span>...</span></li>
        <li  title="尾页" @click="btnClick(true,all)"><a>{{all}}</a></li>
    </template>
    <li @click="btnClick(cur!=all,cur+1)" :class="{'am-disabled':showLast}"><a>&raquo;</a></li>
</ul>
</template>
<script>
export default {
    data: function () {
        return {
            name: '分页组件',
            // groups: 2, //显示分页大小
            less: 1
        }
    },
    props:{
        groups: {
          type: Number,
          default: 3
        },
        isFirstOrLast:{
            type :Boolean,
            default: true
        },
        isPageNumber: {
            type: Boolean,
            default: true
        },
        cur: {
            type: Number,
            default:1
        },
        all: {
            type: Number,
            default:5
        }
    },
    computed: {
        indexs: function () {
            this.less = Math.floor(this.groups/2)
            let arr = [],
            s = this.cur - this.less,
            e = this.cur + this.less;
            if(this.all<=this.groups){
                s = 1;
                e = this.all;
            }else {
                if(s<=1){
                    e+= 1-s;
                    s = 1;
                }
                if(e>this.all){
                    s-= e-this.all;
                    e = this.all;
                }
            }
            for(;s<=e;s++){
                arr.push(s);
            }
            return arr
        },
        // 下一个是否可以点击
        showLast: function () {
            return this.cur == this.all;
        },
        showFirst: function () {
            return this.cur == 1;
        }
    },
    methods: {
        btnClick: function (i,data) { //页码点击事件
            if(i)
                this.$emit('toPage', data);
        }
    }
}
</script>
