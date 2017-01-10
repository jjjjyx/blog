<template>
<div id="app">
    <blob-header></blob-header>
    <!-- #masthead -->
    <div class="blank"></div>

    12312312 {{msg}}

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import store from "./store/index";
import BlobHeader from "../components/head.vue";

// import Head from "../components/head";


export default {
    data: () => {
        return {
            msg:"hello world"
        }
    },
    store,
    computed: {
        ...mapGetters([
            'user'
        ]),
    },
    components: {
        BlobHeader
    },
    methods: {
        ...mapActions([
            'userSignout'
        ])
    },
    mounted: function () {

    }
}
</script>
