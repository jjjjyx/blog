export default {
    router: {
        'home': '主頁',
        'dashboard': '控制台',
        'post': '文章管理',
        'post_all': '所有文章',
        'nested': '嵌套路由',
        'system_site': '網址設置',
        'domain': '域名管理',
        'location': '偽裝路徑',
        'menus-1': 'menus - 1',
        'menus-2': 'menus - 2',
        'menus-2-1': 'menus - 2 - 1',
        'menus-2-2': 'menus - 2 - 2',
        'menus-2-3': 'menus - 2 - 3'
    },
    navbar: {
        welcome: '歡迎您：',
        profile: '個人資料',
        logOut: '退出登錄',
        dashboard: '控制台',
        home: '首頁',
        language: '語言',
        screenFull: '全屏'
    },
    plugin: {
        'color': '菜單激活顏色',
        'background': '側邊欄背景顏色',
        'mini': '展開/收起 側邊欄',
        'image': '開啟/關閉 側邊欄背景圖片',
        'images': '選擇圖片'
    },
    contextmenu: {
        'close': '關閉',
        'close_other': '關閉其他',
        'close_all': '關閉所有'
    },
    messages: {
        close_selected_tab: '已經沒有東西可以關閉了',
        screen_full_warning: '你的瀏覽器無法正常工作',
        switch_language: '切換成功',

        signup_valid_error: '請完善註冊信息',
        signup_error: '註冊失敗',

        signin_valid_error: '請輸入賬號密碼',
        signin_error: '登錄失敗',

        curd: {
            del_warning_title: '刪除提示',
            del_warning_content: '確認刪除？刪除後將不可恢復! ',
            del_success: '刪除成功',
            del_fail: '刪除失敗: {message}',

            update_fail: '修改失敗: {message}',
            fetch_fail: '獲取{name}數據失敗: {message}',
            add_fail: '添加失敗: {message}',
            valid_fail: '驗證失敗'
        },
        form: {
            username_empty: '請填寫用戶名',
            username_length: '用戶名長度不能小於2位',
            username_up_length: '帳戶長度必須介於6到24個字符之間。 ',
            password_empty: '請填寫密碼',
            password_length: '密碼長度不能小於6位',
            password_up_length: '密碼長度必須介於8到32個字符之間。 ',
            nickname_empty: '請填寫暱稱',
            pass_check_empty: '請再次輸入你的密碼',
            pass_check: '兩個輸入密碼不匹配！ ',
            terms_false: '請閱讀隱私條款後勾選'
        }
    },
    login: {
        'login': '登錄',
        'forgot-pass': '找回密碼',
        'register': '註冊',
        'remember_me': '保持登錄狀態',

        'login_title': '系統登錄',
        'register_title': '註冊新賬號',
        'protocol': '我已閱讀並同意 ',
        'protocol_name': '《隱私條款》'
    },
    code: {
        'SUCCESS': '成功',
        'FAILED': '失敗',
        'UNKNOWN_ERROR': '未知錯誤',
        'SERVICE_UNAVAILABLE': '服務暫不可用',
        'INVALID_REQUEST': '非法的請求',
        'LOCKED': '當前資源已被鎖定',
        'UNIQUE_CONSTRAINT': '唯一性約束',
        'ACCESS_DENIED': '授權服務器拒絕授予數據訪問權限',
        'INVALID_CLIENT': '用戶認證失敗',
        'INVALID_GRANT': '非法的授權信息',
        'TOKEN_INVALID': '無效的access token',
        'VERIFYCODE_ERROR': '驗證碼出錯',
        'CONNET_SUCCESS': '連接成功',
        'CONNET_FAILED': '連接失敗',
        'REGISTER_CLOSE': '暫未開放註冊',
        'INVALID_PARAMETERS': '無效的參數'
    },
    curd: {
        search_label: '關鍵字',
        search_placeholder: '搜索...',
        total: '已全部加載，共 {0} 條',
        header_text: '全部 {name}',
        header_select_text: '已選中 {num} 條數據',
        page: '當前顯示第 {0} 到第 {1} 條記錄，共 {2} 條',
        empty_text: '暫無數據',
        load_text: '加載中...',

        fun_insert_title: '增加{name}',
        fun_update_title: '修改{name} #{key}',
        action: {
            save: '保存',
            reset: '重置',
            del: '刪除',
            update: '修改',
            cancel: '取消',
            edit: '編輯',
            insert: '增加',
            refresh: '刷新'
        },
        columns: {
            id: '#',
            action: '操作',
            edit_time: '創建時間'
        },
        domain: '域名',
        location: '偽裝'
    },
    domain: {
        add_location: '創建偽裝',
        columns: {
            id: '@:curd.columns.id',
            domain: '域名',
            edit_time: '@:curd.columns.edit_time',
            action: '@:curd.columns.action'
        }
    },
    location: {
        empty: '@:curd.empty_text',
        action: {
            jump: '跳轉到'
        },
        columns: {
            id: '@:curd.columns.id',
            path: '偽裝路徑',
            edit_time: '@:curd.columns.edit_time',
            action: '@:curd.columns.action'
        }
    }
}
