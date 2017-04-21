import "./static/css/author.less";

import BlobHeader from "components/head.vue";
import BlobFooter from "components/bottom.vue";

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
        }
    },
    components: {
        BlobHeader,
        BlobFooter
    },
    computed: {

    },
    methods: {
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
        $('main').onepage_scroll({
            sectionContainer: '.j-page',
        });
        $("#preloader").fadeOut(1000, () => $("#preloader").remove());
    }
})
