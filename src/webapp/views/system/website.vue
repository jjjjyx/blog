<template>
    <div class="curd-container site__warp">
        <div class="site__opts">
            <Button type="success" style="width: 100px" :disabled="!isModify" @click="save" class="mr-2" v-t="'curd.action.save'"></Button>
            <Button type="error" style="width: 100px" :disabled="!isModify" @click="reset" v-t="'curd.action.reset'"></Button>
        </div>
        <!--<div>-->

                <!--{{layout}}-->

        <!--</div>-->
        <div>
            <grid-layout :layout="layout"
                         :col-num="12"
                         :row-height="30"
                         :is-draggable="true"
                         :is-resizable="false"
                         :vertical-compact="true"
                         :use-css-transforms="true"

            >

                <grid-item v-for="item in layout" :key="item.i"
                           class="ivu-card ivu-card-bordered ivu-card-dis-hover"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :i="item.i"
                           drag-allow-from=".vue-draggable-handle"
                           drag-ignore-from=".no-drag"
                >

                    <h4 class="vue-draggable-handle ivu-card-head">{{siteLayout[item.i].name}}</h4>
                    <Form :model="formTop" label-position="top" class="no-drag ivu-card-body">
                        <FormItem v-for="key in siteLayout[item.i].items" :key="key">
                            <h3 slot="label">{{siteMap[key].text}}</h3>
                            <small slot="label">{{siteMap[key].textSmall}}</small>
                            <Input v-model="siteMap[key].value"/>
                        </FormItem>
                    </Form>
                </grid-item>
            </grid-layout>
        </div>
    </div>
</template>

<script>
// import {mapState} from 'vuex'
import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import cloneDeep from 'lodash/cloneDeep'
import api from '@/utils/api'
import {GridItem, GridLayout} from 'vue-grid-layout'
// ResponsiveGridLayout
// mapState, mapActions,

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference (object, base) {
    return transform(object, function (result, value, key) {
        if (!isEqual(value, base[key])) {
            result[key] = (isObject(value) && isObject(base[key])) ? difference(value, base[key]) : value
        }
    })
}

const siteLayout = {
    index: {
        name: '首页设置',
        key: 'index',
        items: []
    },
    siteKey: {
        name: '站点设置',
        key: 'siteKey',
        items: ['title', 'description', 'copyright']
    },
    searchKey: {
        name: '搜索设置',
        key: 'searchKey',
        items: ['metaKey', 'metaDescription', 'baiduVerification', 'googleVerification', 'statistical']
    },
    other: {
        name: '其他设置',
        key: 'other',
        items: ['CDN', 'iconUrl', 'colorIconUrl', 'name', 'sign', 'background']
    },
    sidebar: {
        name: '侧边栏设置',
        key: 'sidebar',
        items: ['homeSideModel', 'categorySideModel', 'hotPostNum', 'lastPostNum', 'superiorPostNum']
    }
}

export default {
    name: 'site',
    components: {GridItem, GridLayout},
    data () {
        //  'metaDescription', 'metaKey'
        // let layout =  []
        // let x = 0
        // let y = 0
        // for (let item in siteLayout) {
        //     x+=1
        //     y+=3
        //     layout.push({
        //         "x": x, "y": y, "w": 4, "h": 3, "i": item
        //     })
        // }
        return {
            formTop: {},
            isModify: false,
            siteMap: cloneDeep(this.$store.state.siteMap),
            siteLayout,
            // layout: layout
            layout: [
                {'x': 0, 'y': 0, 'w': 3, 'h': 3, 'i': 'index', 'moved': false},
                {'x': 3, 'y': 0, 'w': 3, 'h': 9, 'i': 'siteKey', 'moved': false},
                {'x': 6, 'y': 0, 'w': 3, 'h': 13, 'i': 'searchKey', 'moved': false},
                {'x': 9, 'y': 0, 'w': 3, 'h': 15, 'i': 'other', 'moved': false},
                {'x': 0, 'y': 3, 'w': 3, 'h': 13, 'i': 'sidebar', 'moved': false}
            ]
        }
    },
    computed: {
        // ...mapState({
        //     'siteMap': state => state.siteMap
        // })
        // siteSetting:
    },
    methods: {
        reset () {
            this.siteMap = cloneDeep(this.$store.state.siteMap)
        },
        async save () {
            let diff = difference(this.siteMap, this.$store.state.siteMap)
            for (let key in diff) {
                diff[key] = diff[key].value
            }
            try {
                await api.npost('/api/site/update', diff)
                this.$Message.info('保存成功')
                this.$store.commit('updateSite', diff)
                this.siteMap = cloneDeep(this.$store.state.siteMap)
            } catch (e) {
                this.$Message.error(e.message)
            }
        }
    },
    watch: {
        siteMap: {
            handler: function (val) {
                this.isModify = !isEqual(val, this.$store.state.siteMap)
            },
            deep: true
        }
    }
}
</script>

<style>

    .vue-resizable-handle {
        z-index: 5000;
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        padding: 0 3px 3px 0;
        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=') no-repeat bottom right;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: se-resize;
    }

    .vue-grid-item:not(.vue-grid-placeholder) {
        overflow: hidden;
        /*background: #ccc;*/
        /*border: 1px solid black;*/
    }

    .vue-grid-item.resizing {
        opacity: 0.9;
    }

    .vue-grid-item.static {
        background: #cce;
    }

    .vue-grid-item .text {
        font-size: 24px;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 100%;
        width: 100%;
    }

    .vue-grid-item .no-drag {
        height: 100%;
        width: 100%;
    }

    .vue-grid-item .minMax {
        font-size: 12px;
    }

    .vue-grid-item .add {
        cursor: pointer;
    }

    /*.vue-draggable-handle {*/
        /*position: absolute;*/
        /*width: 20px;*/
        /*height: 20px;*/
        /*top: 0;*/
        /*left: 0;*/
        /*padding: 0 8px 8px 0;*/
        /*background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat bottom right;*/
        /*background-origin: content-box;*/
        /*box-sizing: border-box;*/
        /*cursor: pointer;*/
    /*}*/
</style>
