import keyboardJS from "keyboardjs";
import {reFindall, browser} from "./tools";

/*{
    'key': ['enter'],
    'caption': ['按键标题，可选，默认为key首字大写，此选项用于自定义描述'],
    'oncall': (e) => {}, // 按键事件，可不存在，则不会进行相关调用
    'text': '说明文本，可不存在',
    'kind': '说明中的分类',
}, */

class Key {
    constructor() {
        this.shortkeys = {} // 已绑定的部分
        this.textkey = {} // 名称对快捷
    }

    /** 按照系统不同对按键进行适配替换，同时返回每一个单体按键以及按键说明文本 */
    _compile(keytext) {
        let btns = reFindall(/([a-z0-9]+|[+>])/g, keytext);
        for (let i in btns) {
            let btn = btns[i];
            if (browser.mac) {
                if (btn == 'ctrl') btns[i] = 'command';
            }
        }
        return [btns.join(' '), btns];
    }

    /** 对 tips 进行填充 */
    gettips(item, btns_lst) {
        let tips_lst = [];
        for (let i in btns_lst) {
            let tips = [];
            let btns = btns_lst[i];
            for (let j in btns) {
                // 1. 有 tips 用 tips，没有用 btns
                // 2. 有 tips 但内容是空的，用btns
                // 3. 首字母大写
                // 4. 不是 + 或 > 等连接词
                let tip = (item.tips && item.tips[i]) ? item.tips[i][j] : btns[j];
                if (!tip) tip = btns[j];
                tip = tip.replace(/^\w/, (v) => v.toUpperCase());
                if (!/[>+]/.test(tip)) tips.push(tip);
            }
            tips_lst.push(tips);
        }
        return tips_lst;
    }

    /** 绑定一项快捷键 */
    bind(context, item) {
        if (!this.shortkeys[context]) this.shortkeys[context] = []
        if (this.shortkeys[context].indexOf(item) != -1) return;
        this.shortkeys[context].push(item);

        keyboardJS.withContext(context, () => {
            let btns_lst = [];
            for (let keytext of item.keys) {
                let [key, btns] = this._compile(keytext);
                if (item.oncall) keyboardJS.bind(key, item.oncall);
                btns_lst.push(btns);
            }
            item._btns_lst = btns_lst;
            item._tips_lst = this.gettips(item, btns_lst);
            this.textkey[item.text] = item;
        });
    }

    /** 绑定一整套快捷键 */
    bindAll(context, items) {
        for (let i of items) {
            this.bind(context, i);
        }
    }

    unbind(context, item) {
        // 移除 _btns_lst / _tips_lst
        // 移除绑定
    }

    /** 根据绑定的按键生成帮助 */
    help(context) {
        if (!this.shortkeys[context]) return;
        let kinds = []
        let info = {}
        for (let item of this.shortkeys[context]) {
            if (!info[item.kind]) {
                kinds.push(item.kind);
                info[item.kind] = [];
            }
            info[item.kind].push([item.text, item._tips_lst]);
        }
        return {
            kinds,
            info
        };
    }
    getKeyByText(text) {
        return text && this.textkey[text];
    }
}

const key = new Key();
export default key;
