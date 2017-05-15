// import "lodash";

import "./static/css/index.less";

// import VueResource from "vue-resource"

// Vue.use(VueResource);
Vue.config.errorHandler = function(err, vm) {
    console.log(err, vm);
}

// Vue.http.options.emulateJSON = true;

import "public/js/vue.api.js"
import * as api from "public/js/api.js"
import keyboardJS from "keyboardjs"
import {getClientHeight} from "public/js/tools.js";
import BlobHeader from "components/head.vue";
import BlobFooter from "components/bottom.vue";
import "jquery-stickit/build/jquery.stickit.min";

const app = new Vue({
    el: '#app',
    data: () => {
        return {
            list:[],
            enabled:false,
            keyword:'',
            loading:false,
            noPost :true,
            page:1,
            activeDom:'articleList'
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
                this.$refs.h.focus();
                this.$refs.h.select();
            })
        },
        mouseout(){
            keyboardJS.setContext('default');
            this.enabled = false;
        },
        async loadMore(){
            this.loading = true;
            // let hasloadId = $("article[data-node-id]",this.$refs.articleList).map((e,el)=>$(el).data('node-id')).get();
            this.page+=1;
            let data = await api.loadArticleList({page:this.page,slug:this.activeDom=='articleList'?'':this.activeDom});
            if(data.code==0&&data.data) {
                this.$refs[this.activeDom].innerHTML =this.$refs[this.activeDom].innerHTML+data.data;
            }else{
                this.noPost = false
            }
            this.loading = false;
        },
        async open(dom = 'articleList'){
            this.loading = true;
            this.activeDom = dom;
            this.$refs[dom].innerHTML = '';
            this.page = 1;
            let data = await api.loadArticleList({page:this.page,slug:dom});
            if(data.code==0) {
                $('.j-article-placeholder').hide();
                this.$refs[dom].innerHTML = data.data;
                // $(".am-tab-panel.am-active").removeClass('am-active');
                // $(this.$refs[dom]).addClass("am-active")
            }
            this.loading = false;
            // this.bindScrollspy();
        },
        bindScrollspy(){
            $('.j-article-placeholder').scrollspy().on('inview.scrollspy.amui', ()=> {
                setTimeout(()=>{
                    this.loadMore()
                    $('.j-article-placeholder').remove()
                },900);

            })
        }

    },
    mounted: function() {
        $("#preloader").fadeOut(1500, () => $("#preloader").remove());
        let self = this;
        keyboardJS.withContext('login', function() {
            keyboardJS.bind('enter', (e)=> {
                api.login(...self.keyword.split(' ')).then(({code,msg})=>{
                    if(code==0){
                        layer.msg(msg);
                    }
                })
            });
        });
        // 分类跑马灯
        let tagHover = ()=>{
            let next = $(".tag.active").removeClass('active').next('.tag');
            if(!next.length){
                next = $(".tag:eq(0)")
            }
            next.addClass("active");
        }
        setInterval(tagHover,1000);
        // $(".tag>a:eq(0)").addClass("")
        $(this.$refs.tabs).find('a').on('opened.tabs.amui', function(e){
            // console.log('[%s] 选项卡打开了', $(this).text());
            self.open($(this).data('slug'))
        })
        this.bindScrollspy();
        $('.sidebar').stickit({screenMinWidth: 641})
    }
})
