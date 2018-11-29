<template>

    <Poptip placement="left-start" width="300">
        <Icon type="ios-settings" class="plugin__btn"></Icon>
        <div class="plugin-opts" slot="content">
            <h6 class="plugin-opts__title">{{$t('plugin.color')}}</h6>
            <div class="plugin-opts__item">
                <span v-for="color2 in sidebarColors" :class="['badge', 'badge-'+ color2, {'active': color === color2}]" :key="color2"  @click="switchColor(color2)"></span>
            </div>
            <h6 class="plugin-opts__title">{{$t('plugin.background')}}</h6>
            <div class="plugin-opts__item">
                <span v-for="color in sidebarBackgroundColors" :class="['badge', 'badge-'+ color, {'active': backgroundColor === color}]" :key="color"  @click="switchBackgroundColor(color)"></span>
            </div>
            <div class="plugin-opts__item plugin-opts__item--between">
                <span>{{$t('plugin.mini')}}</span>
                <i-Switch v-model="collapsed"></i-Switch>
            </div>
            <div class="plugin-opts__item plugin-opts__item--between">
                <span>{{$t('plugin.image')}}</span>
                <i-Switch v-model="image"></i-Switch>
            </div>
            <h6 class="plugin-opts__title">{{$t('plugin.images')}}</h6>
            <div class="plugin-opts__item clearfix">
                <div class="image-item" v-for="(img, index) in sidebarBackgroundImages" :key="index" :class="{'active': backgroundImage === img}" @click="switchBackgroundImage(img)">
                    <a href="javascript:;">
                        <img :src="img" alt="img-1">
                    </a>
                </div>

            </div>
            <!--{{$store.state.sidebar}}-->
        </div>
    </Poptip>

</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    name: 'main-plugin',
    data () {
        return {
            sidebarColors: [
                'purple',
                'blue',
                'green',
                'orange',
                'rose',
                'red'
            ],
            sidebarBackgroundColors: [
                'black',
                'white',
                'blue',
                'red'
            ],
            sidebarBackgroundImages: [
                'https://image.cdn.mbdoge.cn/sidebar-1.jpg',
                'https://image.cdn.mbdoge.cn/sidebar-2.jpg',
                'https://image.cdn.mbdoge.cn/sidebar-3.jpg',
                'https://image.cdn.mbdoge.cn/sidebar-4.jpg'
            ]
        }
    },
    computed: {
        ...mapState({
            'image': state => state.sidebar.image,
            'backgroundColor': state => state.sidebar.backgroundColor,
            'backgroundImage': state => state.sidebar.backgroundImage,
            'color': state => state.sidebar.color
        }),
        collapsed: {
            get () {
                return this.$store.state.sidebar.collapsed
            },
            set (value) {
                this.$store.commit('TOGGLE_SIDEBAR_MINI', value)
            }
        },
        image: {
            get () {
                return this.$store.state.sidebar.image
            },
            set (value) {
                this.$store.commit('TOGGLE_SIDEBAR_IMAGE', value)
            }
        }
    },
    methods: {
        ...mapMutations(['switchColor', 'switchBackgroundColor', 'switchBackgroundImage'])
        // switchSidebar () {
        //
        // }
    }
}
</script>
