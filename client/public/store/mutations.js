
// import api from "../netapi.js"
// import act from "../components/mindmap/core/action.js"
// import sockapi from '../netsock'

export const mutations = {
    // sock 链接 返回
    SOCK_CONNECTED (state,{conn,code, username}) {
        if (code == 0) {
            state.sock = conn;
        }
    },
    //出现异常 链接中断
    SOCK_LOST (state) {
        state.sock = null;
    },
    // 网络异常
    // 出现这个异常 将跳到登录页面
    // 清空 user 利用user.vue 的检测
    NETWORK_CONNECTION_ERROR (state,code) {
        state.user.name = null;
        state.user = null;
    },
}
