<template>
    <div>
        <div class="row">
            <div class="am-u-sm-12 am-u-md-12 am-u-lg-9">
                <div class="page-header-heading"><span class="am-icon-home page-header-heading-icon"></span> {{meta.name}} <small>{{meta.sub}}</small></div>
                <p class="page-header-description">{{meta.description}}</p>
            </div>
            <!-- <div class="am-u-lg-3 tpl-index-settings-button">
                <button type="button" class="page-header-button"><span class="am-icon-paint-brush"></span> 设置</button>
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {
        meta(){
            return this.$route.meta ||{}
        }
    },
    methods: {

    },
    mounted: function() {
        console.log(this.$route)
    }
}
</script>
