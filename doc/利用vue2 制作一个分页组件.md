# 利用vuejs2 制作一个分页组件

分页组件是一个常用的需求，在一个正常的业务系统中会经常用到分页这种功能。今天分享一个分页公共组件的制作思路
最终效果：
1. ![图片](https://dn-coding-net-production-pp.qbox.me/18ce5cb3-8bd2-4e09-8cbd-4ffdea847817.png)
2. ![图片](https://dn-coding-net-production-pp.qbox.me/959abe24-9b3c-4bf9-9f9f-18808cfe868b.png)

    ..等多种样式

> 这里参考 [laypage](http://laypage.layui.com/) 分页样式

### 1. 首先设计出分页的按钮样式。
 ![图片](https://dn-coding-net-production-pp.qbox.me/5735397d-406c-4463-b475-aee63f880963.png)

 这步很简单,相应的html代码:
 ```html
 <p>目前在第1页,一共有:11页</p>
 <div class="laypage_main laypageskin_yahei">
     <button class="laypage_prev" disabled="disabled">上一页</button>
     <button class="laypage_next">下一页</button>
 </div>
 ```


### 2. 接着加上分页必需的变量,以及点击上下页的事件,页数按钮禁用判断
* 当前页 cur
* 总页数 all
我们想要将组件做成公共组件，那这个值肯定是根据父组件来传递的

```javascript
// vue Template
export default {
    //...
    props:{
        cur: {
            type: Number,
            default:1
        },
        all: {
            type: Number,
            default:1
        }
    },
    computed:{
        showLast: function () {
            return this.cur == this.all;
        },
        showFirst: function () {
            return this.cur == 1;
        }
    },
    methods:{
        gotoPage(page){
            this.$emit('toPage',page);
        }
    }
}
```

修改模板增加点击事件,在点击时还需过滤掉cur < 0 && cur>all 情况下禁用按钮,但是disabled 属性的原因，:disabled="false"
也将禁用按钮，这不是我们想要的，如果使用这样的姿势 又很奇怪。

```html
<button v-if="showFirst" class="laypage_prev" @click="gotoPage(cur-1)">上一页</button>
<button v-else class="laypage_prev disabled" disabled="disabled">上一页</button>
```
解决方案：
```js
Vue.directive('disabled', function (el, {value}) {
    if (value) {
        el.setAttribute("disabled", 'disabled');
    } else {
        el.removeAttribute("disabled");
    }
});
```
最终：
```html
 <button class="laypage_prev" @click="gotoPage(cur-1)" v-disabled="showFirst">上一页</button>
 <button class="laypage_next" @click="gotoPage(cur+1)" v-disabled="showLast">下一页</button>
```

父组件使用方式：
```vue
<template>
//...
    <paging @toPage="toPage" :cur="page_cur" :all="page_max"></paging>
//..
</template>
import Paging from "page.vue";
export default {
    components: {
        Paging
    },
    methods:{
        async toPage(page_cur) {
            // 向服务器请求的代码
            let data = await api.xxx();
            if (data.code == 0) {

            }
        },
    }
}
```
接着优化代码：增加选页功能
```vue
<template>

<div class="laypage_main laypageskin_yahei">
    <button class="laypage_prev" @click="gotoPage(cur-1)" v-disabled="showFirst">上一页</button>

    <template v-if="isFirstOrLast && cur>=groups">
        <button class="laypage_first" title="首页" @click="btnClick(1)">首页</button>
        <span>…</span>
    </template>
    <template v-if="isPageNumber" v-for="index in indexs" >
        <button v-if="index!=cur" @click="gotoPage(index)">{{index}}</button>
        <span v-else class="laypage_curr">{{index}}</span>
    </template>
    <template v-if="!isPageNumber">
        <span class="laypage_curr">第{{cur}}页</span>
    </template>
    <template v-if="isFirstOrLast && cur<all-less">
        <span>…</span>
        <button class="laypage_last" title="尾页" @click="gotoPage(all)">尾页</button>
    </template>

    <button class="laypage_next" @click="gotoPage(cur+1)" v-disabled="showLast">下一页</button>
</div>

</template>

<script>
export default {
    data: function () {
        return {
            name: '分页组件',
            // groups: 2, //显示分页大小
            less:1
        }
    },
    props:{
        groups: { // 页码分页大小
          type: Number,
          default: 5
        },
        isFirstOrLast:{ // 是否显示首页尾页
            type :Boolean,
            default: true
        },
        isPageNumber: { // 是否显示页码
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
            let left = 1,
                right = this.all,
                ar = [],
                orw = this.groups % 2 ==0;
                this.less = Math.floor(this.groups/2);
            if (this.all >= this.groups + 1) {
                if (this.cur >= this.groups && this.cur < this.all - this.less) {
                    left = this.cur - this.less;
                    right = this.cur + this.less - orw;
                } else {
                    if (this.cur <= this.groups - 1) {
                        left = 1
                        right = this.groups
                    } else {
                        left = this.all - this.groups + 1
                        right = this.all
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left++
            }
            return ar;
        },
        showLast: function () {
            return this.cur == this.all;
        },
        showFirst: function () {
            return this.cur == 1;
        }
    },
    methods: {
        gotoPage(data) { //页码点击事件
            this.$emit('toPage', data);
        }
    }
}
</script>

```

### 其他
皮肤功能没有写
