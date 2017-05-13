
// import { Message } from 'element-ui'
import BlobHeader from "components/head.vue"

// import BlobFooter from "components/footer.vue"
import FGotop from "components/gotop";
import FWeiModel from "components/weimodel";
import BlogComment from "components/comment.vue";
// import BlobFooter from "components/bottom.vue"

import { getClientHeight } from "public/js/tools.js"
import "public/js/vue.api"
import * as api from "public/js/api.js"
import "public/js/editormd.extent"
import "public/css/editormd.extent.less"

import "./static/css/article.less"

// Vue.prototype.$message = Message

const app = new Vue({
    el: '#app',
    delimiters: ['[[%', '%]]'],
    data: function () {
        return {
            message: 'hello',
            post_contentLength: 0,
            editormdView: null,
            aside: false,
            showPostDirectory:true,
            guid:'',
            banHeart:true
        }
    },
    components: {
        BlobHeader,
        FGotop,
        FWeiModel,
        BlogComment
    },
    computed: {

    },
    methods: {
        togglehead(s) {
            this.aside = s;
            // console.log(111);
        },
        togglePostDirectory (){
            this.showPostDirectory = !this.showPostDirectory;
        },
        heart(event){
            if(this.banHeart){
                api.heart(this.guid).then((data)=>{
                    if(data.code!=0) layer.msg('您已经赞过了,实在喜欢就分享一下吧~')
                    else if(data.code==0) {
                        if(this.$refs.heart){
                            const span = $(this.$refs.heart).addClass("active").find("span")
                            span.text(span.text()*1+1);
                            this.banHeart = false;
                        }
                    }
                });
            }
            let i = $("<i>").addClass("am-icon-heart nono-user-select");
            i.css({
                'position': 'absolute',
                'z-index': '98999',
                'color': 'rgb(233,79,6)',
                'font-size': '13px',
                'top':`${event.pageY}px`,
                'left':`${event.pageX}px`,
            }).appendTo($('body')).animate({
                top:`${event.pageY-100}px`,
                opacity: 0,
            },1200,function(){$(this).remove()})

            // .addClass("am-animation-slide-top am-animation-reverse").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            //     $(this).remove()
            // });
        },
        share(){
            // api.share(this.guid);
        }
    },
    mounted: function () {
        this.guid = this.$refs.guid.value;
        const img = new Image();
        img.src = "http://oht47c0d0.bkt.clouddn.com/ba5d1c60-3192-11e7-bcd4-93a9b0d59ff6.png?imageView2/0/w/1000/format/jpg";
        img.onload = ()=> {
            this.$refs.leftWrapper.style.backgroundImage = `url(${img.src})`;
        }
        editormd.emoji.path = "http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/";
        this.editormdView = editormd.markdownToHTML("article-inner", {
            htmlDecode: "style,script,iframe", // you can filter tags decode
            emoji: true,
            taskList: true,
            tex: false, // 默认不解析
            flowChart: false, // 默认不解析
            sequenceDiagram: false, // 默认不解析
            tocm: true, // Using [TOCM]
            tocContainer: "#custom-toc-container", // 自定义 ToC 容器层
            // onload          :function(){
            //     console.log(111);
            // }
        });
        this.post_contentLength = $("#article-inner").text().replace(/ /g, '').length;
        // 总滚动条高度-可视高度 - 底部高度 大于此值 将目录上移
        // let kh = getClientHeight();
        let bh = 388;
        let falg = true;
        $(document).scroll(() => {
            const kh = getClientHeight()
            const zh = document.body.scrollHeight
            const s = $(document).scrollTop()
            // console.log(s);
            bh = $(".footer").outerHeight() + $(".copyright").outerHeight()
            if (falg && s > 200) {
                falg = false
                api.read(this.guid)
            }
            // if (s > (zh - kh - bh)) {
            //     if (this.$refs['article-tocm']) {
            //         $(this.$refs['article-tocm']).css({
            //             top: `${- (s - (zh - kh - bh))}px`
            //         })
            //     }
            // } else if (this.$refs['article-tocm']) {
            //     $(this.$refs['article-tocm']).css({
            //         top: '0px'
            //     })
            // }
        })
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
})
