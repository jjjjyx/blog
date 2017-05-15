import "./static/css/category.less";

import BlobHeader from "components/head.vue";
import BlobFooter from "components/bottom.vue";
import "jquery-stickit/build/jquery.stickit.min";

const app = new Vue({
    el: '#app',
    data: function() {
        return {
            message:'hello',
            loading:false,
            noPost :true,
        }
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    computed: {

    },
    methods: {
        async loadMore(){

        }
    },
    mounted: function() {
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
        $('.sidebar').stickit && $('.sidebar').stickit({screenMinWidth: 641})
    }
})
