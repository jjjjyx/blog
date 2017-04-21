<template>
<div class="row-content am-cf am-text-xs">
    <div class="row">
        <div class="am-u-sm-12 am-u-md-4 am-u-md-push-8">
            <div class="widget am-cf">
                <div class="widget-body  am-fr ">
                    <div class="am-g">
                        <div class="am-u-md-4">
                            <img class="am-img-circle am-img-thumbnail" src="http://oht47c0d0.bkt.clouddn.com/17-1-11/75763093-file_1484140871299_166f3.png" alt="">
                        </div>
                        <div class="am-u-md-8">
                            <p>这个头像这么萌不满意，你想要修改？</p>
                            <form class="am-form">
                                <div class="am-form-group">
                                    <input type="file" id="user-pic">
                                    <p class="am-form-help">请选择要上传的文件...</p>
                                    <button type="button" class="am-btn am-btn-primary am-btn-xs">保存</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="widget am-cf">
                <div class="widget-head am-cf">
                    <div class="widget-title am-fl">
                        修改密码
                    </div>
                </div>
                <form class="am-form tpl-form-border-form tpl-form-border-br widget-body  am-fr " id="user-changgePass" @submit.prevent>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-4 am-form-label"  >新密码</label>
                        <div class="am-u-sm-8">
                            <input type="password" id="doc-vld-pwd-1" name="new_pass" minlength="6" maxlength="18" data-foolish-msg="密码必须为6-18位 必须包含特殊字符和中英文" required class="tpl-form-input" placeholder="密码"
                                pattern="^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$">
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-4 am-form-label">确认密码</label>
                        <div class="am-u-sm-8">
                            <input type="password" id="doc-vld-pwd-2" name="cpass" class="tpl-form-input" placeholder="确认密码 "  data-equal-to="#doc-vld-pwd-1" required>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <div class="am-u-sm-9 am-u-sm-push-3">
                            <button type="submit" class="am-btn am-btn-primary">确认修改</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="am-u-sm-12 am-u-md-8 am-u-md-pull-4">
            <div class="widget am-cf">
                <form class="am-form tpl-form-border-form tpl-form-border-br widget-body  am-fr " id="user-info" @submit.prevent>
                    <div class="am-form-group">
                        <label for="user-name" class="am-u-sm-3 am-form-label">账号 <span class="tpl-form-line-small-title"> Account </span></label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-name" class="tpl-form-input" placeholder="账号 / Account" readonly :value="user.user_login">
                            <small>登录账号不可修改的</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-email" class="am-u-sm-3 am-form-label">昵称 <span class="tpl-form-line-small-title">Nickname</span></label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-email" class="tpl-form-input" name="user_nickname" :value="user.user_nickname" minlength="1" maxlength="8" placeholder="输入昵称（至少 1 个字符）" required>
                            <small>你的昵称,它将显示在主界面上</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-email" class="am-u-sm-3 am-form-label">主显名称 <span class="tpl-form-line-small-title"> display</span></label>
                        <div class="am-u-sm-9">
                            <input type="text" id="user-email" class="tpl-form-input" name="display_name" :value="user.display_name" maxlength="6" placeholder="输入主显名称（至少 1 个字符）">
                            <small>你的昵称,它将显示在导航上</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-email" class="am-u-sm-3 am-form-label">电子邮件 <span class="tpl-form-line-small-title"> Email </span></label>
                        <div class="am-u-sm-9">
                            <input type="email" id="user-email" name="user_email" class="tpl-form-input" placeholder="输入你的电子邮件 / Email" :value="user.user_email" required data-foolish-msg="自定义提示信息：输入地球上的电子邮箱撒">
                            <small>邮箱你懂得...</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <label for="user-intro" class="am-u-sm-3 am-form-label">简介 <span class="tpl-form-line-small-title"> Intro </span></label>
                        <div class="am-u-sm-9">
                            <textarea class="" rows="6" id="user-intro" name="intro" class="tpl-form-input" placeholder="输入个人简介" maxlength="260"></textarea>
                            <small>260字以内写出你的一生...</small>
                        </div>
                    </div>
                    <div class="am-form-group">
                        <div class="am-u-sm-9 am-u-sm-push-3">
                            <button type="submit" class="am-btn am-btn-primary">保存修改</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

</div>
</div>
</template>
<script>
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex'
import * as api from "public/js/netapi.js";
import {onValid,onInValid} from "public/js/tools.js";
export default {
    data: function() {
        return {}
    },
    components: {},
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    methods: {
        ...mapActions([
            'mergeUser'
        ])
    },
    mounted: function() {
        let self = this;
        $("#user-changgePass").validator({
            onValid,
            onInValid,
            submit: async function() {
                if (this.isFormValid()) {
                    let data = await api.updataUserPass($("#user-changgePass").serializeArray())
                    if(data.code==0){
                        layer.alert(data.msg,function(index){
                          window.location.href="/";
                          layer.close(index);
                        })
                    }else{
                        layer.msg(data.msg)
                    }
                }
                return false;
            }
        });
        $('#user-info').validator({
            onValid,
            onInValid,
            submit: async function() {
                if (this.isFormValid()) {
                    let data = await api.updataUserInfo(this.$element.serializeArray())
                    if(data.code==0){
                        self.mergeUser(data.data);
                        layer.msg("修改成功")
                    }else{
                        layer.msg(data.msg)
                    }
                }
                return false;
            }
        });
    }
}
</script>
