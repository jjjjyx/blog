<template>
    <div class="ivu-card ivu-card-bordered">
        <div class="ivu-card-head item">
            <slot name="title"></slot>
        </div>
        <div class="ivu-card-extra">
            <Button type="text" size="small" :icon="showBody?'arrow-up-b':'arrow-down-b'" @click.prevent="toggleBody"></Button>
        </div>
        <collapse-transition>
            <div class="ivu-card-body" v-show="showBody">
                <slot></slot>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import CollapseTransition from '@/utils/collapse-transition'

export default {
    components: {
        CollapseTransition
    },
    data: () => {
        return {
            showBody: true
        }
    },
    methods: {
        toggleBody: function () {
            this.showBody = !this.showBody
        }
    }
}
</script>
