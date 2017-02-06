<template>
    <form class="post-form markdown">
        <input class="title am-text-truncate" :value="title"/>
        <div class="post-tags-bar am-text-xs" ref="posttags">
            <span>标签</span>
            <div class="am-dropdown tag-drop" data-am-dropdown>
              <!-- <button class="am-btn am-btn-primary am-dropdown-toggle" data-am-dropdown-toggle>下拉列表 <span class="am-icon-caret-down"></span></button> -->
              <i class="am-icon-plus am-margin-right-xs am-dropdown-toggle"  data-am-dropdown-toggle></i>
              <div class="am-dropdown-content am-text-xs">
                  <h3 class="am-margin-0">复选框</h3>
                  <label class="am-checkbox" v-for="item in tagList">
                      <input type="checkbox" :value="item" data-am-ucheck v-model="selectTag"> {{item.name}}
                  </label>
              </div>
            </div>
            <!-- <input class="am-text-truncate"/> -->
            <a class="am-badge am-badge-default am-radius am-margin-left-xs" v-for="(s,index) in selectTag">{{s.name}} <i class="am-icon-remove delete" @click.stop="deleteSelectTag(index)"></i></a>
            <!-- <a class="am-badge am-badge-primary am-radius">Free</a> -->
            <input class="input-tag" autocomplete="off" tabindex="0" type="text" ref="inputtag" v-model="text" placeholder="点击此处添加标签" @keyup.enter="addTag">
            <!-- <span class="sizer" ref="sizer">{{text}}</span> -->
        </div>
        <span class="saving-notice">已保存</span>
        <div class="am-btn-toolbar post-nav">
            <div class="am-btn-group am-btn-group-sm">
                <button type="button" class="am-btn am-btn-link" title="标签" @click="showAddTag" :class="{active:isAddTagShow}"><i class="am-icon-tags"></i></button>
                <button type="button" class="am-btn am-btn-link" title="属性"><i class="am-icon-info-circle"></i></button>
                <button type="button" class="am-btn am-btn-link" title="附件"><i class="am-icon-paperclip fa-flip-horizontal"></i> <span>0</span></button>
            </div>
        </div>
        <div class="am-btn-toolbar post-toolbar">
            <div class="am-btn-group am-btn-group-sm" v-for="item in toolbarList">
                <button type="button" class="am-btn am-btn-default am-radius" :class="{'am-active':i.active}" :title="i.title" v-for="i in item" @click="toolbarBtnClick(i)"><i :class="i.className"></i></button>
            </div>

        </div>
        <div class="post-content" :style="postContent">
            <textarea id="post-content"></textarea>
        </div>
    </form>
