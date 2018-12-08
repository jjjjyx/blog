// 只有发布才能将状态设置成 除了草稿之外的状态，
// 其他情况不能修改文章状态
const PostStatusEnum = {
    'DRAFT': 'draft',
    'AUTO_DRAFT': 'auto-draft',
    'PUBLISH': 'publish',
    'PRIVATE': 'private',
    'PENDING': 'pending',
    'INHERIT': 'inherit'
}

const StatusEnum = {
    'OPEN': 'open',
    'CLOSE': 'close'
}

const TaxonomyEnum = {
    'CATEGORY': 'category',
    'NAV_MENU': 'nav_menu',
    'POST_TAG': 'post_tag'
}

const SiteEnum = {
    'YES': 'yes',
    'NO': 'no'
}

const ImgEnum = {
    'ALL': 'all',
    'PUBLIC': 'public',
    'COVER': 'cover',
    'POST': 'post',
    'AVATAR': 'avatar'
}

const LogType = {
    'LOGIN': 'login',
    'UPDATE': 'update',
    'LOGOUT': 'logout'
}

// 操作
const manageOperationEnum = {
    CREATE: '创建', // 1
    UPDATE: '修改', // 2
    DELETE: '删除', // 3
    LOGIN: '登陆', // 4
    TRASH: '丢弃', // 4
    REVERT: '还原', // 4
    PUBLISH: '发布', // 4
    LOGOUT: '退出', // 5
    UPLOAD: '上传', // 6
    ACCESS: '访问', // 10 0
    COMMENT: '评论', // 10 1
    REPLY: '回复' // 10 2
}
// 操作对象
const relatedTypeEnum = {
    'profile': '用户资料',
    'pass': '用户密码',
    'post': '文章',
    'revision': '文章自动存档',
    'autoDraft': '文章草稿',
    'category': '分类',
    'post_tag': '标签',
    'term': 'term',
    'system': '系统',
    'website': '系统设置',
    'image': '图片',
    'resource': '图片'
}
const fieldLabelEnum = {
    // 评论相关
    comment_content: '评论内容',
    comment_type: '评论状态',
    comment_author_avatar: '评论者头像url',
    // 文章相关
    post_date: '发布时间',
    post_content: '文章内容',
    post_title: '标题',
    post_excerpt: '摘录',
    post_status: '状态',
    comment_status: '评论状态',
    post_password: '密码',
    post_name: '别名',
    guid: '短链接',
    post_type: '类型',
    category: '分类',
    post_tag: '标签',

    // 媒体相关
    space: '存放目录',

    icon: '图标',
    user_pass: '密码',
    user_nickname: '昵称',
    user_email: '邮箱',
    user_avatar: '头像',
    user_url: '主页',
    display_name: '显示名称',
    role: '角色'

}
// 操作者
const whoTypeEnum = {
    USER: '用户', // 用户
    visitor: '游客' // 游客
}

// // 侧边栏 名称属性
// const SidebarListEnum = [
//     {name: '关于博主', key: 'about'},
//     {name: '热门文章', key: 'hot'},
//     {name: '精选文章', key: 'chosen'},
//     {name: '分类', key: 'category'},
//     {name: '标签', key: 'tags'},
//     {name: '最新文章', key: 'newest'},
//     {name: '归档', key: 'archives'},
//     {name: '搜索', key: 'search'}
// ]

module.exports = {
    PostStatusEnum,
    StatusEnum,
    TaxonomyEnum,
    SiteEnum,
    ImgEnum,
    LogType,
    manageOperationEnum,
    relatedTypeEnum,
    whoTypeEnum,
    fieldLabelEnum
}
