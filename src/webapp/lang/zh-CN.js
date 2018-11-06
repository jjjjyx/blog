export default {
	router: {
		'home': '主页',
		'dashboard': '控制台',
		'post': '文章管理',
		'post_all': '所有文章',
		'post_writer': '文章编辑',
		'nested': '嵌套路由',
		'system_site': '网址设置',
		'domain': '域名管理',
		'location': '伪装路径',
		'menus-1': 'menus - 1',
		'menus-2': 'menus - 2',
		'menus-2-1': 'menus - 2 - 1',
		'menus-2-2': 'menus - 2 - 2',
		'menus-2-3': 'menus - 2 - 3'
	},
	navbar: {
		welcome: '欢迎您：',
		userSet: '账号设置',
		logOut: '退出登录',
		dashboard: '控制台',
		home: '首页',
		language: '语言',
		bug: '错误日志',
		screenFull: '全屏'
	},
	plugin: {
		'color': '菜单激活颜色',
		'background': '侧边栏背景颜色',
		'mini': '展开/收起 侧边栏',
		'image': '开启/关闭 侧边栏背景图片',
		'images': '选择图片'
	},
	contextmenu: {
		'close': '关闭',
		'close_other': '关闭其他',
		'close_all': '关闭所有'
	},
	messages: {
		close_selected_tab: '已经没有东西可以关闭了',
		screen_full_warning: '你的浏览器无法正常工作',
		switch_language: '切换成功',

		signup_valid_error: '请完善注册信息',
		signup_error: '注册失败',

		signin_valid_error: '请输入账号密码',
		signin_error: '登录失败',

		curd: {
			del_warning_title: '删除提示',
			del_warning_content: '确认删除？删除后将不可恢复! ',
			del_success: '删除成功',
			del_fail: '删除失败: {message}',

			update_fail: '修改失败: {message}',
			fetch_fail: '获取{name}数据失败: {message}',
			add_fail: '添加失败: {message}',
			valid_fail: '验证失败'
		},
		form: {
			username_empty: '请填写用户名',
			username_length: '用户名长度不能小于2位',
			username_up_length: '帐户长度必须介于6到24个字符之间。',
			password_empty: '请填写密码',
			password_length: '密码长度不能小于6位',
			password_up_length: '密码长度必须介于8到32个字符之间。',
			nickname_empty: '请填写昵称',
			pass_check_empty: '请再次输入你的密码',
			pass_check: '两个输入密码不匹配！',
			terms_false: '请阅读隐私条款后勾选'
		}
	},
	login: {
		'login': '登录',
		'forgot-pass': '找回密码',
		'register': '注册',
		'remember_me': '保持登录状态',

		'login_title': '系统登录',
		'register_title': '注册新账号',
		'protocol': '我已阅读并同意 ',
		'protocol_name': '《隐私条款》'
	},
	code: {
		'SUCCESS': '成功',
		'FAILED': '失败',
		'UNKNOWN_ERROR': '未知错误',
		'SERVICE_UNAVAILABLE': '服务暂不可用',
		'INVALID_REQUEST': '非法的请求',
		'LOCKED': '当前资源已被锁定',
		'UNIQUE_CONSTRAINT': '唯一性约束',
		'ACCESS_DENIED': '授权服务器拒绝授予数据访问权限',
		'INVALID_CLIENT': '用户认证失败',
		'INVALID_GRANT': '非法的授权信息',
		'TOKEN_INVALID': '无效的access token',
		'VERIFYCODE_ERROR': '验证码出错',
		'CONNET_SUCCESS': '连接成功',
		'CONNET_FAILED': '连接失败',
		'REGISTER_CLOSE': '暂未开放注册',
		'INVALID_PARAMETERS': '无效的参数'
	},
	curd: {
		search_label: '关键字',
		search_placeholder: '搜索...',
		total: '已全部加载，共 {0} 条',
		header_text: '全部 {name}',
		header_select_text: '已选中 {num} 条数据',
		page: '当前显示第 {0} 到第 {1} 条记录，共 {2} 条',
		empty_text: '暂无数据',
		load_text: '加载中...',

		fun_insert_title: '增加{name}',
		fun_update_title: '修改{name}  #{key}',
		action: {
			save: '保存',
			reset: '重置',
			del: '删除',
			update: '修改',
			cancel: '取消',
			edit: '编辑',
			insert: '增加',
			refresh: '刷新',
		},
		columns: {
			id: '#',
			action: '操作',
            date: '日期',
		},
        post: '文章',
		location: '伪装'
	},
	post: {
		columns :{
			id: '@:curd.columns.id',
            title: '标题',
            auth: '作者',
            category: '类别',
            tags: '标签',
            comment: '评论',
            date: '@:curd.columns.date',
			action: '@:curd.columns.action'
		}
	},
	location: {
		empty: '@:curd.empty_text',
		action: {
			jump: '跳转到'
		},
		columns :{
			id: '@:curd.columns.id',
			path: '伪装路径',
			edit_time: '@:curd.columns.edit_time',
			action: '@:curd.columns.action'
		}
	},
	error: {
		404: "页面未找到",
		"404_desc": '请检查您输入的网址是否正确，请点击以下按钮返回主页' // 或者发送错误报告
	}
}
