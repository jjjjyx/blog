
//${sticky?'data-am-scrollspynav="{offsetTop: 45}" data-am-sticky="{top:80}"':''}
module.exports = {
    blog:(sticky)=>`
        <div class="part j-blog am-padding-vertical-sm" style="text-align:center;"  >
            <img src="${global.SITE.avatar}" alt="avatar" class="am-circle am-img-thumbnail am-margin-top-sm" height="90" width="90">
            <h3>酱酱酱酱油鲜</h3>
            <p>${global.SITE.sign}</p>
            <div class="social-ul">
                <li>
                    <a href="http://wpa.qq.com/msgrd?v=3&uin=871839012&site=qq&menu=yes" target="_blank"><i class="am-icon-qq"></i></a>
                </li>
                <li>
                    <a href="https://github.com/xsq871839012" target="_blank"><i class="am-icon-github"></i></a>
                </li>
                <li>
                    <a href="http://weibo.com/5403878645" target="_blank"><i class="am-icon-weibo"></i></a>
                </li>
                <li>
                    <a href="javascript:;" data-am-modal="{target: '#weixin-modal'}"><i class="am-icon-weixin"></i></a>
                </li>
                <li>
                    <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=jyx@rpgame.net" target="_blank"><i class="am-icon-envelope"></i></a>
                </li>
            </div>
        </div>
        `
}
