import Vue from 'vue'
import i18n from '@/lang'
import store from '@/store'
import MediaSelect from './media-select'
import MediaCurd from './media-curd'

const MediaSelectConstructor = Vue.extend(MediaSelect)

let instance

function init (options = {}) {
    // options = options || {}
    instance = new MediaSelectConstructor({
        data: options.data,
        i18n,
        store
    })
    instance.$mount()

    document.body.appendChild(instance.$el)
    return instance
}

export default function install (Vue, opts = {}) {
    Vue.component('media-curd', MediaCurd)
    init(opts)
    Vue.prototype.$openImageSelectModal = instance.open
}
