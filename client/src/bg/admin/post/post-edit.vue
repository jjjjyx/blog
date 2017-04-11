<template>
    <form class="post-form markdown" @submit.prevent>
        <div v-if="!currentPost.id" class="dimmer am-vertical-align">
            <img src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png"/>
        </div>
        <input class="title am-text-truncate" v-model="currentPost.post_title" @input="change" @blur="blur"/>
        <div class="post-tags-bar am-text-xs" ref="posttags">
            <span>标签</span>
            <div class="am-dropdown tag-drop" data-am-dropdown>
              <!-- <button class="am-btn am-btn-primary am-dropdown-toggle" data-am-dropdown-toggle>下拉列表 <span class="am-icon-caret-down"></span></button> -->
              <i class="am-icon-plus am-margin-right-xs am-dropdown-toggle"  data-am-dropdown-toggle></i>
              <div class="am-dropdown-content am-text-xs" style="max-height: 300px; overflow-y: scroll;">
                  <h3 class="am-margin-0">标签列表</h3>
                  <label class="am-checkbox" v-for="item in tagList">
                      <input type="checkbox" :value="item" data-am-ucheck v-model="currentPost.postTag"> {{item.name}}
                      <i @click.stop.prevent="delTag(item)" class="am-close am-icon-times am-fr"></i>
                  </label>
              </div>
            </div>
            <a class="am-badge am-badge-default am-radius am-margin-left-xs" v-for="(s,index) in currentPost.postTag">{{s.name}} <i class="am-icon-remove delete" @click.stop="deleteSelectTag(index)"></i></a>
            <input class="input-tag" autocomplete="off" tabindex="0" type="text" ref="inputtag" v-model="text" placeholder="点击此处添加标签" @keyup.enter="addTag">
        </div>
        <span class="saving-notice">{{saveStatus}}</span>
        <div class="am-btn-toolbar post-nav">
            <div class="am-btn-group am-btn-group-sm">
                <button type="button" class="am-btn am-btn-link" title="标签" @click="showAddTag" :class="{active:isAddTagShow}"><i class="am-icon-tags"></i></button>
                <div class="am-dropdown am-btn-group-sm post-setting" data-am-dropdown>
                  <button type="button" class="am-btn am-btn-link am-dropdown-toggle" title="属性"><i class="am-icon-info-circle"></i></button>
                  <div class="am-dropdown-content" style="width:320px">
                    <dl class="dl-horizontal sm am-text-sm am-margin-bottom-0">
                        <dt>标题</dt>
                        <dd>{{currentPost.post_title}}</dd>

                        <dt>标签</dt>
                        <dd>{{formatTag(currentPost.postTag)}}</dd>

                        <dt>网址</dt>
                        <dd>
                            <a :href="currentPost.guid?('../../p/'+currentPost.guid):'javascript:;'" target="_blank">{{currentPost.guid||"-"}}</a>
                        </dd>

                        <dt>创建时间</dt>
                        <dd>{{dateFormat(currentPost.create_at)}}</dd>

                        <dt>修改时间</dt>
                        <dd>{{dateFormat(currentPost.post_modified)}}</dd>

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
                            <select data-am-selected v-model="currentPost.comment_status">
                              <option value="open">打开</option>
                              <option value="closed">关闭</option>
                            </select>
                            <a v-if="currentPost.post_status == 'publish'"><i class="am-icon-eye"></i> 查看评论 </a>
                        </dd>

                        <dt>文章状态</dt>
                        <dd>
                            {{currentPost.post_status}}
                            <!-- <select data-am-selected v-model="currentPost.post_status">
                                <option value="publish">发布</option>
                                <option value="auto-draft">草稿</option>
                            </select> -->
                        </dd>

                    </dl>
                    <div class="am-text-right">
                        <button class="am-btn am-btn-secondary am-round am-btn-xs" @click="saveCurrPost"><i class="am-icon-save"></i> 保存 </button>
                        <button v-if="currentPost.post_status=='auto-draft'" class="am-btn am-btn-success am-round am-btn-xs" @click="publish"><i class="am-icon-send"></i> 发布</button>
                        <button v-if="currentPost.post_status=='publish'" class="am-btn am-btn-success am-round am-btn-xs" @click="unPublish"><i class="am-icon-retweet"></i> 撤回草稿箱</button>

                    </div>
                  </div>
                </div>
                <button type="button" class="am-btn am-btn-link" title="附件"><i class="am-icon-paperclip fa-flip-horizontal"></i> <span>0</span></button>
            </div>
        </div>
        <!-- <div class="am-btn-toolbar post-toolbar">
            <div class="am-btn-group am-btn-group-sm" v-for="item in toolbarList">
                <button type="button" class="am-btn am-btn-default am-radius" :class="{'am-active':i.active}" :title="i.title" v-for="i in item" @click="toolbarBtnClick(i)"><i :class="i.className"></i></button>
            </div>
        </div> -->
        <div class="post-content" :style="postContent" >
            <div id="post-editormd">
                <textarea style="display:none;" placeholder="Enjoy Markdown! coding now..." >{{currentPost.post_content}}</textarea>
            </div>
            <!-- <textarea id="post-content" v-model="currentPost.post_content"></textarea> -->
        </div>
    </form>
