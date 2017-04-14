import "./static/css/author.less";

import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";

const app = new Vue({
    el: '#app',
    // delimiters:['[[%','%]]'],
    data: function() {
        return {
            message: 'hello',
            headersHeight:50
        }
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    computed: {

    },
    methods: {},
    mounted: function() {
        let setH = ()=> $('main .j-page').height($(window).height()-this.headersHeight);
        setH();
        $(window).resize(setH);

        // $('main').onepage_scroll({
        //     sectionContainer: '.page',
        //     updateURL: true,
        //     loop: false,
        //     responsiveFallback:function(){
        //         console.log(111);
        //         return false;
        //     },
        //     afterMove:(index)=>{
        //         console.log(index);
        //     }
        // });
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
})
