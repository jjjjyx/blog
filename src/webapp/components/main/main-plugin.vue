<template>
    <div class="main__plugin">
        <Poptip placement="left-start" width="300">
            <Icon type="ios-settings" class="plugin__btn"></Icon>
            <div class="plugin-opts" slot="content">
                <h6 class="plugin-opts__title">siderbar color</h6>
                <div class="plugin-opts__item">
                    <span v-for="color2 in sidebarColors" :class="['badge', 'badge-'+ color2, {'active': color === color2}]" :key="color2"  @click="switchColor(color2)"></span>
                </div>
                <h6 class="plugin-opts__title">siderbar background</h6>
                <div class="plugin-opts__item">
                    <span v-for="color in sidebarBackgroundColors" :class="['badge', 'badge-'+ color, {'active': backgroundColor === color}]" :key="color"  @click="switchBackgroundColor(color)"></span>
                </div>
                <div class="plugin-opts__item plugin-opts__item--between">
                    <span>siderbar mini</span>
                    <i-Switch v-model="collapsed"></i-Switch>
                </div>
                <div class="plugin-opts__item plugin-opts__item--between">
                    <span>siderbar image</span>
                    <i-Switch v-model="image"></i-Switch>
                </div>
                <h6 class="plugin-opts__title">images</h6>
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
    </div>
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
                'http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg',
                'http://oht47c0d0.bkt.clouddn.com/sidebar-2.jpg',
                'http://oht47c0d0.bkt.clouddn.com/sidebar-3.jpg',
                'http://oht47c0d0.bkt.clouddn.com/sidebar-4.jpg'
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
