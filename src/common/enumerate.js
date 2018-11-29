
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
    'NO': 'no',
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
    CREATE: 1, //'创建',
    UPDATE: 2, //'修改',
    DELETE: 3, //'修改',
    LOGIN: 4, //'登陆',
    LOGOUT: 5, //'退出',
    UPLOAD: 6, //'上传',
    ACCESS: 100, //'访问',
    COMMENT: 101, //'评论',
    REPLY: 102 // '回复',
}
// 操作对象
const relatedTypeEnum = {
    'USER': '用户',
    'POST': '文章',
    'category': '分类',
    'tag': '标签',
    'system': '系统',
    'webSite': '系统设置',
    'image': '图片',
}
// 操作者
const whoTypeEnum = {
    USER: 0, // 用户
    visitor: 2, // 游客
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
}
