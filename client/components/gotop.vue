<template>
    <transition name="rotate" enter-active-class="animated rollIn" leave-active-class="animated zoomOutRight">
        <a href="#top" title="回到顶部" class="icon-btn am-icon-arrow-up" id="amz-go-top" @click="goTop" v-show="isGoTopShow"></a>
    </transition >
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