</template>
<style lang="less" scoped>
    .post-form {
        height: 100%;
        overflow: hidden;
        background-color: #fff;
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
<script>
import Simplemde from "simplemde/dist/simplemde.min.js";
import "simplemde/dist/simplemde.min.css";
import { mapGetters, mapActions,mapMutations } from 'vuex'
import * as api from "../../../../public/js/netapi.js";
// import keyboardJS from "keyboardjs"
import key from "../../../../public/js/key.js";


export default {
    data: function() {
        return {
            title:'无标题文章',
            tagList:[

            ],
            selectTag:[],
            isAddTagShow:false,
            text:'',
            toolbar:{
                "bold": {
                    name: "bold",action: "toggleBold",className: "am-icon-bold",title: "Bold",default: true,active:false,
                },
                "italic": {
                    name: "italic",action: "toggleItalic",className: "am-icon-italic",title: "Italic",default: true,active:false,
                },
                "strikethrough": {
                    name: "strikethrough",action: "toggleStrikethrough",className: "am-icon-strikethrough",title: "Strikethrough",active:false,
                },
                "heading": {
                    name: "heading",action: "toggleHeadingSmaller",className: "am-icon-header",title: "Heading",default: true,active:false,
                },
                "separator-1": {
                    name: "separator-1"
                },
                "code": {
                    name: "code",action: "toggleCodeBlock",className: "am-icon-code",title: "Code",active:false,
                },
                "quote": {
                    name: "quote",action: "toggleBlockquote",className: "am-icon-quote-left",title: "Quote",default: true,active:false,
                },
                "unordered-list": {
                    name: "unordered-list",action: "toggleUnorderedList",className: "am-icon-list-ul",title: "Generic List",default: true,active:false,
                },
                "ordered-list": {
                    name: "ordered-list",action: "toggleOrderedList",className: "am-icon-list-ol",title: "Numbered List",default: true,active:false,
                },
                "clean-block": {
                    name: "clean-block",action: "cleanBlock",className: "am-icon-eraser fa-clean-block",title: "Clean block",active:false,
                },
                "separator-2": {
                    name: "separator-2"
                },
                "link": {
                    name: "link",action: "drawLink",className: "am-icon-link",title: "Create Link",default: true,active:false,
                },
                "image": {
                    name: "image",action: "drawImage",className: "am-icon-picture-o",title: "Insert Image",default: true,active:false,
                },
                "table": {
                    name: "table",action: "drawTable",className: "am-icon-table",title: "Insert Table",active:false,
                },
                "horizontal-rule": {
                    name: "horizontal-rule",action: "drawHorizontalRule",className: "am-icon-minus",title: "Insert Horizontal Line",active:false,
                },
                "separator-3": {
                    name: "separator-3"
                },
                "preview": {
                    name: "preview",action: "togglePreview",className: "am-icon-eye no-disable",title: "Toggle Preview",default: true,active:false,
                },
                "side-by-side": {
                    name: "side-by-side",action: "toggleSideBySide",className: "am-icon-columns no-disable no-mobile",title: "Toggle Side by Side",default: true,active:false,
                },
                "fullscreen": {
                    name: "fullscreen",action: "toggleFullScreen",className: "am-icon-arrows-alt no-disable no-mobile",title: "Toggle Fullscreen",default: true,active:false,
                },
                "separator-4": {
                    name: "separator-4"
                },
                "guide": {
                    name: "guide",action: "https://simplemde.com/markdown-guide",className: "am-icon-question-circle",title: "Markdown Guide",default: true,active:false,
                },
                // "separator-5": {
                // 	name: "separator-5"
                // },
                // "undo": {
                // 	name: "undo",
                // 	action: "undo",
                // 	className: "am-icon-undo no-disable",
                // 	title: "Undo",
                //
                // },
                // "redo": {
                // 	name: "redo",
                // 	action: "redo",
                // 	className: "am-icon-repeat no-disable",
                // 	title: "Redo"
                // }
            },
            simple:null,
        }
    },
    components: {},
    computed: {
        selectNum(){
            return this.tagList.filter((item)=>item.select).length != this.tagList.length;
        },
        select(){
            return this.tagList.filter((item)=>item.select)
        },
        postContent(){
            let height = this.contentHeight;
            height -= 82;
            if(this.isAddTagShow){
                height -= 25;
            }
            return {
                height:`${height}px`
            }
        },
        ...mapGetters([
            'contentHeight'
        ]),
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
        }
    },
    methods: {
        showAddTag(){
            this.isAddTagShow = !this.isAddTagShow;
            $(this.$refs.posttags).slideToggle(200);
            // if(this.isAddTagShow){
            //     this.$nextTick(()=>{
                    this.$refs.inputtag.focus();
            //     })
            // }
        },
        toolbarBtnClick(i){
            // this.simple[i.action]();
            if(typeof this.simple[i.action] === "function"){
                // console.log(this.simple[i.action])
                this.simple[i.action](this.simple);
            }else{
                window.open(i.action, "_blank");
            }
        },
        async addTag(){
            // console.log(this.text,api);
            if(!this.verification(this.text)) return;
            let data =  await api.addTag({
                name:this.text
            })
            // console.log(data);
            if(data.code==0){
                let o  = {
                    term_id:data.data.insertId,
                    name:this.text
                }
                this.tagList.push(o)
                this.selectTag.push(o)
                this.text = "";
            }else{
                layer.alert(data.msg)
            }
        },
        deleteSelectTag(index){
            this.selectTag.splice(index,1);
        },
        verification(name){
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
            let result = reg.test(name);
            layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
            return result;
        },
    },
    watch:{
        // text(value){
        //     console.log(value);
        //     if(value){
        //         console.log(this.$refs.sizer);
        //         this.$refs.input.style.width = this.$refs.sizer.offsetWidth
        //     }else{
        //         this.$refs.input.style.width = "";
        //     }
        // }
    },
    mounted:async function() {
        // console.log("404");
        this.simple = new Simplemde({
    		element: document.getElementById("post-content"),
            status: true,
            spellChecker:false,
            autoDownloadFontAwesome:false,
            toolbar: false//['heading-smaller','heading-bigger','horizontal-rule','clean-block'],
            // status: ["autosave", "lines", "words", "cursor"],
    	});
        this.simple.codemirror.on("cursorActivity",()=>{
    		var stat = this.simple.getState(this.simple);
            // console.log(stat);
    		for(var key in this.toolbar) {
				if(stat[key]) {
					this.toolbar[key].active = true;
				} else if(key != "fullscreen" && key != "side-by-side") {
					this.toolbar[key].active = false;
				}
    		}
    	});
        let data = await api.getAllTerm(1);
        if(data.code==0){
            this.tagList = data.data;
        }
        key.bind('tag',{
            keys:['ctrl+s'],
            oncall:(e)=>{
                e.preventDefault();
                console.log("保存");
            },
        })
        $('.tag-drop').dropdown();
    }
}
</script>
