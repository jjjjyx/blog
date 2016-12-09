
import objectid from "objectid-js"

const state = {
    notify_type: {
        error: 'error',
        info: 'info',
        success: 'success',
        warning: 'warning'
    },
    notify_data_list: [],
    position: 'notify-bottom-left',
    max_notify: 8,
    options: {
        rtl: false,                 // 内容方向
        close_btn: true,            // 是否显示关闭按钮
        onClose: null,              // 消息关闭后的回调
        onShow: null,               // 消息显示时的回调
        auto_close: true,           // 自动关闭
        escape_html: false,         // 原生html 代码
        extended_time_out: 1000,    // 鼠标经过时 暂停关闭 移开后的倒计时
        time_out: 3000,             // 关闭时间
        interval_id: null,          // 定时器 id
        progress: false,             // 是否显示 关闭进度条
    }
}


const getters = {

    notify_data_list: state => state.notify_data_list,
    position: state => state.position
}

// actions
const actions = {
    info (store,message,title){
        // payload.type='info'
        store.dispatch('notify',{message,title,type:'info'});
    },
    success (store,message,title){
        store.dispatch('notify',{message,title,type:'success'});
    },
    error (store,message,title){
        store.dispatch('notify',{message,title,type:'error'});
    },
    warning (store,message,title){
        store.dispatch('notify',{message,title,type:'warning'});
    },
    notify ({commit, state},payload) {
        // console.log(payload);
        if (state.notify_data_list.length >= state.max_notify) {
            commit('CLOSE_NOTICE', {index:0});
        }

        let progress_bar = {
            interval_id: null,
            hide_eta: null,
            max_hide_time: null,
            percentage: 100
        };
        var response = {
            state: 'visible',
            startTime: new Date()
        };
        let id = payload['id'] = new objectid().toString();
        let option = payload.options = Object.assign({}, state.options, payload.options , {progress_bar}, response);

        commit('NOTIFY', payload);

        progress_bar = option.progress_bar;

        if (option.auto_close && option.time_out > 0) {
            option.interval_id = setTimeout(() => {
                commit('CLOSE_NOTICE', {id});
            }, option.time_out);

            // commit('PROGRESS_BAR', {id, time_out:option.time_out});
            // if (option.progress) {
            //     progress_bar.interval_id = setInterval(() => {
            //         commit('UPDATE_PROGRESS', id);
            //     }, 10);
            // }
        }


    },
    closeNotifyByIndex ({commit}, index,event) {
        commit('CLOSE_NOTICE', {index,e:event});
    },
    stickAround ({commit}, index) {
        commit('STICK_AROUND', index)
    },
    delayedHideNotify ({commit},index) {
        let data = state.notify_data_list[index];
        if (!data) return;
        if (!data.options.auto_close) return;
        if (data.options.timeOut > 0 || data.options.extended_time_out > 0) {
            data.options.interval_id = setTimeout(() => {
                commit('CLOSE_NOTICE', {index});
            }, data.options.extended_time_out);

            // dispatch('PROGRESS_BAR', data, data.options.extended_time_out);
            // data.options.progress_bar.interval_id = setInterval(() => {
            //     dispatch('UPDATE_PROGRESS', data);
            // }, 10);
        }
    }
}



const mutations = {

    NOTIFY (state, data) {
        state.notify_data_list.push(data);
        if (data.options.onShow && typeof (data.options.onShow) === 'function')
            data.options.onShow(data);
    },
    CLOSE_NOTICE (state,{index,e:event,id}) {
        let data;
        if(id){
            index = state.notify_data_list.findIndex((element)=>element.id === id);

        }
        if(index<0) return ;

        data = state.notify_data_list[index];

        if (data.options.onClose && typeof (data.options.onClose) === 'function')
            data.options.onClose(event);
        //  如果是自动关闭
        if (data.options.interval_id)
            clearTimeout(data.options.interval_id);
        if (data.options.progress_bar && data.options.progress_bar.interval_id)
            clearTimeout(data.options.progress_bar.interval_id);

        state.notify_data_list.splice(index,1);
    },
    // UPDATE_PROGRESS(state, id) {
    //     let p = (state.notify_data_list.find((item) => item.id == id)).options.progress_bar;
    //     p.percentage = ((p.hide_eta - (new Date().getTime())) / p.max_hide_time) * 100;
    //
    // },
    // PROGRESS_BAR(state,{ id, timeout}) {
    //     let p = (state.notify_data_list.find((item) => item.id == id)).options.progress_bar;
    //     p.max_hide_time = parseFloat(timeout);
    //     p.hide_eta = new Date().getTime() + p.max_hide_time;
    // },

    STICK_AROUND(state, index) {
        let data = state.notify_data_list[index];
        if (!data) return;
        if (data.options.interval_id)
            clearTimeout(data.options.interval_id);

        if (data.options.progress_bar && data.options.progress_bar.interval_id)
            clearTimeout(data.options.progress_bar.interval_id);

        data.options.progress_bar.hide_eta = 0;
        data.options.progress_bar.percentage = 0;

    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
