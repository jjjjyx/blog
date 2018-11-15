<template>
    <Modal transfer v-model="modalVisible" title="失效图片" width="90">
        <curd class="invalid-curd-warp"
            :name="name"
            :columns="columns"
            :data="data"
            :fetch="() => {}"
            :deleteAction="deleteImage"
            :page-size="10"
            ref="curd"
        >
            <!--todo 顶部的工具部分被屏蔽，导致这个显示不出来  批量删除很关键-->
            <template slot="form-buttons" slot-scope="scope">
                <i-button icon="md-trash" :disabled="scope.selectedNum === 0" @click="deleteImage(scope.selectedList)">删除</i-button>
            </template>
        </curd>

        <!--<Collapse simple>-->
            <!--<Panel :name="k" v-for="(v, k) in data" :key="k">-->
                <!--{{k}}-->
                <!--<p slot="content">-->
                    <!--{{v}}-->
                <!--</p>-->
            <!--</Panel>-->
            <!--<Panel name="2">-->
                <!--斯蒂夫·盖瑞·沃兹尼亚克-->
                <!--<p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>-->
            <!--</Panel>-->
            <!--<Panel name="3">-->
                <!--乔纳森·伊夫-->
                <!--<p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>-->
            <!--</Panel>-->
        <!--</Collapse>-->
    </Modal>
</template>

<script>
    import differenceBy from 'lodash/differenceBy'
	import Curd from '../../components/curd/curd'
    import {dateFormat} from '../../utils/common'
    import * as media from '../../api/media'
    const renderDate = function (h, {row}) {
        return [dateFormat(row.createdAt)]
    }
    export default {
		name: 'invalid-image',
        components: {Curd},
        props: {
            visible: {
                type: Boolean,
                required: true
            },
            data: {
                type: Array,
            }
        },
        data () {
            return {
                name: 'invalid',
                modalVisible: this.visible,
                columns: [
                    {type: 'selection', width: 40, align: 'center'},
                    {title: 'ID', key: 'hash'},
                    {title: '文件名称', key: 'name' },
                    {title: '大小', key: 'size' },
                    {title: 'url', key: 'url' },
                    {title: '失效类型', key: 'type', width: 100,},
                    {title: '创建时间', key: 'createdAt', width: 150, render: renderDate.bind(this)},
                    {title: 'action', key: 'action', width: 200, type: 'action'}
                ]
            }
        },
        watch: {
            visible (val) {
                if (val) {
                    this.modalVisible = val
                }
            },
            modalVisible (val) {
                this.$emit('update:visible', val)
            }
        },
        methods: {
            async deleteImage (items) {
                let keys = items.map(item => item.hash)
                console.log(keys)
                try {
                    await media.deleteImg(keys)
                    // if (this.formItem.space !== 'all') {
                    // this.data = difference(this.data, items)
                    // }
                    this.$emit('update:data', differenceBy(this.data, items, 'hash'))
                } catch (e) {
                    this.$Message.info('删除失败')
                }
            }
        }
	}
</script>
