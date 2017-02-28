

import "./static/css/p.less";

import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";
import {getClientHeight} from "../../public/js/tools.js";

const app = new Vue({
    el: '#app',
    data: function() {
        return {
            message:'hello',
            post_content:"",
            editormdView:null,
            aside:false,
        }
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    computed: {

    },
    methods: {
        togglehead(s){
            this.aside = s;
            // console.log(111);
        }
    },
    mounted: function() {
        editormd.emoji.path = "http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/";
        this.editormdView = editormd.markdownToHTML("article-inner", {
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            emoji           : true,
            taskList        : false,
            tex             : false,  // 默认不解析
            flowChart       : false,  // 默认不解析
            sequenceDiagram : false,  // 默认不解析
            tocm            : true,    // Using [TOCM]
            tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层

        });
        // 总滚动条高度-可视高度 - 底部高度 大于此值 将目录上移
        // let kh = getClientHeight();
        let bh = 388;
        $(document).scroll(() => {
            let kh = getClientHeight();
            let zh = document.body.scrollHeight;
            let s = $(document).scrollTop();
            if(s>(zh-kh-bh)){
                if(this.$refs['article-tocm']){
                    $(this.$refs['article-tocm']).css({
                        top:-(s-(zh-kh-bh))+'px'
                    })
                }
            }
        })
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
})
