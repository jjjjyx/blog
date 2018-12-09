import Vue from 'vue'
import MediaSelect from './media-select'

const MediaSelectConstructor = Vue.extend(MediaSelect)

let instance

function init (options = {}) {
    // options = options || {}
    instance = new MediaSelectConstructor({
        data: options.data
    })
    instance.$mount()

    document.body.appendChild(instance.$el)
    return instance
}
export default function install (Vue, opts = {}) {
    init(opts)
}
