import Vue from 'vue'
// import iView from 'iview'
import VueI18n from 'vue-i18n'
import eenUS from 'iview/dist/locale/en-US'
import ezhCN from 'iview/dist/locale/zh-CN'
import ezhTW from 'iview/dist/locale/zh-TW'

import enUS from './en-US.js'
import zhCN from './zh-CN.js'
import zhTW from './zh-TW.js'
// import esLocale from './es'
Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
// const navLang = navigator.language
// const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = localStorage.getItem('local') || 'zh-CN'

Vue.config.lang = lang

const messages = {
    'en-US': {
        ...enUS,
        ...eenUS
    },
    'zh-CN': {
        ...zhCN,
        ...ezhCN
    },
    'zh-TW': {
        ...zhTW,
        ...ezhTW
    }
}

const i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'zh-CN',
    messages
})

export default i18n
