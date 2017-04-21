import "./static/css/archives.less";

import BlobHeader from "components/head.vue";
import BlobFooter from "components/bottom.vue";


const app = new Vue({
    el: '#app',
    data: function() {
        return {
            message:'hello',
        }
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    computed: {

    },
    methods: {
    },
    mounted: function() {

        $("#preloader").fadeOut(1000, () => $("#preloader").remove());

        if(window.location.hash){
            let index=window.location.hash.replace("#", "")
            $("html, body").animate({
             scrollTop: $(window.location.hash).offset().top-120 + "px"
           }, {
             duration: 500,
             easing: "swing"
           });

        }
    }
})
