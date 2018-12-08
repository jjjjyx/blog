export default {
    router: {
        'home': 'Home',
        'dashboard': 'Dashboard',
        'post': 'Article',
        'post_all': 'Management',
        'nested': 'Nested',
        'system_site': 'Website settings',
        'domain': 'Domain',
        'location': 'Camouflage',
        'menus-1': 'menus - 1',
        'menus-2': 'menus - 2',
        'menus-2-1': 'menus - 2 - 1',
        'menus-2-2': 'menus - 2 - 2',
        'menus-2-3': 'menus - 2 - 3'
    },
    navbar: {
        welcome: 'Signed in as ',
        profile: 'Your Profile',
        logOut: 'Sign out',
        dashboard: 'Dashboard',
        home: 'Home',
        language: 'Language',
        bug: 'Error log',
        screenFull: 'Full Screen'
    },
    plugin: {
        'color': 'siderbar color',
        'background': 'siderbar background',
        'mini': 'siderbar mini',
        'image': 'siderbar image',
        'images': 'images'
    },
    contextmenu: {
        'close': 'Close',
        'close_other': 'Close Other',
        'close_all': 'Close All'
    },
    messages: {
        close_selected_tab: 'There is nothing left to close',
        screen_full_warning: 'you browser can not work',
        switch_language: 'Switch Language Success',

        signup_valid_error: 'Please improve registration information',
        signup_error: 'registration failed',

        signin_valid_error: 'Please enter an account password',
        signin_error: 'Login failed',

        curd: {
            del_warning_title: 'Confirm delete multiples',
            del_warning_content: 'confirm deletion? It will not be restored after deletion!',
            del_success: 'delete successfully',
            del_fail: 'delete failed by {message}',

            update_fail: 'edit failed by {message}',
            fetch_fail: 'Failed to get {name} data by {message}',
            add_fail: 'Add failed by {message}',
            valid_fail: 'verification failed!'
        },
        form: {
            username_empty: 'Please fill in the user name',
            username_length: 'The user name length cannot be less than 2 bits',
            username_up_length: 'The account length must be between 6 and 24 characters.',
            password_empty: 'Please fill in the password.',
            password_length: 'The password length cannot be less than 6 bits',
            password_up_length: 'The password must be between 8 and 32 characters long.',
            nickname_empty: 'Please fill in the nick name',
            pass_check_empty: 'Please enter your password again',
            pass_check: 'The two input passwords do not match!',
            terms_false: 'Please read the privacy policy.'
        }
    },
    login: {
        'login': 'Login',
        'forgot-pass': 'Forgot Password?',
        'register': 'Register',
        'login_title': 'Login Form',
        'remember_me': 'Keep me signed in',

        'register_title': 'Register',
        'protocol': 'Read and agree',
        'protocol_name': '《Privacy Policy》'
    },
    code: {
        'SUCCESS': 'Success',
        'FAILED': 'Failed',
        'UNKNOWN_ERROR': 'Unknown error',
        'SERVICE_UNAVAILABLE': 'Service is temporarily unavailable',
        'INVALID_REQUEST': 'Illegal request',
        'LOCKED': 'The current resource has been locked',
        'UNIQUE_CONSTRAINT': 'Unique constraint',
        'ACCESS_DENIED': 'Authorization server refuses to grant data access',
        'INVALID_CLIENT': 'User authentication failed',
        'INVALID_GRANT': 'Illegal authorization information',
        'TOKEN_INVALID': 'invalid access token',
        'VERIFYCODE_ERROR': 'Verification code error',
        'CONNET_SUCCESS': 'Connected successfully',
        'CONNET_FAILED': 'Connection failed',
        'REGISTER_CLOSE': 'Not yet open for registration',
        'INVALID_PARAMETERS': 'Invalid parameter'
    },
    curd: {
        search_label: 'Search',
        search_placeholder: 'search...',
        total: 'All loaded, total {0}',
        toolbar_refresh: 'refresh',
        header_text: 'all {name}',
        header_select_text: '{num} data selected',
        page: 'The current {0} to {1} records are displayed, for a total of {2}',
        empty_text: 'Empty',
        load_text: 'Loading...',

        fun_insert_title: 'Add {name}',
        fun_update_title: 'Modify {name} #{key}',
        action: {
            save: 'Save',
            reset: 'Reset',
            del: 'Delete',
            update: 'Modify',
            cancel: 'Cancel',
            edit: 'Edit',
            insert: 'Add',
            refresh: 'refresh'
        },
        columns: {
            id: '#',
            action: 'Action',
            edit_time: 'CreatedAt'
        },
        domain: 'Domain',
        location: 'Camouflage'
    },
    domain: {
        add_location: 'Create camouflage',
        columns: {
            id: '@:curd.columns.id',
            domain: 'Domain',
            edit_time: 'CreatedAt',
            action: '@:curd.columns.action'
        }
    },
    location: {
        empty: '@:curd.empty_text',
        action: {
            jump: 'redirect to'
        },
        columns: {
            id: '@:curd.columns.id',
            path: 'Camouflage Path',
            edit_time: '@:curd.columns.edit_time',
            action: '@:curd.columns.action'
        }
    },
    error: {
        404: 'Page not found',
        '404_desc': 'Please check that the URL you entered is correct. Please click the button below to return to the homepage.' // 或者发送错误报告
    }
}
