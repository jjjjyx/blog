<template>
    <div class="img__item"
         :data-key="item.hash" :data-originUrl="item.url"
         :data-index="index" @mousedown="handleMouseDown"
         :class="{'img__item--active': item._checked}">
        <div class="img">
            <img :src="item.url + imgStyle" alt="">
        </div>
        <!--<span class="title" :title="item.name || item.key">{{item.name || item.key}}</span>-->
        <div class="check">
            <font-icon type="md-checkmark-circle"></font-icon>
        </div>
    </div>
</template>

<script>
// {
//     "hash": "Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "key": "Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "name": "1_120403103421_5.jpg",
//     "size": 61624,
//     "color": "#525b64",
//     "uuid": "a60bcf7d-973e-4282-9123-913f052268f2",
//     "mimeType": "image/jpeg",
//     "bucket": "jyximg",
//     "url": "http://image.cdn.mbdoge.cn/Fg2ZZ0VmdYVnj8CsFy1-BGgmcsml",
//     "width": 740,
//     "height": 462,
//     "space": "public",
//     "createdAt": "2018-08-12T17:18:49.000Z",
//     "_checked": false
// },

export default {
    name: 'img-item',
    data () {
        return {
            imgStyle: '?imageView2/1/w/180/h/180/q/75|watermark/2/text/ampqanl4/font/Y291cmllciBuZXc=/fontsize/240/fill/I0ZERkRGRA==/dissolve/84/gravity/SouthWest/dx/10/dy/10|imageslim'
        }
    },
    props: {
        item: {
            type:Object,
        },
        index: {
            type: Number
        }
    },
    methods: {
        handleMouseDown () {
            // this.item._checked = !this.item._checked
        }
    }
}
</script>
