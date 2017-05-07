import "./static/css/author.less";

import BlobHeader from "components/head.vue";
import BlobFooter from "components/bottom.vue";
import FCopyright from "components/copyright.vue";
import FWeiModel from "components/weimodel.vue";

import BlobToInsert from "./author/to-insert.vue";
import BlobSkill from "./author/skill.vue";
// import BlobFront from "./author/front.vue";
// import BlobPlugin from "./author/plugin.vue";
// import BlobRear from "./author/rear.vue";
// import BlobServer from "./author/server.vue";


const app = new Vue({
    el: '#app',
    // delimiters:['[[%','%]]'],
    data: function() {
        return {
            message: 'hello',
            headersHeight: 50,
            animationTime: 800,
            deltaOfInterest: null,
            lastAnimation: null,
            active: 0,
            // toInsert: ['blob-front','blob-rear','blob-plugin','blob-server','blob-editor'],
            // active: 'blob-rear'
        }
    },
    components: {
        BlobHeader,
        BlobFooter,
        BlobToInsert,
        BlobSkill,
        FCopyright,
        FWeiModel
        // BlobEditor,
        // BlobFront,
        // BlobPlugin,
        // BlobRear,
        // BlobServer
    },
    computed: {

    },
    methods: {
        navBg (){
            $(".am-topbar>.am-container").toggleClass("active");
        },

        // mousewheel(event,delta){
        //     this.deltaOfInterest = delta;
        //     let timeNow = new Date().getTime();
        //     // Cancel scroll if currently animating or within quiet period
        //     if(timeNow - this.lastAnimation < 500 + this.animationTime) {
        //         event.preventDefault();
        //         return;
        //     }
        //
        //     if (this.deltaOfInterest < 0) {
        //         this.active+=1;
        //         this.moveDown()
        //         console.log("down")
        //     } else {
        //         this.active-=1;
        //         this.moveUP()
        //         console.log("up")
        //     }
        //     this.lastAnimation = timeNow;
        // },
        // moveDown(){
        //     let maxLength = $('main .j-page').length;
        //     console.log(this.active<=maxLength)
        //     if(this.active<=maxLength){
        //         $("html, body").animate({
        //          scrollTop: $('main .j-page').eq(this.active).offset().top+ "px"
        //        }, {
        //          duration: 500,
        //          easing: "swing"
        //        });
        //     }
        //
        // },
        // moveUP(){},
    },
    mounted: function() {
        // let setH = ()=> $('main .j-page').height($(window).height()-this.headersHeight);
        // setH();
        // $(window).resize(setH);
        //
        const refanimated = function(index){
            const d = $(`main .j-page:eq(${index}) [data-animated]`);
            d.each(function(){
                const className = $(this).data('animated');
                $(this).addClass(className).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                  $(this).removeClass(className);
                });
            })
        }
        const addActive = function(index){
            $(`.col-half a`).removeClass('active')
            $(`.col-half a[href='#${index}']`).addClass('active')
            $(`main .j-page .j-fp-con`).hide();
            console.log(`main .j-page:eq(${index-1}) .j-fp-con`)
            $(`main .j-page:eq(${index-1}) .j-fp-con`).show();
        }
        $('main').onepage_scroll({
            sectionContainer: '.j-page',
            loop:false,
            afterMove(index){
                addActive(`${index}`)
                refanimated(index-1)
            }
        });
        let id = (window.location.hash || "#1").replace("#",'')*1;
        addActive(id)
        refanimated(id-1)
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
        $(".col-half a").click(function (){
            $(`.col-half a`).removeClass('active')
            $(this).addClass("active")
            const id = $(this).attr('href').replace("#",'');
            $('main').moveTo(id);
        })
    }
})
