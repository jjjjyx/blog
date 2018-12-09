<template>
    <div v-if="postCoverImage.length" class="post-sidebar-cover">
        <div class="j-collapse ">
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    <Icon type="ios-image"></Icon>
                    <span>图片位置:</span>
                    <!--<template v-if="publishValue.status !== 'private'">-->
                    <b>{{ positionDict[postCoverPosition] }}</b>
                    <a href="javascript:void(0);" class="ml-1" @click.prevent="collapseStatus1 = !collapseStatus1">修改</a>
                    <!--</template>-->
                </div>
                <collapse-transition>
                    <div class="j-collapse-body" v-show="collapseStatus1">
                        位置
                        <Select size="small" style="width:100px" v-model="postCoverPosition">
                            <Option v-for="item in allowPosition" :value="item" :key="item">{{ positionDict[item] }}</Option>
                        </Select>
                        <Button size="small" class="ml-1" @click="savePosition(), collapseStatus1 = false">确定</Button>
                        <!--<Button size="small" type="text" @click="resetPosition(), collapseStatus1 = false">取消</Button>-->
                    </div>
                </collapse-transition>
            </div>
            <div class="j-collapse-item">
                <div class="j-collapse-header">
                    缩略图：
                </div>
                <div class="j-collapse-body">
                    <!--<img :src="postCoverImage" alt="." class="image-thumbnail" @click="selectImage">-->
                    <carousel autoplay arrow="never" height="">
                        <carousel-item v-for="image in postCoverImage" :key="image">
                            <img :src="image" alt="" class="image-thumbnail">
                        </carousel-item>
                    </carousel>
                </div>
            </div>
            <Button size="small" type="text" class="ml-1" @click="removeCover">移除图片</Button>
            <Button size="small" type="text" class="ml-1" @click="selectImage">更换其他图片</Button>
        </div>
    </div>
    <div v-else>
        <p>尚未设置文章封面图片</p>
        <Button type="default" size="small" @click="selectImage">选择图片</Button>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CollapseTransition from '@/utils/collapse-transition'
import sidebarMixins from './sidebar-mixins'

export default {
    mixins: [sidebarMixins],
    name: 'sidebar-cover',
    title: '封面',
    data () {
        return {
            // cover: {
            //     position: '',
            //     image: ''
            // },
            collapseStatus1: false,
            allowPosition: ['top', 'right', 'left']
        }
    },
    components: {
        CollapseTransition
    },
    computed: {
        ...mapState({
            // 'versionNum': state => state.post.revision.length,
            // 'currentPost': state => state.post
        }),
        ...mapGetters({
            'positionDict': 'positionDict'
            // 'isPublish': 'isPublish'
        }),
        postCoverPosition: {
            get () {
                return this.$store.state.post.cover_position || 'left'
            },
            set (value) {
                this.$store.commit('updatePostCoverPosition', value)
            }
        },
        postCoverImage: {
            get () {
                return this.$store.state.post.cover_image
            },
            set (value) {
                this.$store.commit('updatePostCoverImage', value)
            }
        }
    },
    methods: {
        _changePost () {
            this.fillCoverValue()
        },
        fillCoverValue () {
            // this.cover.position = this.currentPost.coverPosition || 'left'
            // this.cover.image = this.currentPost.coverImage
            // console.log(this.cover)
        },
        async selectImage () {
            try {
                let images = await this.$openImageSelectModal({ multiple: true })
                this.postCoverImage = images.map((item) => item.url)
            } catch (e) {
                // console.log('取消选择')
            }
        },
        savePosition () {
            // this.
        },
        resetPosition () {
            // this.postCoverImage = this.currentPost.coverPosition
        },
        removeCover () {
            this.postCoverImage = ''
        }
    },
    watch: {
        'currentPost.id': '_changePost'
    },
    mounted () {
        this._changePost()
    }
}
</script>
