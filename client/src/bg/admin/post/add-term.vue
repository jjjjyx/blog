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
                <li class="sidebar-nav-link curr" v-for="(item,index) in categoryList" :class="{'active':isActiveId == item.term_id}" @click="toggleDown($event,item)">
                    <div class=" am-cf" :class="{'sidebar-nav-sub-title active':isActiveId == item.term_id}" >
                        <i class="am-icon-tag sidebar-nav-link-logo am-fl"></i>
                        <span class="am-text-truncate category-name am-fl">{{item.name}}</span>
                        <div class="am-dropdown sidebar-nav-sub-ico am-fr am-margin-right-sm" data-am-dropdown v-if="isActiveId == item.term_id">
                          <i class="am-icon-cog am-dropdown-toggle"  data-am-dropdown-toggle></i>
                          <ul class="am-dropdown-content am-text-xs">
                            <li><a >修改名称</a></li>
                            <li><a >删除分类</a></li>
                          </ul>
                        </div>
                    </div>

                </li>
            </ul>
        </div>
        <router-view class="middle-warpper" ></router-view>
        <router-view class="right-warpper" name="rightW"></router-view>
    </div>
    <div class="am-modal am-modal-prompt" tabindex="-1" id="my-prompt">
      <div class="am-modal-dialog">
        <div class="am-modal-hd">修改分类名称</div>
        <div class="am-modal-bd">
          <input type="text" class="am-modal-prompt-input" :value="activeName" ref="editName">
        </div>
        <div class="am-modal-footer">
          <span class="am-modal-btn" data-am-modal-cancel>取消</span>
          <span class="am-modal-btn" data-am-modal-confirm>提交</span>
        </div>
      </div>
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
      }
      100% {
        opacity: 1;
        height: auto;
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
    .category-name {
        display: block;
        width: 100px;
    }
    .left-sidebar {
        width: @leftWidth;
        top: 1px;
        border-left: 1px solid #e9ecf3;
        z-index: 100;
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
        .middle-warpper {
            background-color: #3a4144;
            border-right: 1px solid #282d2f;
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
        margin-left: @leftWidth+@middleWidth+2;
        // margin-top: -20px;

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
import {getAllTerm,addTerm,editTermName,deleteTerm} from "../../../../public/js/netapi.js";
export default {
    data: function() {
        return {
            isShowNewTage: false,
            // isActiveId :0,
            termList:[],
            newTerm:{
                name:''
            },
            showTermMenu:false,
            displayInput:false,
            activeName:''
        }
    },
    components: {},
    computed: {
        ...mapGetters([
            'categoryList',
            'isActiveId'
        ]),
    },
    methods: {
        ...mapMutations([
            'toggleSidebar',
            'setTerm'
        ]),
        ...mapActions([
            'setActiveId'
        ]),
        showAddTag(){
            $('.new-tags-form ').slideToggle(500);
            this.newTermName = '';
        },
        async add() {
            if(!this.verification(this.newTerm.name)) return;
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
            if(item.term_id != this.isActiveId){
                this.$router.push({ path: `/tag/${item.term_id}`})
                // item.editName = false;
                // $(e.target).closest('.sidebar-nav-sub-title').siblings('.sidebar-nav-sub').slideToggle(500)
                    // .end().find('.sidebar-nav-sub-ico').toggleClass('sidebar-nav-sub-ico-rotate');
            }
        },
        editTagName(item){
            item.editName=true;
            let self = this;
            $('#my-prompt').modal({
              relatedTarget: this,
              onConfirm: async function(e) {
                  if(!self.verification(e.data)) return;
                  let s = await editTermName({
                      term_id:self.isActiveId * 1,
                      name:e.data
                  })
                  if(s.code == 0) {
                      item.editName = false;
                      item.name = e.data;
                  }
                  layer.alert(s.msg);
              },
              onCancel: function(e) {
                // alert('不想说!');
              },
              dimmer:false,
            });
            this.$nextTick(()=>{
                this.$refs.editName.focus();
                this.$refs.editName.select()
            });
        },
        verification(name){
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
            let result = reg.test(name);
            layer.alert("请提交正确的分类名称，且名称只能包含中文英文，下划线，数字,且在长度不超过10！")
            return result;
        },
        confirmDelete(index){
            let self = this;
            layer.confirm(`删除分类会将分类下所有文章移动到回收站`, {
                btn: ['确定','取消'] //按钮
            }, async function(){
                let s = await deleteTerm(self.isActiveId * 1);
                 if(s.code == 0) {
                     self.$router.replace({ path: `/tag/`})
                     self.termList.splice(index,1);
                 }
                 layer.alert(s.msg);
            }, ()=>{
                this.displayInput = false;
            });
        },
        // action(){

        // }
    },
    watch: {
    // 如果路由有变化，会再次执行该方法
        '$route':function(){
            this.setActiveId(this.$route.params.term_id)
        }
    },
    mounted: function() {
        this.toggleSidebar(true);
        // this.$nextTick(()=>);
        setTimeout(()=>$('[data-am-dropdown]').dropdown(),500)
    },
    beforeRouteLeave(to,from,next){
        this.toggleSidebar(false);
        next();
    },
    async beforeRouteEnter(to, from, next){
        // console.log(222)
        let data = await getAllTerm();
        if(data.code == 0){
            next((vm)=>{
                vm.setTerm(data.data)
                vm.setActiveId(to.params.term_id)
            });
        }else{
            next(false)
        }


    }
}
</script>
