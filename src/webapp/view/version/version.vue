<template>
<Modal v-model="versionModel" width="70%" :footer-hide="true" title="文章历史">
    <div class="post-version-wrapper">
        <div class="post-version__list">
            <!--<div class="post-version__list&#45;&#45;header">1</div>-->
            <Timeline class="post-version__list--body">
                <TimelineItem @click.native="getVersionContent(active = version)"
                    v-for="(version, index) in versions"
                    :class="{active: version === active}"
                    :color="version.autosave ? 'red': 'blue'"
                    v-bind:key="index" >
                    <Icon type="clock" slot="dot" v-if="version.autosave"></Icon>
                    <p class="post-version__list--time">
                        {{dateFormat(version.createdAt, 'yyyy/MM/dd hh:mm:ss')}}
                    </p>
                    <p class="post-version__list--author">
                        {{version.user.user_login}}@{{version.user.user_nickname}}
                    </p>
                </TimelineItem>
            </Timeline>
            <div class="post-version__list--footer">共计 {{versions.length}} 个版本</div>
        </div>
        <div class="post-version__content">
            <div class="post-version__content--header">
                <h3 class="post-version__content--title">
                    <span>文章“</span><span class="post-version__content--title--pt">{{currentPost.post_title}}</span><span>”的历史版本信息</span>
                </h3>
                <div class="post-version__content--desc" v-if="active">
                    修改时间: <span class="mr-4">{{dateFormat(active.createdAt, 'yyyy/MM/dd hh:mm:ss')}}</span> 修改者: <span>{{active.user.user_login}}@{{active.user.user_nickname}}</span>
                </div>
                <Tag checkable color="blue" style="position: absolute;top: 11px; right: 15px;" v-show="isCurrent">当前版本</Tag>
            </div>
            <div class="post-version__content--body">
                <!--<code-diff ></code-diff>-->
                <div v-if="active" style="position: absolute;  top: 0; right: 0; left: 0;bottom: 1rem;overflow-y: scroll">
                <!-- 标题-->
                    <h2 v-if="showTitle">标题:</h2>
                    <code-diff v-if="showTitle"  :old-string="currentPost.post_title" :new-string="active.post_title" :context="1" header="标题"/>

                    <h2 v-if="showCategory">分类</h2>
                    <div v-if="showCategory">
                        <hr>
                        当前版本: {{categoryName(this.currentPost.category_id)}}
                        <br>
                        此版本: {{categoryName(this.activeCategory)}}
                        <hr>
                    </div>

                    <h2 v-if="showTags">标签</h2>
                    <div v-if="showTags">
                        <hr>
                        当前：<Tag v-for="(item, index) in currentPost.new_tag" color="#fdf2d0" :key="index + '_'" :name="item">
                            <span style="color: #000000">{{item}}</span>
                        </Tag>
                        <br>
                        此版本：<Tag v-for="(item, index) in activeTags" color="#ded"  :key="index " :name="item"  >
                        <span style="color: #000000">{{item}}</span></Tag>
                        <hr>
                    </div>
                    <!--内容-->
                    <h2>内容:</h2>
                    <code-diff :old-string="currentPost.post_content" :new-string="active.post_content" :context="10" header="内容"/>
                    <h2 v-if="showExcerpt">摘录:</h2>
                    <code-diff v-if="showExcerpt" :old-string="currentPost.post_excerpt" :new-string="active.post_excerpt" :context="10" header="摘录"/>
                </div>
            </div>
            <div class="post-version__content--footer">
                <span class="mr-4">文章内容对比是当前编辑内容与所选版本对比</span>
                <Button type="primary" :disabled="isCurrent" @click="restore">恢复到此版本</Button>
            </div>
        </div>
    </div>
    <!--<code-diff :old-string="oldStr" :new-string="newStr" :context="10" />-->

</Modal>
</template>

<script>
import _ from 'lodash'
import CodeDiff from '@/components/code-diff/code-diff'
import {mapState, mapGetters} from 'vuex'
import {dateFormat} from '@/utils/common'
export default {
    name: 'version',
    data () {
        return {
            versionModel: this.visible,
            active: null
        }
    },
    components: {
        CodeDiff
    },
    computed: {
        ...mapState({
            'currentPost': state => state.post,
            'categoryList': state => state.data.categoryList
            // newTags: state => state.post.newTags
        }),
        ...mapGetters(['defaultCategoryValue']),
        versions: function () {
            return this.currentPost.revision
        },
        // 是否是当前版本
        isCurrent: function () {
            if (this.active) {
                return this.currentPost.updatedAt === this.active.updatedAt
            } else {
                return false
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
                return _.difference(this.currentPost.new_tag, tags).length // 取交集，无交集不显示
            }
            return true
        }
    },
    methods: {
        dateFormat,
        _setActiveId () {
            // 设置当前选择记录id 为第一项
            if (this.versions[0]) {
                this.active = this.versions[0]
            }
        },
        getVersionContent () {
            // console.log(active)
        },
        restore () {
            this.$store.commit('restore', this.active)
            this.versionModel = false
            this.$emit('restore')
        },
        categoryName (id) {
            let category = this.categoryList.find(i => i.id === id)
            return category ? `${category.name}#${id}` : `${id} (未知- 可能是错误的分类)`
        }
    },
    props: {
        visible: {
            type: Boolean
        }
    },
    watch: {
        versionModel: function (val) {
            if (!val) {
                this.$emit('update:visible', false)
            }
        },
        visible: function (val) {
            // consle.log(val)
            if (val) {
                this.versionModel = true
            }
        },
        'currentPost.id': '_setActiveId'
        // active: ''
    }
}
</script>
<style>
    .d2h-file-header {
        display: none;
    }
</style>