</template>

<script>
// import Simplemde from "simplemde/dist/simplemde.min.js";
// import "simplemde/dist/simplemde.min.css";

import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
// import {dateFormat} from "../../../../public/js/netapi.js";
// import keyboardJS from "keyboardjs"
import key from "../../../../public/js/key.js";

export default {
    data: function() {
        return {
            // title:'无标题文章',
            pass:'',
            saveStatus:"已保存",
            selectTag:[],
            isAddTagShow:false,
            text:'',
            editormd,
        }
    },
    components: {},
    computed: {
        postContent(){
            let height = this.contentHeight;
            height -= 50;
            if(this.isAddTagShow){
                height -= 25;
            }
            return {
                height:`${height}px`
            }
        },
        toolbarList(){
            let arr = [];
            let temp = [];
            for(var key in this.toolbar) {
                if(key.indexOf("separator-") != -1) {
					arr.push(temp);
                    temp = [];
                    continue;
				}
                temp.push(this.toolbar[key]);
            }
            arr.push(temp);
            return arr;
        },
        ...mapGetters([
            'contentHeight', 'tagList', 'currentPost', 'isUpdateContent', 'lastPostId'
        ]),
    },
    methods: {
        ...mapMutations([
            // 'SET_CURRENDPOST_CONETENT'
        ]),
        ...mapActions([
            'setCurrendPostConetent', 'deleteTerm', 'merge'
        ]),
        // postUrl (guid){
        //
        //     return "-"
        // }
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
                        this.saveCurrPost();
                        layer.msg("设置成功");
                        layer.close(index);
                    }else{
                        layer.msg("密码长度不符")
                    }
                }else{
                    layer.close(index);
                }
            });
        },
        dateFormat(date){
            return date?new Date(date).format('yyyy/MM/dd hh:mm'):"-";
        },
        showAddTag(){
            this.isAddTagShow = !this.isAddTagShow;
            $(this.$refs.posttags).slideToggle(200);
            this.$refs.inputtag.focus();
        },
        async addTag(){
            // console.log(this.text,api);
            let r = this.tagList.find((item)=>item.name==this.text);
            let o;
            if(r){
                o  = r
            }else{
                if(!this.verification(this.text)) return;
                let data =  await api.addTag({
                    name:this.text
                })
                if(data.code==0){
                    o = data.data;
                    this.tagList.push(o)
                }else{
                    return layer.msg("添加失败，请重试！");

                }
            }
            this.text = "";
            this.currentPost.postTag.push(o);
            // console.log(this.currentPost);
        },
        deleteSelectTag(index){
            this.currentPost.postTag.splice(index,1);
            // console.log(this.currentPost);
        },
        delTag(item){
            api.deleteTag(item.term_id).then(()=>{
                this.deleteTerm(item.term_id)
            });

        },
        verification(name){
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
            let result = reg.test(name);
            if(!result)
                layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
            return result;
        },
        change(){
            this.enabledTitle = true;
        },
        blur(){
            if(this.enabledTitle){
                this.enabledTitle = false;
                this.saveCurrPost();
            }
        },
        async saveCurrPost(){
            let value = this.editormd.getMarkdown();
            this.setCurrendPostConetent(value);
            this.saveStatus = "保存中..";
            let data = await api.savePost(this.currentPost);
            this.merge(data.data);
            this.saveStatus = "已保存"
            // setTimeout(()=>this.saveStatus = "已保存",1000)
        },
        savePostTag(){
            api.savePostTag({id:this.currentPost.id,tagList:this.currentPost.postTag});
        },
        async publish(){
            let data = await api.postPublish(this.currentPost.id);
            if(data.code==0){
                this.merge(data.data);
                layer.msg(data.msg);
            }
        },
        async unPublish (){
            let data = await api.postUnPublish(this.currentPost.id);
            if(data.code==0){
                this.merge(data.data);
                layer.msg(data.msg);
            }
        },
        qiniuUpload(file ,{token,key,domain},fn){
            let xhr = new XMLHttpRequest();
            //创建表单
            xhr.open('POST', 'http://up-z2.qiniu.com/', true);
            var formData;
            formData = new FormData();
            formData.append('key', key);
            formData.append('token', token);
            formData.append('file', file);
            formData.append('mimeType', "image/jpeg");
            xhr.onreadystatechange = function(response) {
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                    fn(key,domain)
                } else {
                    console.log("failed...");
                }
            }
            //提交数据
            xhr.send(formData);
        }

    },
    watch:{
        // '$route':'fetchData',
        'isUpdateContent':function(v){
            if(this.editormd.cm)
                this.editormd.setMarkdown(v?v:'');
        },
        'currentPost.postTag'(v,ov){
            // 新旧不为空，且旧值不等于上次的文章
            if(v && ov && !_.isEqual(ov,this.lastPostId.postTag)){
                this.savePostTag();
            }
        }
    },
    mounted:async function() {
        let self = this;
        // console.log();
        editormd.emoji.path = "http://www.webpagefx.com/tools/emoji-cheat-sheet/graphics/emojis/";
        this.editormd = editormd("post-editormd", {
            path              : '/static/editormd/lib/',
            emoji             : true,
            imageUpload       : true,
            toolbarIcons:()=> [
                "undo", "redo", "|",
                "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
                "h1", "h2", "h3", "h4", "h5", "h6", "|",
                "list-ul", "list-ol", "hr", "|",
                "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|",
                "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|",
                "help", "publish"
            ],
            toolbarIconsClass:{
                publish:'am-icon-send'
            },
            onload:()=>{
                this.editormd.cm.getInputField().addEventListener("paste", async function (e) {
                    var clipboardData = event.clipboardData || window.clipboardData;
                    if (clipboardData) {
                         for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
                            var item = e.clipboardData.items[i];
                            if (item.kind === "file" && item.type == 'image/png') {
                                var pasteFile = item.getAsFile();
                                let tokenK = await api.getToken();
                                self.qiniuUpload(pasteFile,tokenK,(key,domain)=>{
                                    let img = `![](${domain}${key})\n`;
                                    self.editormd.insertValue(img);
                                })
                            }
                        }
                    }
                });
            },
            ouloadFn :async function(files,fn) {
                let tokenK = await api.getToken();
                self.qiniuUpload(files,tokenK,fn)
            }
        });


        let _time = null;
        this.editormd.on("change",()=>{
            if(_time)
                clearTimeout(_time);
            let value = this.editormd.getMarkdown();
            if(this.currentPost.post_content && value != this.currentPost.post_content){
                this.saveStatus = "已修改";
                _time = setTimeout(this.saveCurrPost,1200);
            }
        })

        key.bind('tag',{
            keys:['ctrl+s'],
            oncall:(e)=>{
                e.preventDefault();
                // console.log("保存");
                self.saveCurrPost();
            },
        })
        $('.tag-drop,.post-setting').dropdown();
    }
}
</script>
<style lang="less" scoped>
    .post-form {
        height: 100%;
        overflow: hidden;
        background-color: #fff;
        z-index: 100;
        .dimmer {
            position: absolute;
            top: 0!important;
            left: 0!important;
            width: 100%;
            height: 100%;
            text-align: center;
            vertical-align: middle;
            background-color: #f1f1f1;
            opacity: 1;
            line-height: 1;
            animation-fill-mode: both;
            animation-duration: .5s;
            transition: background-color .5s linear;
            user-select: none;
            will-change: opacity;
            z-index: 1000;
            > img {
                width: 120px;
                height: auto;
                border-radius: 50%;
                border: 5px solid rgba(255, 255, 255, 0.3);
                opacity: .5;
            }
        }
        .title {
            width: 100%;
            height: 50px;
            padding: 0 170px 0 20px;
            margin-bottom: 0;
            border: none;
            // border-bottom: 1px solid #d9d9d9;
            font-size: 25px;
            font-weight: normal;
            line-height: 30px;
            box-shadow: none;
            outline: none;
            -webkit-appearance: none;
        }
        .post-tags-bar {
            display: none;
            padding: 0 20px;
            background-color: #fff;
            cursor: default;
            color: #868E8E;
            .am-icon-plus {
                cursor: pointer;
            }
            .am-badge {
                user-select: none;
                display: inline-block;
                white-space: normal;
            }
            input.input-tag{
                display: inline-block;
                position: static;
                padding: 0;
                max-width: 100%;
                margin: .45240952em 0 .45240952em .14285714em;
                width: 8.2em;
                line-height: 1.21428571em;
                background: none!important;
                border: none!important;
                box-shadow: none!important;
                color: #000;
                outline: 0;
                -webkit-tap-highlight-color: rgba(255,255,255,0);
                z-index: 2;
            }
            span.sizer {
                line-height: 1.2142em;
                padding: .67861429em 2.1em .67861429em 1em;
                display: none;
                white-space: pre;
            }
        }
        .post-content {
            position: relative;
            overflow: auto;
        }
        .saving-notice {
            position: absolute;
            top: 0;
            right: 7px;
            z-index: 1140;
        }
    }
    .am-checkbox .am-close{
        display: none;
    }
    .am-checkbox:hover .am-close{
        display: block;
    }
    .saving-notice {
        font-size: 1.1rem;
        line-height: 20px;
    }
    .post-toolbar {
        padding: 0 20px;
    }
    .post-nav.am-btn-toolbar {
        position: absolute;
        right: 50px;
        top: 10px;
        .am-btn-link {
            padding-left: 10px;
            padding-right: 10px;
            color: #8e8e8e;
            cursor: pointer;
            &:hover,&:focus{
                text-decoration: none;
            }
            &.active {
                color: #2196F3;
            }
        }
        span{
            color: #ccc;
            text-decoration: none;
            font-size: 1.2rem;

        }
    }
</style>
