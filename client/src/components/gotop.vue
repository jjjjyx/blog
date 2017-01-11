<template>
    <div class="gotop" id="gotop" >
        <transition name="rotate" enter-active-class="animated rollIn" leave-active-class="animated zoomOutRight">
            <a href="#top" title="回到顶部" class="icon-btn fa fa-arrow-up" id="amz-go-top" @click="goTop" v-show="isGoTopShow"></a>
        </transition >
        <a href="javascript:;" title="不知道为什么就想放个代码符合在这里" class="icon-faq icon-btn fa fa-code"></a>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            isGoTopShow:false
        }
    },

    methods: {
        goTop (e) {
            e.preventDefault();
            $("html, body").animate({scrollTop: 0}, 500,'swing');
        }
    },
    mounted: function(){
        $(document).scroll(() => {
            let s = $(document).scrollTop();
            this.isGoTopShow = s > 10;
        });
    }
}
</script>
