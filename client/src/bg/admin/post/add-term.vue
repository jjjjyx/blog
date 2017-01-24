<template>
<div class="row-content am-cf">
    <div class="row  am-cf">
        <div class="left-sidebar add-post" >
            <div class="new-tags ">
                <a class="am-badge am-badge-success am-round" @click="showAddTag"><i class="am-icon-plus"></i> 添加新分类</a>
                <form class="new-tags-form am-form">
                    <input type="text" placeholder="请输入分类名称" class="am-padding-xs" v-model="newTerm.name" maxlength="10"/>
                    <button type="button" class="am-btn am-btn-danger am-btn-xs" @click="add">新建</button>
                    <a class="am-btn am-btn-link am-btn-xs" @click="showAddTag">取消</a>
                </form>
            </div>
            <ul class="sidebar-nav">
                <li class="sidebar-nav-link curr" v-for="(item,index) in termList">
                    <div class="" :class="{'sidebar-nav-sub-title active':isActiveId == item.term_id}" @click="toggleDown($event,item)">
                        <i class="am-icon-tag sidebar-nav-link-logo"></i>
                        <span v-if="!item.editName">{{item.name}}</span>
                        <input v-else type="text" :value="item.name" @click.stop ref="editName" @blur="confirm(item)"  style="color:#868E8E;" maxlength="10"/>
                        <!-- @keyup.enter="confirm(item)" -->
                        <span class="am-icon-cog am-fr am-margin-right-sm sidebar-nav-sub-ico" v-if="isActiveId == item.term_id"></span>
                    </div>
                    <ul class="sidebar-nav sidebar-nav-sub" v-if="isActiveId == item.term_id">
                        <li class="sidebar-nav-link">
                            <a href="javascript:;" @click="editTagName(item)">
                                <span class="am-icon-edit sidebar-nav-link-logo" ></span> 修改名称
                            </a>
                        </li>
                        <li class="sidebar-nav-link">
                            <a href="javascript:;" @click="confirmDelete">
                                <span class="am-icon-trash-o sidebar-nav-link-logo"></span> 删除分类
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- <div class="middle-warpper">
            222
        </div>
        <div class="right-warpper">
            33
        </div> -->
        <router-view class="middle-warpper" ></router-view>
        <router-view class="right-warpper" name="rightW"></router-view>
    </div>
</div>
</template>
<style lang="less" scoped>
    @leftWidth :240px;
    @middleWidth :280px;
    @keyframes slideInY {
      0% {
          height: 0;
          opacity: 0;
        //   transform: scaleY(0);
      }
      100% {
        opacity: 1;
        height: auto;
        // transform: scaleY(1);
      }
    }
    @keyframes slideOutY {
      0% {
        opacity: 1;
                transform: scaleY(1);
      }
      100% {
        opacity: 0;
                transform: scaleY(0);
      }
    }
    .left-sidebar {
        width: @leftWidth;
        top: 1px;
        border-left: 1px solid #e9ecf3;
    }
    .middle-warpper {
        transition: all 0.4s ease-in-out;
        width: 280px;
        height: 100%;
        position: absolute;
        background-color: #fff;
        left: @leftWidth+1;
        top: 1px;
    }
    .theme-black {
        .left-sidebar {
            border-left: 1px solid #3a4144;
        }
    }
    .slide.in {
        animation-name: slideInY;
        transform-origin: top center;
    }
    .slide.out {
        animation-name: slideOutY;
        transform-origin: top center;
    }
    .right-warpper {
        position: relative;;
        margin-left: @leftWidth+@middleWidth+2-10;
        margin-top: -20px;

    }
    .new-tags {
        padding: 0 15px 15px;
        margin-top: 20px;
        margin-bottom: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
        .am-badge {
            padding: 8px 15px;
            font-size: 1.4rem;

        }
        .new-tags-form {
            display: none;
            margin: 10px 0 0;
            text-align: left;
        }
        .new-tags-form input{
            padding: .5rem;
            font-size: 1.2rem;
            margin-bottom: .5rem;
        }
    }
