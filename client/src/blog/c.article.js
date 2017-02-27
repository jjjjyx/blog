

import "./static/css/p.less";

import BlobHeader from "../components/head.vue";
import FGotop from "../components/gotop";

const app = new Vue({
    el: '#app',
    data: function() {
        return {
            message:'hello',
            post_content:"",
            editormdView:null,
        }
    },
    components: {
        BlobHeader,
        FGotop
    },
    computed: {

    },
    methods: {

    },
    mounted: function() {
        this.editormdView = editormd.markdownToHTML("article-inner", {
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            emoji           : true,
            taskList        : false,
            tex             : false,  // 默认不解析
            flowChart       : false,  // 默认不解析
            sequenceDiagram : false,  // 默认不解析
        });
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
})
