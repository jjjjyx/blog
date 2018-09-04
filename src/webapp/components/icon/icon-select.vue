<template>
<div class="icon-select-panel" transfer style="overflow: hidden;">
    <row class="icon-select__header" type="flex" justify="center" align="middle">
        <i-col span="16">
            <h4 class="">选择图标</h4>
        </i-col>
        <i-col span="8">
            <Form :label-width="0" inline class="filter-form" @submit.native.prevent="searchIcon">
                <FormItem >
                    <Input v-model="iconKey" size="small" placeholder="搜索图标" clearable/>
                </FormItem>
                <FormItem>
                    <Button type="primary" size="small" icon="ios-search" @click="searchIcon"></Button>
                </FormItem>
            </Form>
        </i-col>
    </row>
    <hr>
    <Tabs size="small" type="card" class="icon-select__body cm-tabs-style">
        <TabPane :label="group.label" v-for="(group, index) in groups" :key="index" class="icon-select__tab">
            <li v-for="icon in filterByTag(group.icons)" :key="icon.type" class="icon-select-icon__item" @click="handleClickIcon(icon)">
                <font-icon :type="icon.type"></font-icon>
                <div class="name">{{icon.name}}</div>
                <div class="fontclass">{{icon.type}}</div>
            </li>
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import icons from './icon.json'
import _ from 'lodash'
// 转换icon 兼容2 种形式
// http://v2.iviewui.com/dist/22.0ca0216960fcc1cd7e27.chunk.js
// JSON.stringify(temp1.map(item=> {delete item.show_svg;delete item.path_attributes;return item}))

/*

item1 = {
    'id': 4879555,
    'name': '文章',
    'project_id': 717716,
    'projectId': 717716,
    'unicode': '59246',
    'font_class': 'wenzhang1',
    'freeze': 0
}
item2 = {
    'name': 'ionic',
    'pack': 'default',
    'tag': 'badass, framework, sexy, hawt, ionic'
}
to
{
    'name': '文章',  # 非必选
    type: prefix + ‘ionic’,
    tag: ['key', 'key']
}
*/

function changeFontIcon (prefix, {font_class: fontClass, name, unicode}) {
    let item = {}
    item.name = name
    item.tag = [fontClass, name, unicode]
    item.type = prefix + fontClass
    return item
}

const {one, font, iView} = icons

let groups = [one, font]
// icons['one'].icons
// icons['font'].icons

groups.forEach(({prefix, icons}) => {
    for (let iconKey in icons) {
        icons[iconKey] = changeFontIcon(prefix, icons[iconKey])
    }
})
const iViewIconGroups = _.groupBy(iView.icons, 'pack')
for (let key in iViewIconGroups) {
    iViewIconGroups[key].forEach((icon) => {
        icon.type = icon.name
        icon.tag = icon.tag.split(', ')
        delete icon.name
    })
    groups.push({
        label: key,
        icons: iViewIconGroups[key]
    })
}

export default {
    name: 'icon-select',
    data () {
        return {
            iconKey: '',
            groups
        }
    },
    methods: {
        searchIcon () {},
        filterByTag (icons) {
            if (this.iconKey) {
                return icons.filter((icon) => {
                    return _.find(icon.tag, (tag) => tag.indexOf(this.iconKey) >= 0) // icon.tag.indexOf(this.iconKey) >= 0
                })
            } else {
                return icons
            }
        },
        handleClickIcon (item) {
            this.$emit('on-select', item.type)
        }
    }
}
</script>
