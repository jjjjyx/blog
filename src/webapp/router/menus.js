// import Layout from '@/views/layout/layout2'

const homeRouter = {
	title: 'home',
	path: '',
	name: 'home',
    icon: 'ios-speedometer',
	redirect: '/home',
	component: '/dashboard/index',
	hide: true
}

/**
 * 这里的结构与vue-router 的 routes 相似， 并且会根据路由的path去响应的目录加载视图
 * 也可以使用 `component` 自定义视图
 * menus 下的第一级节点 默认使用布局为 @/views/layout/layout 布局文件，可以使用layout = false 拒接使用布局，或者指定其他布局
 *
 * {
 *     path # 菜单的路径  不可为空， home 节点除外
 *     name # 唯一值，作为router 的name属性，已经iview menu菜单的name 属性
 *     title # 菜单的标题gi
 *     icon # 菜单的icon  不填 则显示 textIcon
 *     textIcon: # 菜单的icon  不填 为标题题第一个字符  textIcon 与icon 优先显示 icon
 *     redirect： 有子菜单项的菜单 需要填写 redirect 属性，表示默认展示的子页面  不填默认为 `${path}/`
 *     child:  # 子菜单列表
 *     hide： 是否在页面中显示该菜单项
 *
 *     component: # comment 为path 的拼接，当路径为空时 取 name
 * }
 */
const menus = [
	// {title: '404', path: '404', name: 'error-404', hide: true, layout: false, component: 'errorPage/404'},

	homeRouter,
    {
        title: 'sign', path: 'sign', name: 'sign', hide: true, layout: '/sign/sign',
        redirect: '/sign/in',
        child: [
            {
                title: 'sign_in', path: 'in', name: 'sign_in'
            },
            // {
            //     title: 'sign_up', path: 'up', name: 'sign_up'
            // },
            {
                title: 'sign_forgot_pass', path: 'forgot_pass', name: 'sign_forgot_pass'
            }
        ]
    },
	// {title: 'test', path: 'tt', name: 'ttt', layout: '/layout/test'}, // 使用其他布局示例，应用布局文件 @/views/layout/test
	{
		title: 'post', path: 'post', name: 'post', textIcon: 'post',
		redirect: '/post/management',
		child: [
			{
				title: 'post_all', path: 'management', name: 'post_management', icon: 'icon-fabuwenzhang'
			},
            {
				title: 'post_writer', path: 'writer', name: 'post_writer', textIcon: '编辑',icon: 'icon-combinedshapecopy2'
			},
            {
				title: 'tag_management', path: 'tag', name: 'tag_management', textIcon: '标签',icon: 'md-pricetags'
			},
            {
				title: 'category_management', path: 'category', name: 'category_management', textIcon: '分类',icon: 'icon-ziyuan1'
			},
            {
				title: 'trash', path: 'trash', name: 'trash', icon: 'ios-trash'
			}
		]
	},
    {title: 'media', path: 'media', name: 'media', icon: 'md-image'},

    {
        title: 'pages', path: 'pages', name: 'pages', icon: 'ios-aperture',
        redirect: '/pages/blank',
        child : [
            {
                title: 'blank', path: 'blank', name: 'blank', icon: 'ios-document-outline'
            },
            {
                title: 'profile', path: 'profile', name: 'profile', hide: true
            }
        ]
    },
    {
        title: 'system', path: 'system', name: 'system', icon: 'md-globe',
        redirect: '/system/site',
        child : [
            {
                title: 'website', path: 'website', name: 'website', icon: 'ios-settings'
            }
        ]
    },
	// {title: 'domain', path: 'domain', name: 'domain', icon: 'md-globe'}
	// {title: 'location', path: 'location', name: 'location'},
]

// for (let i = 4; i < 40; i++) {
// 	menus[2].child[1].child.push({
// 		title: 'menus-2-' + i,
// 		path: 'menus2-'+i,
// 		name: 'menus - 2 - '+ i,
// 		component: '/menus/menus2/menus2-1'
// 	})
// }

export default menus
export { homeRouter }
