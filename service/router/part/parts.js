const debug = require('debug')('app:routes:blog/parts' + process.pid),
    _ = require("lodash"),
    utils = require('../../utils'),
    postDao = require("../../dao/post.dao"),
    termDao = require("../../dao/term.dao"),
    siteDao = require("../../dao/site.dao"),
    visitorsDao = require("../../dao/visitors.dao");
//${sticky?'data-am-scrollspynav="{offsetTop: 45}" data-am-sticky="{top:80}"':''}
//${
const loopLi = function(li,data,mini){
    let str = `return \`${li}\`${mini?".split('\\n').map((s)=>s.trim()).join('')":""};`;
    return data.map((item)=>{
        return (new Function('item',str))(item)
    }).join("");
}

// >>  loopLi('hello ${item.name}',[{name:'world'},{name:'test'}])//

// let data = [{name:'world'},{name:'test'}];
// `<ul class="social-ul">${loopLi(
//         `<li>
//             <a href="#">\${item.name}</a>
//         </li>`,data,true)}</ul>`
// >> <ul class="social-ul">
//     <li> <a href="#">world</a> </li>
//     <li> <a href="#">test</a> </li>
// </ul>
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
        `,
    archives:async function(cb){
        let data = await postDao.asyncGetPostsGroup();
        // req.renderData.groupList = data;
        // <input type="text" ref="h" v-if="enabled" autocomplete="off" v-model="keyword" style="opacity: 0;position: absolute;top: 33px;background: transparent;outline: transparent;border: transparent;color: transparent;">
        // <%for(item of termList){%>
        //     <%if(item.name=='java'){%>
        //         <a class="tag active" data-tag='<%=item.name%>' @mouseover="mouseover" @mouseout="mouseout" target="_blank" href="/category/<%=item.slug%>">
        //             <span class="tags-icon">
        //                 <i class="<%=item.icon%>"></i>
        //             </span>
        //             <span><%=item.name%></span>
        //         </a>
        //     <%}else{%>
        //         <a class="tag" data-tag='<%=item.name%>' target="_blank" href="/category/<%=item.slug%>">
        //             <span class="tags-icon">
        //                 <i class="<%=item.icon%>"></i>
        //             </span>
        //             <span><%=item.name%></span>
        //         </a>
        //     <%}%>
        // <%}%>
        let k = `
        <div class="part">
            <div class="j-title">
                <h3 class="">标签</h3>
                <a href="/category" class="r btn btn-sm " style="color:#B3B3B3">
                    全部 &nbsp;&nbsp;<i class="am-icon-angle-right"></i>
                </a>
            </div>
            <div class="tags">
                ${loopLi(`<a class="tag" data-tag='${item.name}' target="_blank" href="/category/${item.slug}">
                    <span class="tags-icon">
                        <i class="${item.icon}"></i>
                    </span>
                    <span>${item.name}</span>
                </a>`,data)}
            </div>
        </div>
        `
        return cb(k)
    }
}

// <!-- <%-(async function (){return await part.archives()})()%> -->
// <!-- <%(async function (){%>
//     <%-"adasd"%>
//     <%-await part.archives()%>
// <%})()%> -->
