
const PostStatusEnum = {
    'DRAFT': 'draft',
    'AUTO_DRAFT': 'auto-draft',
    'PUBLISH': 'publish',
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
    PostStatus: {
        [PostStatusEnum.DRAFT]: '草稿',
        [PostStatusEnum.AUTO_DRAFT]: '自动草稿',
        [PostStatusEnum.PUBLISH]: '发布',
        [PostStatusEnum.INHERIT]: 'inherit'
    },
    Status: {
        [StatusEnum.OPEN]: '打开',
        [StatusEnum.CLOSE]: '关闭'
    },
    Taxonomy: {
        [TaxonomyEnum.CATEGORY]: '',
        [TaxonomyEnum.NAV_MENU]: '',
        [TaxonomyEnum.POST_TAG]: ''
    },
    Site: {
        [SiteEnum.YES]: '',
        [SiteEnum.NO]: ''
    },
    Img: {
        [ImgEnum.ALL]: '所有',
        [ImgEnum.PUBLIC]: '公共区域',
        [ImgEnum.COVER]: '封面',
        [ImgEnum.POST]: '文章插图'
    }
}

module.exports.Enum =  {
    PostStatusEnum,
    StatusEnum,
    TaxonomyEnum,
    SiteEnum,
    ImgEnum
}
