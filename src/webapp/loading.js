// 不能使用这种方式，由于css 通过异步加载页面最初始的样式还是无法遮盖，无用功
console.log('hello world')
// import './assets/loading.scss'
//
// document.write(`<div id="preloader"><div id="preloader-inner" class="battery"></div></div>`)
// let $preloader = document.getElementById('preloader')
// let $load = document.getElementById('load-script')
//
// function whichTransitionEvent () {
//     let t
//     let el = document.createElement('surface')
//     let transitions = {
//         'animation': 'animationend',
//         'OAnimation': 'oanimationend',
//         'MozAnimation': 'mozAnimationEnd',
//         'WebkitAnimation': 'webkitAnimationEnd'
//     }
//     for (t in transitions) {
//         if (el.style[t] !== undefined) {
//             return transitions[t]
//         }
//     }
// }
//
// function fulfilLoading () {
//     $preloader.className = 'fadeOut'
//     var transitionEvent = whichTransitionEvent()
//     if (transitionEvent) {
//         $preloader.addEventListener(transitionEvent, function __fn__ () {
//             document.body.removeChild($preloader)
//             document.body.removeChild($load)
//             $preloader.removeEventListener(transitionEvent, __fn__, false)
//         })
//     }
// }
//
// window.fulfilLoading = fulfilLoading
