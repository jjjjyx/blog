
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
    'UPDATE': 'update'
}

module.exports.Enum =  {
    PostStatusEnum,
    StatusEnum,
    TaxonomyEnum,
    SiteEnum,
    ImgEnum,
    LogType
}
