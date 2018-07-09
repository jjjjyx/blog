
const PostStatusEnum = {
    'DRAFT': 'draft',
    'AUTO_DRAFT': 'auto-draft',
    'PUBLISH': 'publish',
    'PRIVATE': 'private',
    'PENDING': 'pending',
    'INHERIT': 'inherit'
}

// const PostTypeEnum = {
//     'revision': 'draft',
//     'post': 'auto-draft',
//     'PUBLISH': 'publish',
//     'INHERIT': 'inherit'
// }

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
    'ALL': '',
    'PUBLIC': 'public/',
    'COVER': 'cover/img/',
    'POST': 'post/img/'
}

module.exports.labels = {
    postStatus: {
        [PostStatusEnum.DRAFT]: '草稿',
        [PostStatusEnum.AUTO_DRAFT]: '自动草稿',
        [PostStatusEnum.PENDING]: '等待复审',
        // [PostStatusEnum.INHERIT]: 'inherit',
        [PostStatusEnum.PUBLISH]: '发布'
    },
    status: {
        [StatusEnum.OPEN]: '打开',
        [StatusEnum.CLOSE]: '关闭'
    },
    taxonomy: {
        [TaxonomyEnum.CATEGORY]: '分类',
        [TaxonomyEnum.NAV_MENU]: '导航',
        [TaxonomyEnum.POST_TAG]: '标签'
    },
    site: {
        [SiteEnum.YES]: 'yes',
        [SiteEnum.NO]: 'no'
    },
    img: {
        0: '所有',
        1: '公共区域',
        2: '封面',
        3: '文章插图'
    }
}

module.exports.Enum =  {
    PostStatusEnum,
    StatusEnum,
    TaxonomyEnum,
    SiteEnum,
    ImgEnum
}
