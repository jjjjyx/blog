<template>
<div class="j-fp-content">
    <div class="j-fp-content-block" @mouseover="mouseover(item)" v-for="(item,index) in obj" :class="{active:active==item.name}" :data-animated="index%2?'slideInDown':'slideInUp'">
        <div class="j-unit-box">
            <!-- 概览 -->
            <div class="j-pt-overview">
                <div class="j-pt-overview-name">
                    <i class="iconfont" :class="item.icon"></i>
                    <h3>{{item.title}}</h3>
                </div>
                <div class="j-pt-overview-sub-menu">
                    <li v-for="i in item.subMenu.slice(0,3)">
                        <div class="j-title">{{i.title}}</div>
                    </li>
                    <li>
                        <div class="j-title">...</div>
                    </li>
                </div>
            </div>
            <!-- 详细 -->
            <div class="j-pt-detail">
                <div class="j-pt-detail-name">
                    <i class="iconfont" :class="item.icon"></i>
                    <h3>{{item.title}}</h3>
                </div>
                <div class="j-pt-detail-sub-menu">
                    <li v-for="i in item.subMenu">
                        <div class="j-title">{{i.title}}</div>
                        <div class="des">
                            <div class="j-des-text">{{i.des}}
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data: function() {
        return {
            obj:[
                {
                    name:'front',
                    title:'前端',
                    icon:'icon-qianduan',
                    subMenu:[
                        {
                            title:'amaze ui',
                            des:'这当中就包含了jquery 以及一些常用网页组件。我表示喜欢妹子ui 的工具类模块，可以少写很多样式代码'
                        },
                        {
                            title:'vue',
                            des:'数据同步视图，写前端是很方便。以及组件化也是很不错。'
                        },
                        {
                            title:'vuex+vue-router',
                            des:`单页应用组合拳，比如我的后台管理就是使用的单页应用技术。`
                        },
                        {
                            title:'其他小件',
                            des:`animate.css 动画库;editormd marked编辑器;lodash JavaScript 工具库;
                            keyboardjs 绑定快捷键;iconfont 图标库;less;es6;
                            `
                        }
                    ]
                },
                {
                    name:'rear',
                    title:'后端',
                    icon:'icon-houduankaifa',
                    subMenu:[
                        {
                            title:'nodejs',
                            des:`后端采用的是nodejs 开发，
                            在^7.0以上版本加入了async/await 的支持，告别了层层回调。`
                        },
                        {
                            title:'express',
                            des:'基于nodejs的框架，能够快速的创建web应用'
                        },
                        {
                            title:'mysql',
                            des:'小巧，灵活，跨平台的一个关系型数据库管理系统。'
                        },
                        {
                            title:'其他小件',
                            des:`jsonwebtoken 登录token的实现;objectid-js id 序列号;bcryptjs 加密;
                            moment 时间日期格式化;redis ..等`
                        },
                    ]
                },
                {
                    name:'plugin',
                    title:'自动化构建-环境',
                    icon:'icon-kaifahuanjing',
                    subMenu:[
                        {
                            title: 'webpack',
                            des: `webpack+vue 经典套路，为了学习，我并没有使用vue-cli 来自动生成项目，
                            而是我手动构建。`
                        },
                        {
                            title: '博客展示-服务端渲染',
                            des: `博客的展示需要使用服务端渲染，所以单页面是不可行的。
                            最开始对力量一无所知的用单页做了好多了才想起来做SEO。(╥╯﹏╰╥)ง`
                        },
                        {
                            title: '后台管理-前后端分离',
                            des: `别跟我说搞这么复杂，我是为了学习，我爱学习，学习使我快乐。我就是想要做单页应用`
                        },
                        {
                            title: '凑个数',
                            des:'手持两把锟斤拷，口中疾呼烫烫烫。脚踏千朵屯屯屯，笑看万物锘锘锘。'
                        }
                    ]
                },
                {
                    name:'server',
                    title:'服务器',
                    icon:'icon-fuwuqi',
                    subMenu:[
                        {
                            title: '腾讯云',
                            des: '学生党首选腾讯云一元服务器~, 吧没钱说的很漂亮，讲道理使用hexo+github或者coding 来搭建也蛮不错'
                        },
                        {
                            title: '七牛云',
                            des: '博客这么多图片，不用cdn 自己的服务器滋水枪怎么撑的住！怎么撑得住！怎么撑得住！'
                        },
                        {
                            title: 'coding',
                            des: '由于不想开源，所以代码托管在coding私有项目，等想开源了在迁移。'
                        }
                    ]
                },
                {
                    name:'editor',
                    title:'编辑器',
                    icon:'icon-atom',
                    subMenu:[
                        {
                            title: 'atom',
                            des:`大爱Atom ,最开始用我是拒绝的，因为这个编辑很空壳，啥都没有。
                            但是发现了插件功能，并且社区中的插件非常多，经过简单改装后简直鸟枪换大炮~
                            `
                        },
                        {
                            title: '插件清单',
                            des: '这个好麻烦，回头加个链接到文章中说明'
                        }
                    ]
                }
            ],
            active: 'rear'
        }
    },
    components: {},
    computed: {

    },
    methods: {
        mouseover(item){
            this.active = item.name;
        }
    },
    mounted: function() {

    }
}
</script>
