<template>
    <dl class="dl-horizontal sm am-text-sm am-text-left" >
        <dt>标题</dt>
        <dd>{{currentPost.post_title}}</dd>

        <dt>标签</dt>
        <dd>{{formatTag(currentPost.postTag)}}</dd>

        <dt>网址</dt>
        <dd>
            <a :href="currentPost.guid?('../../p/'+currentPost.guid):'javascript:;'" target="_blank">{{currentPost.guid||"-"}}</a>
        </dd>

        <dt>创建时间</dt>
        <dd>{{currentPost.create_at | dateFormat}}</dd>

        <dt>修改时间</dt>
        <dd>{{currentPost.post_modified | dateFormat}}</dd>

        <dt>作者</dt>
        <dd>{{currentPost.author}}</dd>

        <dt>创建者</dt>
        <dd>{{currentPost.post_author}}</dd>

        <dt>加密</dt>
        <dd class="am-text-xs">
              <a @click="setPass" v-if="!currentPost.ppassword">
                <i class="am-icon-lock"></i> 设置密码
              </a>
            <div v-else>
                <span><i class="am-icon-lock"></i> 已加密</span> <a  @click="unlock"><i class="am-icon-unlock"></i> 取消</a>
            </div>
        </dd>

        <!-- <dt>公开度</dt>
        <dd>
            <select data-am-selected>
              <option value="open">打开</option>
              <option value="closed">关闭</option>
            </select>
        </dd> -->

        <dt>评论状态</dt>
        <dd class="am-text-xs">
            <select  v-model="currentPost.comment_status" class="am-input-sm">
              <option value="open">打开</option>
              <option value="closed">关闭</option>
            </select>
            <a v-if="currentPost.post_status == 'publish'"><i class="am-icon-eye"></i> 查看评论 </a>
        </dd>

        <dt>文章状态</dt>
        <dd>
            {{status[currentPost.post_status]}}
            <!-- <select data-am-selected v-model="currentPost.post_status">
                <option value="publish">发布</option>
                <option value="auto-draft">草稿</option>
            </select> -->
        </dd>

    </dl>
</template>
<script>
import * as api from "public/js/netapi.js";
export default {
    data: function() {
        return {
            status: {
                'publish': '公开',
                'auto-draft': "自动草稿",
                'inherit': "继承",
                'trash': "回收站",
            },
        }
    },
    components: {},
    computed: {

    },
    props:{
        'currentPost':{
            required: true
        }
    },
    methods: {
        formatTag(tag){
            if(tag instanceof Array){
                return tag.map((item)=>item.name).join(";")||"-";
            }
            return "-";
        },
        async unlock(){
            // this.currentPost.post_password = ;
            delete this.currentPost.post_password;
            let data = await api.postUnlock(this.currentPost.id);
            if(data.code ==0){
                this.currentPost.ppassword = false;
                layer.msg("已取消加密");
            }
        },
        setPass(){
            this.pass="";
            layer.prompt({title: '输入任何口令，并确认', formType: 1,maxlength:20},(val, index)=>{
                if(val){
                    if(val.length<20&&val.length>=3){
                        this.currentPost.post_password = val;
                        this.currentPost.ppassword = true;
                        this.$emit('changePost',{ index })
                        // this.saveCurrPost();
                        // layer.msg("设置成功");
                        // layer.close(index);
                    }else{
                        layer.msg("密码长度不符")
                    }
                }else{
                    layer.close(index);
                }
            });
        },
    },
    mounted: function() {

    }
}
</script>
