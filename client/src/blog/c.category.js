import "./static/css/category.less";

import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";


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
    }
})
