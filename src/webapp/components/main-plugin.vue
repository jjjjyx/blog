<template>
    <div class="main__plugin">
        <Poptip placement="left-start" width="300">
            <Icon type="ios-settings" class="plugin__btn"></Icon>
            <div class="plugin-opts" slot="content">
                <h6 class="plugin-opts__title">siderbar color</h6>
                <div class="plugin-opts__item">
                    <span v-for="color in sidebarFilters" :class="['badge', 'badge-'+ color]" :key="color"></span>
                </div>
                <h6 class="plugin-opts__title">siderbar background</h6>
                <div class="plugin-opts__item">
                    <span v-for="color in sidebarBackground" :class="['badge', 'badge-'+ color]" :key="color"></span>
                </div>
                <div class="plugin-opts__item plugin-opts__item--between">
                    <span>siderbar mini</span>
                    <i-Switch ></i-Switch>
                </div>
                <div class="plugin-opts__item plugin-opts__item--between">
                    <span>siderbar image</span>
                    <i-Switch ></i-Switch>
                </div>
                <h6 class="plugin-opts__title">images</h6>
                <div class="plugin-opts__item clearfix">
                    <div class="image-item ">
                        <a href="javascript:;">
                            <img src="http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg" alt="img-1">
                        </a>
                    </div>
                    <div class="image-item ">
                        <a href="javascript:;">
                            <img src="http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg" alt="img-1">
                        </a>
                    </div>
                    <div class="image-item ">
                        <a href="javascript:;">
                            <img src="http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg" alt="img-1">
                        </a>
                    </div>
                    <div class="image-item ">
                        <a href="javascript:;">
                            <img src="http://oht47c0d0.bkt.clouddn.com/sidebar-1.jpg" alt="img-1">
                        </a>
                    </div>
                </div>
            </div>
        </Poptip>
    </div>
</template>

<script>
export default {
    name: 'main-plugin',
    data () {
        return {
            sidebarFilters: [
                'purple',
                'blue',
                'green',
                'orange',
                'rose',
                'red'
            ],
            sidebarBackground: [
                'black',
                'white',
                'red'
            ]
        }
    }
}
</script>