</style>
<script>
// import
import { mapGetters, mapActions,mapMutations } from 'vuex'
//
import {getAllTerm,addTerm,editTermName} from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            isShowNewTage: false,
            isActiveId :0,
            termList:[],
            newTerm:{
                name:''
            },
            showTermMenu:false,
            displayInput:false
        }
    },
    components: {},
    computed: {
        // ...mapGetters
        // active(){
        //
        //     if(this.termList.length){
        //         console.log(this.$route.params.id , this.termList[0].term_id,222);
        //         return (this.$route.params.id || this.termList[0].term_id)
        //     }else{
        //         return false;
        //     }
        // }
    },
    methods: {
        ...mapMutations([
            'toggleSidebar'
        ]),
        showAddTag(){
            $('.new-tags-form ').slideToggle(500);
            this.newTermName = '';
        },
        async add() {
            // if(!this.verification(this.newTerm.name)) return;
            let data = await addTerm(this.newTerm);
            if(data.code == 0) {
                let o = {
                    term_id: data.data.insertId,
                    isActive: false,
                    editName: false
                }
                this.termList.splice(0, 0, Object.assign(o,this.newTerm));
            }
            layer.alert(data.msg);
        },
        toggleDown(e,item){
            if(item.term_id == this.$route.params.term_id){
                item.editName = false;
                $(e.target).closest('.sidebar-nav-sub-title').toggleClass("active").siblings('.sidebar-nav-sub').slideToggle(500)
                    .end().find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
            }else{
                this.$router.push({ path: `/tag/${item.term_id}`})
            }
        },
        editTagName(item){
            item.editName=true;
            this.$nextTick(()=>{
                this.$refs.editName[0].focus();
                this.$refs.editName[0].select()
            });
        },
        verification(name){
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
            let result = reg.test(name);
            layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
            return result;
        },
        async confirm(item){
            if(!this.displayInput){
                this.displayInput = true;
                if(!this.verification(this.$refs.editName[0].value)){this.displayInput = false; return;}
                // layer.confirm(`修改分类名称->[${this.$refs.editName[0].value}]？`, {
                //     btn: ['确定','取消'] //按钮
                // }, async function(){
                let s = await editTermName({
                    term_id:this.isActiveId * 1,
                    name:this.$refs.editName[0].value
                })

                if(s.code == 0) {
                    item.editName = false;
                    item.name = this.$refs.editName[0].value
                }
                layer.alert(s.msg);

                this.displayInput = false;
                // }, ()=>{
                //     this.displayInput = false;
                // });

            }
        },
        confirmDelete(){
            layer.confirm(`删除分类会将分类下所有文章移动到回收站`, {
                btn: ['确定','取消'] //按钮
            }, async function(){
                let s = await deleteTerm({
                    term_id:this.isActiveId * 1,
                });

            }, ()=>{
                this.displayInput = false;
            });
        },
        async fetchData () {
            let data = await getAllTerm();
            if(data.code == 0){
                // let active = this.$route.params.term_id||data.data[0].term_id;
                data.data.forEach((item,index)=>{
                    // item.isActive = item.term_id == this.$route.params.term_id;
                    item.editName = false;
                    // if(item.term_id == this.$route.params.term_id){
                    //
                    // }
                });
                if(data.data.some((item)=>item.term_id == this.$route.params.term_id)){
                    this.isActiveId = this.$route.params.term_id;
                }else{
                    this.isActiveId = data.data[0].term_id;
                }
                this.termList = data.data;
            }
        }
        // action(){

        // }
    },
    watch: {
    // 如果路由有变化，会再次执行该方法
        '$route':function(){
            if(this.termList.some((item)=>item.term_id == this.$route.params.term_id)){
                this.isActiveId = this.$route.params.term_id;
            }else{
                this.isActiveId = data.data[0].term_id;
            }
        }
    },
    mounted: function() {
        // console.log(this.$route.params.id)
        this.toggleSidebar(true);
        this.fetchData();


    }
}
</script>
