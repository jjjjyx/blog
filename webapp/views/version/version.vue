<template>
    <Modal v-model="versionModel" width="90%" :footer-hide="true" title="文章历史">
        <div class="post-version-wrapper">
            <div class="post-version__list">
                <!--<div class="post-version__list&#45;&#45;header">1</div>-->
                <Timeline class="post-version__list--body">
                    <TimelineItem @click.native="getVersionContent(version)" v-for="(version, index) in versions"
                                  :class="{active: version === active}"
                                  :color="version.autosave ? 'red': 'blue'"
                                  v-bind:key="index">
                        <Icon type="md-git-pull-request" v-if="version.autosave" slot="dot"></Icon>
                        <Icon type="md-git-branch" v-else-if="version.master" slot="dot"></Icon>
                        <Icon type="ios-git-commit" v-else slot="dot"></Icon>
                        <span class="float-right text-black-50 mr-3">#{{version.id}}</span>
                        <h5 class="post-version__list--time">
                            {{dateFormat(version.createdAt, 'yyyy/MM/dd hh:mm:ss')}}
                        </h5>
                        <p class="post-version__list--author">
                            {{version.user.user_login}}@{{version.user.user_nickname}}
                        </p>
                    </TimelineItem>
                </Timeline>
                <div class="post-version__list--footer">共计 {{versions.length}} 个版本</div>
            </div>
            <div class="post-version__content" v-if="active">
                <div class="post-version__content--header">
                    <h3 class="post-version__content--title">
                        <span>文章“</span>
                        <span class="post-version__content--title--pt">{{currentPost.post_title}}</span>
                        <span>”的历史版本信息</span>
                    </h3>
                    <template v-if="active">
                        <div class="post-version__content--desc">
                            修改时间:
                            <span class="mr-4">{{dateFormat(active.createdAt, 'yyyy/MM/dd hh:mm:ss')}}</span>
                            修改者:
                            <span>{{active.user.user_login}}@{{active.user.user_nickname}}</span>
                        </div>
                        <Tag color="blue" style="position: absolute;top: 11px; right: 15px;" v-if="active.master">当前版本</Tag>
                        <Tag color="yellow" style="position: absolute;top: 11px; right: 15px;" v-else-if="active.autosave">自动保存</Tag>
                    </template>
                </div>
                <div class="post-version__content--body">
                    <template v-if="showTitle">
                        <h2>标题:</h2>
                        <code-diff :old-string="currentPost.post_title" :new-string="active.post_title" :context="1" header="标题"/>
                    </template>
                    <template v-if="showCategory">
                        <h2>分类</h2>
                        <div>
                            <hr>
                            当前版本: {{categoryName(this.currentPost.category_id)}}
                            <br>
                            此版本: {{categoryName(this.activeCategory)}}
                            <hr>
                        </div>
                    </template>
                    <template v-if="showTags">
                        <h2>标签</h2>
                        <div>
                            <hr>
                            当前：
                            <Tag v-for="(item, index) in currentPost.new_tag" color="#fdf2d0" :key="index + '_'" :name="item">
                                <span style="color: #000000">{{item}}</span>
                            </Tag>
                            <br>
                            此版本：
                            <Tag v-for="(item, index) in activeTags" color="#ded" :key="index " :name="item">
                                <span style="color: #000000">{{item}}</span>
                            </Tag>
                            <hr>
                        </div>
                    </template>

                    <h2>内容:</h2>
                    <code-diff :old-string="currentPost.post_content" :new-string="active.post_content" :context="10" header="内容"/>

                    <template v-if="showExcerpt">
                        <h2>摘录:</h2>
                        <code-diff :old-string="currentPost.post_excerpt" :new-string="active.post_excerpt" :context="10" header="摘录"/>
                    </template>
                </div>
                <div class="post-version__content--footer">
                    <span class="mr-4">文章内容对比是当前编辑内容与所选版本对比</span>
                    <Button type="primary" :disabled="active.master" @click="restore">恢复到此版本</Button>
                </div>
            </div>
        </div>
        <!--<code-diff :old-string="oldStr" :new-string="newStr" :context="10" />-->
    </Modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import difference from 'lodash/difference'
import CodeDiff from '@/components/code-diff/code-diff'
import { dateFormat } from '@/utils/common'

export default {
    name: 'version',
    data () {
        return {}
    },
    components: {
        CodeDiff
    },
    computed: {
        ...mapState({
            currentPost: state => state.post,
            categoryList: state => state.data.categoryList,
            active: state => state.post.versionModelActive
        }),
        ...mapGetters(['defaultCategoryValue', 'versions']),

        versionModel: {
            get () {
                return this.$store.state.post.versionModelVisible
            },
            set (value) {
                this.$store.commit('SET_VERSION_MODEL_STATUS', value)
            }
        },
        showTitle: function () {
            return this.currentPost.post_title !== this.active.post_title
        },
        showExcerpt: function () {
            return this.currentPost.post_excerpt !== this.active.post_excerpt
        },
        activeCategory: function () {
            return this.active.metas.category ? this.active.metas.category.meta_value * 1 : this.defaultCategoryValue
        },
        activeTags: function () {
            return this.active.metas.tags ? JSON.parse(this.active.metas.tags.meta_value) : []
        },
        showCategory: function () {
            return this.currentPost.category_id !== this.activeCategory
        },
        showTags: function () {
            let tags = this.activeTags
            // console.log('activeTags', tags, this.currentPost.new_tag)
            // if (tags.length === 0) return false
            if (this.currentPost.new_tag.length === tags.length) { // 长度相等
                return difference(this.currentPost.new_tag, tags).length // 取交集，无交集不显示
            }
            return true
        }
    },
    methods: {
        dateFormat,
        getVersionContent (version) {
            // console.log(active)
            // this.active = version
            this.$store.commit('SET_VERSION_MODEL_ACTIVE', version)
        },
        restore () {
            this.$store.commit('restore', this.active)
            this.$Notice.close('version_notice')
            this.$store.commit('SET_VERSION_MODEL_STATUS', false)
        },
        categoryName (id) {
            let category = this.categoryList.find(i => i.id === id)
            return category ? `${category.name}#${id}` : `${id} (未知- 可能是错误的分类)`
        }
    }
}
</script>
<style>
    .d2h-file-header {
        display: none;
    }
</style>
