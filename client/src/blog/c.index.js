// import "lodash";

import "./static/css/index.less";

// import VueResource from "vue-resource"

// Vue.use(VueResource);
Vue.config.errorHandler = function(err, vm) {
    console.log(err, vm);
}

// Vue.http.options.emulateJSON = true;

import "../../public/js/vue.api.js"
import * as api from "../../public/js/api.js"
import keyboardJS from "keyboardjs"

import BlobHeader from "../components/head.vue";
import BlobFooter from "../components/bottom.vue";

const app = new Vue({
    el: '#app',
    data: () => {
        return {
            list:[],
            enabled:false,
            keyword:'',
            loading:false,
            noPost :true,
        }
    },
    // store,
    computed: {

    },
    components: {
        BlobHeader,
        BlobFooter
    },
    methods: {
        mouseover(){
            this.enabled = true;
            this.keyword = '';
            keyboardJS.setContext('login');
            this.$nextTick(()=>{
                this.$refs.login.focus();
            })
        },
        mouseout(){
            keyboardJS.setContext('default');
            this.enabled = false;
        },
        async loadMore(){
            this.loading = true;
            let hasloadId = $("article[data-node-id]",this.$refs.articleList).map((e,el)=>$(el).data('node-id')).get();
            let pg = 0;
            let data = await api.loadArticleList({hasloadId,pg});
            if(data!='没有更多了'){
                $(this.$refs.articleList).append(data);
            }else{
                this.noPost = false;
            }

            this.loading = false;
        }
    },
    mounted: function() {
        // let dl = $("#datali");
        // this.$refs.articleList.innerHTML = dl.html();
        // dl.remove();
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
        let self = this;
        keyboardJS.withContext('login', function() {
            keyboardJS.bind('enter', (e)=> {
                api.login(...self.keyword.split(' ')).then(({code,msg})=>{
                    if(code==0){
                        layer.alert(msg);
                    }
                })
            });
        });

    }
})
