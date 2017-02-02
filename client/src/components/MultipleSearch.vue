<template>
    <div class="search dropdown selection multiple " :class='{"am-active":dropdownContentShow}' @click="click">
        <i class="am-icon-angle-down"></i>
        <a class="am-badge am-badge-default am-radius am-margin-left-xs" v-for="s in select">{{s.label}} <i class="am-icon-remove delete" @click.stop="s.select = false"></i></a>
        <!-- <a class="am-badge am-badge-primary am-radius">Free</a> -->
        <input class="search" autocomplete="off" tabindex="0" type="text" ref="input" @blur="blur" @focus="focus" v-model="text">
        <span class="sizer" ref="sizer">{{text}}</span>
        <ul class="am-dropdown-content am-text-xs" @click.stop v-show="selectNum">
            <li v-for="item in tagList " @click.stop.prevent="item.select = true" v-if="!item.select"><a>{{item.label}}</a></li>
        </ul>
    </div>
</template>
<style lang="less" scoped>
.multiple.search.dropdown, {
    cursor: text;
    padding: 0 2.1em  0 .2em;
    .am-badge {
        user-select: none;
        display: inline-block;
        white-space: normal;
    }
    input.search{
        display: inline-block;
        position: static;
        padding: 0;
        max-width: 100%;
        margin: .45240952em 0 .45240952em .14285714em;
        width: 2.2em;
        line-height: 1.21428571em;
        background: none!important;
        border: none!important;
        box-shadow: none!important;
        outline: 0;
        -webkit-tap-highlight-color: rgba(255,255,255,0);
        z-index: 2;
    }
}
.search.selection.dropdown {
    position: relative;
    word-wrap: break-word;
    outline: 0;
    min-height: 2em;
    color: rgba(0,0,0,.87);
    box-shadow: none;
    border: 1px solid rgba(34,36,38,.25);
    transition: box-shadow .1s ease,width .1s ease;
    &:hover {
        border-color: rgba(34,36,38,.55);
        box-shadow: none;
    }
    >span.sizer {
        line-height: 1.2142em;
        padding: .67861429em 2.1em .67861429em 1em;
        display: none;
        white-space: pre;
    }
    .am-icon-angle-down{
        cursor: pointer;
        position: absolute;
        width: auto;
        height: auto;
        line-height: 1em;
        top: .5em;
        right: 1em;
        z-index: 3;
        margin: -.5em;
        padding: .5em;
        opacity: .8;
        transition: opacity .1s ease;
    }
    .am-dropdown-content {
        // max-height: 230px;
    }
}
</style>
<script>
export default {
    data: function() {
        return {
            dropdownContentShow:false,
            tagList:[
                {label:'node',select:false},
                {label:'java',select:false},
                {label:'mysql',select:false},
                {label:'redis',select:false},
                {label:'网络安全',select:false},
                {label:'javascript',select:false},
                {label:'css',select:false},
                {label:'html',select:false},
                {label:'前端',select:false},
            ],
            text:'',
        }
    },
    components: {},
    computed: {
        selectNum(){
            // return this.selectNum.length;
            console.log(this.tagList.filter((item)=>item.select).length , this.tagList.length)
            return this.tagList.filter((item)=>item.select).length != this.tagList.length;
        },
        select(){
            return this.tagList.filter((item)=>item.select)
        }
    },
    methods: {
        click(){
            this.$nextTick(()=>{
                this.$refs.input.focus();
            });
        },
        focus(){
            this.dropdownContentShow = true;
            this.$nextTick(()=>{
                let closest_=(e)=>{
                    if(!$(e.target).closest(".search.dropdown.selection").length){
                        // console.log(222);
                        this.dropdownContentShow  = false;
                        $('body').off("click",closest_)
                    }
                }
                $('body').on("click",closest_)
            });
        },
        blur(){
            // this.dropdownContentShow = false;
        }
    },
    watch:{
        text(value){
            // console.log(value);
            if(value){
                console.log(this.$refs.sizer.clientWidth);
                this.$refs.input.style.width = this.$refs.sizer.offsetWidth
            }else{
                this.$refs.input.style.width = "";
            }
        }
    },
    mounted: function() {
        // console.log("404");
    }
}
</script>
