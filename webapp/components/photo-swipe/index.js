import PhotoSwipeComponent from './photo-swipe.vue'

export default {
    install (Vue) {
        const PhotoSwipe = Vue.extend(PhotoSwipeComponent)
        let $vm = new PhotoSwipe({ el: document.createElement('div') })
        document.body.appendChild($vm.$el)

        Vue.prototype.$photoswipe = {
            open (index, items, options) {
                $vm.open(index, items, options)
            },
            close () {
                $vm.close()
            }
        }
    }
}
