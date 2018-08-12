
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
    'ALL': 'all',
    'PUBLIC': 'public',
    'COVER': 'cover',
    'POST': 'post'
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
        'all': '所有',
        'public': '公共区域',
        'cover': '封面',
        'post': '文章插图'
    }
}

module.exports.Enum =  {
    PostStatusEnum,
    StatusEnum,
    TaxonomyEnum,
    SiteEnum,
    ImgEnum
}
