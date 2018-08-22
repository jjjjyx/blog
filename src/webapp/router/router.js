const menus = [
    {title: 'home', key: '', name: 'index', icon: 'camera', hideInMenu: true},
    {
        title: '文章管理',
        name: 'post',
        icon: 'icon-guanliwenzhang',
        isChildren: false,
        subMenus: [ // 有subMenus 必须有name
            {title: '所有文章', key: 'management', name: 'post_management', icon: 'icon-fabuwenzhang'},
            {title: '撰写文章', key: 'writer', name: 'post_writer', icon: 'icon-combinedshapecopy2'},
            {title: '分类管理', key: 'category', name: 'post_category', icon: 'icon-ziyuan1'},
            {title: '标签管理', key: 'tag', name: 'post_tag', icon: 'pricetag'},
            {title: 'test', key: 'test', name: 'test', icon: 'pricetag', hideInMenu: true},
            {title: '回收站', key: 'trash', name: 'post_trash', icon: 'ios-trash'}
        ]
    },
    {title: '媒体管理', key: 'media', name: 'media', icon: 'camera'},
    {title: '留言管理', key: 'a', name: 'a', icon: 'ios-chatbubble-outline'},
    {title: '访客管理', key: 'b', name: 'b', icon: 'coffee'},
    {title: '用户管理', key: 'c', name: 'c', icon: 'ios-people-outline'},
    {title: '网站设置', key: 'system/site', name: 'system_site', icon: 'levels'}
]

export default menus
