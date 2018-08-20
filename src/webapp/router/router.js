import Index from '@/components/index.vue'
import MediaManagement from '@/components/media-management.vue'
import postManagement from '@/components/post/post-management'
import postWriter from '@/components/post/post-writer'
import postCategory from '@/components/post/post-category.vue'
import postTag from '@/components/post/post-tag.vue'
import postTrash from '@/components/post/post-trash.vue'

import SystemSite from '@/components/system/site.vue'

//
// const sidebarGroups = [
//     {title: '首页', name: 'index', path: '/'},
//     {
//         title: '内容管理',
//         group: true,
//         name: 'content',
//         child: [
//             {
//                 title: '文章管理',
//                 name: 'post',
//                 icon: 'icon-guanliwenzhang',
//                 child: [ // 有subMenus 必须有name
//                     {title: '所有文章', name: 'management', icon: 'icon-fabuwenzhang'},
//                     {title: '撰写文章', name: 'writer', icon: 'icon-combinedshapecopy2'},
//                     {title: '分类管理', name: 'category', icon: 'icon-ziyuan1'},
//                     {title: '标签管理', name: 'tag', icon: 'pricetag'},
//                     {title: '回收站', name: 'trash', icon: 'ios-trash'}
//                 ]
//             },
//             {title: '媒体管理', name: 'media', icon: 'camera'},
//             {title: '留言管理', name: '', icon: 'ios-chatbubble-outline'}
//         ]
//     },
//     {
//         title: '系统',
//         group: true,
//         name: 'system',
//         child: [
//             {title: '访客管理', name: '', icon: 'coffee'},
//             {title: '用户管理', name: '', icon: 'ios-people-outline'},
//             {title: '网站设置', name: 'system_site', icon: 'levels'}
//         ]
//     }
// ]

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/media',
        name: 'media',
        component: MediaManagement
    },
    {
        path: '/post/management',
        name: 'post_management',
        component: postManagement
    },
    {
        path: '/post/writer',
        name: 'post_writer',
        component: postWriter
    },
    {
        path: '/post/category',
        name: 'post_category',
        component: postCategory
    },
    {
        path: '/post/tag',
        name: 'post_tag',
        component: postTag
    },
    {
        path: '/post/trash',
        name: 'post_trash',
        component: postTrash
    },
    {
        path: '/system/site',
        name: 'system_site',
        component: SystemSite
    }
    // {
    //     path: '/post/test',
    //     name: 'post_test',
    //     component: postTest
    // },
]

export default routes
