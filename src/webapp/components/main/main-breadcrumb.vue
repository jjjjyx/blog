<template>
<div class="main__breadcrumb">
    <h3 class="h3">{{last.title}} <small>{{last.name}}</small></h3>
    <Breadcrumb class="">
        <BreadcrumbItem v-for="(item,index) in breadCrumbList" :key="item.name" @click.native="handleSelectRouter(item, index)">
            <font-icon :type="item.icon"></font-icon>{{item.title}}
        </BreadcrumbItem>
    </Breadcrumb>
</div>
</template>

<script>
import _ from 'lodash'
import {mapState} from 'vuex'
export default {
    name: 'main-breadcrumb',
    computed: {
        ...mapState(['breadCrumbList']),
        last: function () {
            return _.last(this.breadCrumbList)
        }
    },
    methods: {
        handleSelectRouter (item,index) {
            if (_.isBoolean(item.isChildren) && !item.isChildren) return
            if (index === this.breadCrumbList.length - 1) return
            this.$router.push({name: item.name})
        }
    }
}
</script>
