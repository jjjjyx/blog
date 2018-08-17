import Index from '@/components/index.vue'
import MediaManagement from '@/components/media-management.vue'
import postManagement from '@/components/post/post-management'
import postWriter from '@/components/post/post-writer'
import postCategory from '@/components/post/post-category.vue'
import postTag from '@/components/post/post-tag.vue'
import postTrash from '@/components/post/post-trash.vue'

import SystemSite from '@/components/system/site.vue'



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
