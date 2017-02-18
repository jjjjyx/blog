var http = require("http");

var fs = require("fs");
var cheerio = require("cheerio");
// var url = "https://dn-coding-net-production-avatar.qbox.me/Fruit-20.png?imageMogr2/thumbnail/128";
var path = require("path")
var async = require("async");

//
let tag = [
//     {
//     "name": "中国当代小说",
//     "src": "262669"
// }, {
//     "name": "中国近现代小说",
//     "src": "262667"
// }, {
//     "name": "中国古典小说",
//     "src": "262668"
// }, {
//     "name": "四大名著",
//     "src": "262677"
// }, {
//     "name": "外国小说",
//     "src": "262676"
// }, {
//     "name": "传记",
//     "src": "264006"
// }, {
//     "name": "言情",
//     "src": "262673"
// }, {
//     "name": "魔幻玄幻",
//     "src": "262681"
// }, {
//     "name": "历史小说",
//     "src": "262682"
// }, {
//     "name": "悬疑/惊悚",
//     "src": "264298"
// }, {
//     "name": "玄幻/新武侠",
//     "src": "264299"
// }, {
//     "name": "校园",
//     "src": "264300"
// }, {
//     "name": "叛逆/成长",
//     "src": "264301"
// }, {
//     "name": "大陆原创",
//     "src": "264302"
// }, {
//     "name": "爆笑/无厘头",
//     "src": "264303"
// }, {
//     "name": "爱情/情感",
//     "src": "264304"
// }, {
//     "name": "娱乐/偶像",
//     "src": "264297"
// }, {
//     "name": "其他青春文学",
//     "src": "264305"
// }, {
//     "name": "艺术理论",
//     "src": "262817"
// }, {
//     "name": "绘画",
//     "src": "262846"
// }, {
//     "name": "影视艺术",
//     "src": "262802"
// }, {
//     "name": "音乐",
//     "src": "262806"
// }, {
//     "name": "书法篆刻",
//     "src": "262822"
// }, {
//     "name": "设计",
//     "src": "262836"
// }, {
//     "name": "人体艺术",
//     "src": "262843"
// },
{
    "name": "建筑艺术",
    "src": "262845"
}, {
    "name": "艺术类考试",
    "src": "262818"
}, {
    "name": "幽默/笑话集",
    "src": "262591"
}, {
    "name": "小说/名著漫画版",
    "src": "262592"
}, {
    "name": "动漫学堂",
    "src": "262597"
}, {
    "name": "世界经典漫画集",
    "src": "262593"
}, {
    "name": "日韩漫画",
    "src": "262594"
}, {
    "name": "欧美漫画",
    "src": "262595"
}, {
    "name": "港台漫画",
    "src": "262596"
}, {
    "name": "大陆漫画",
    "src": "262598"
}, {
    "name": "其他国外漫画",
    "src": "262599"
}, {
    "name": "0-2岁",
    "src": "264322"
}, {
    "name": "3-6岁",
    "src": "264320"
}, {
    "name": "7-10岁",
    "src": "264319"
}, {
    "name": "11-14岁",
    "src": "264321"
}, {
    "name": "孕产育儿",
    "src": "262509"
}, {
    "name": "幼儿启蒙",
    "src": "264308"
}, {
    "name": "绘本",
    "src": "264313"
}, {
    "name": "益智游戏",
    "src": "264310"
}, {
    "name": "玩具书",
    "src": "264311"
}, {
    "name": "中国文化",
    "src": "263165"
}, {
    "name": "中国民俗",
    "src": "263166"
}, {
    "name": "文化评述",
    "src": "263167"
}, {
    "name": "文化理论",
    "src": "263168"
}, {
    "name": "世界文化",
    "src": "263169"
}, {
    "name": "地域文化",
    "src": "263174"
}, {
    "name": "神秘现象",
    "src": "263171"
}, {
    "name": "史",
    "src": "263170"
}, {
    "name": "政治",
    "src": "262887"
}, {
    "name": "军事",
    "src": "262898"
}, {
    "name": "政治军事类教材",
    "src": "262886"
}, {
    "name": "社会学",
    "src": "264389"
}, {
    "name": "社会科学总论",
    "src": "264390"
}, {
    "name": "文化人类学",
    "src": "264386"
}, {
    "name": "新闻传播",
    "src": "264384"
}, {
    "name": "语言文字",
    "src": "264383"
}, {
    "name": "图书馆学档案学",
    "src": "264387"
}, {
    "name": "心理学",
    "src": "264385"
}, {
    "name": "民法",
    "src": "263522"
}, {
    "name": "经济法",
    "src": "263524"
}, {
    "name": "法律法规",
    "src": "263533"
}, {
    "name": "法律实务",
    "src": "263530"
}, {
    "name": "刑法",
    "src": "263515"
}, {
    "name": "法律工具书",
    "src": "263532"
}, {
    "name": "经济学理论",
    "src": "263265"
}, {
    "name": "中国经济",
    "src": "263260"
}, {
    "name": "国际经济",
    "src": "263272"
}, {
    "name": "通俗读物",
    "src": "263267"
}, {
    "name": "经济史",
    "src": "263269"
}, {
    "name": "统计审计",
    "src": "263261"
}, {
    "name": "财政税收",
    "src": "263275"
}, {
    "name": "贸易政策",
    "src": "263264"
}, {
    "name": "保险学",
    "src": "263276"
}, {
    "name": "证券/股票",
    "src": "263041"
}, {
    "name": "基金",
    "src": "263048"
}, {
    "name": "期货",
    "src": "263044"
}, {
    "name": "外汇",
    "src": "263042"
}, {
    "name": "保险",
    "src": "263052"
}, {
    "name": "彩票",
    "src": "263051"
}, {
    "name": "购房置业",
    "src": "263050"
}, {
    "name": "女性理财",
    "src": "263045"
}, {
    "name": "纳税",
    "src": "263046"
}, {
    "name": "一般管理学",
    "src": "263571"
}, {
    "name": "会计",
    "src": "263577"
}, {
    "name": "市场/营销",
    "src": "263572"
}, {
    "name": "战略管理",
    "src": "263570"
}, {
    "name": "生产与运作管理",
    "src": "263573"
}, {
    "name": "管理信息系统",
    "src": "263580"
}, {
    "name": "金融/投资",
    "src": "263576"
}, {
    "name": "电子商务",
    "src": "263582"
}, {
    "name": "MBA",
    "src": "263585"
}, {
    "name": "成功/激励",
    "src": "264220"
}, {
    "name": "人生哲学",
    "src": "264206"
}, {
    "name": "心灵与修养",
    "src": "264204"
}, {
    "name": "智商/智谋",
    "src": "264202"
}, {
    "name": "情商/情绪管理",
    "src": "264208"
}, {
    "name": "人在职场",
    "src": "264205"
}, {
    "name": "人际交往",
    "src": "264207"
}, {
    "name": "名人励志",
    "src": "264213"
}, {
    "name": "财商/财富智慧",
    "src": "264221"
}, {
    "name": "国内自助游",
    "src": "264245"
}, {
    "name": "国外自助游",
    "src": "264244"
}, {
    "name": "城市自助游",
    "src": "264247"
}, {
    "name": "户外探险",
    "src": "264243"
}, {
    "name": "旅游随笔",
    "src": "264238"
}, {
    "name": "旅游攻略",
    "src": "264241"
}, {
    "name": "家常菜谱",
    "src": "264282"
}, {
    "name": "烘焙甜品",
    "src": "264278"
}, {
    "name": "烹饪理论",
    "src": "264280"
}, {
    "name": "餐饮指南",
    "src": "264284"
}, {
    "name": "饮食文化",
    "src": "264277"
}, {
    "name": "瑜伽",
    "src": "264264"
}, {
    "name": "体育运动",
    "src": "262523"
}, {
    "name": "减肥/瘦身",
    "src": "264274"
}, {
    "name": "化妆",
    "src": "264275"
}, {
    "name": "服装搭配",
    "src": "26427"
}, {
    "name": "手工DIY",
    "src": "262626"
}, {
    "name": "风水占卜",
    "src": "262631"
}, {
    "name": "星座运程",
    "src": "262623"
}, {
    "name": "生活窍门",
    "src": "262627"
}, {
    "name": "休闲游戏",
    "src": "262624"
}, {
    "name": "两性",
    "src": "262513"
}, {
    "name": "中职教材",
    "src": "264121"
}, {
    "name": "研究生/本科/专科",
    "src": "264122"
}, {
    "name": "高职高专教材",
    "src": "264123"
}, {
    "name": "成人教育教材",
    "src": "264124"
}, {
    "name": "中小学教辅",
    "src": "262522"
}, {
    "name": "自学考试",
    "src": "264125"
}, {
    "name": "外语考试",
    "src": "264128"
}, {
    "name": "考研",
    "src": "264129"
}, {
    "name": "计算机考试",
    "src": "264131"
}, {
    "name": "成人高考",
    "src": "264132"
}, {
    "name": "英语综合教程",
    "src": "263054"
}, {
    "name": "英语读物",
    "src": "263094"
}, {
    "name": "英语考试",
    "src": "263068"
}, {
    "name": "小语种",
    "src": "263163"
}, {
    "name": "CET-4",
    "src": "263083"
}, {
    "name": "CET-6",
    "src": "263084"
}, {
    "name": "雅思IELTS",
    "src": "263074"
}, {
    "name": "托福TOEFL",
    "src": "263076"
}, {
    "name": "GRE",
    "src": "263086"
}, {
    "name": "英语工具书",
    "src": "262611"
}, {
    "name": "文学鉴赏辞典",
    "src": "262612"
}, {
    "name": "汉语工具书",
    "src": "262613"
}, {
    "name": "百科全书/年鉴",
    "src": "262614"
}, {
    "name": "其他语种工具书",
    "src": "262615"
}, {
    "name": "计算机理论",
    "src": "263415"
}, {
    "name": "硬件外部设备",
    "src": "263402"
}, {
    "name": "操作系统",
    "src": "263422"
}, {
    "name": "数据库",
    "src": "263408"
}, {
    "name": "CAD/CAM/CAE",
    "src": "263424"
}, {
    "name": "网络与数据通信",
    "src": "263405"
}, {
    "name": "程序设计",
    "src": "263421"
}, {
    "name": "软件工程开发",
    "src": "263409"
}, {
    "name": "IT互联网",
    "src": "262506"
}, {
    "name": "建筑史",
    "src": "264049"
}, {
    "name": "建筑科学",
    "src": "264051"
}, {
    "name": "建筑外观设计",
    "src": "264048"
}, {
    "name": "园林景观",
    "src": "264038"
}, {
    "name": "室内设计",
    "src": "264047"
}, {
    "name": "施工与监理",
    "src": "264050"
}, {
    "name": "工程经济与管理",
    "src": "264053"
}, {
    "name": "城市规划",
    "src": "264054"
}, {
    "name": "建筑教材教辅",
    "src": "264052"
}, {
    "name": "总论",
    "src": "263336"
}, {
    "name": "物理学",
    "src": "263337"
}, {
    "name": "天文学",
    "src": "263338"
}, {
    "name": "数学",
    "src": "263339"
}, {
    "name": "生物科学",
    "src": "263340"
}, {
    "name": "力学",
    "src": "263341"
}, {
    "name": "化学",
    "src": "263343"
}, {
    "name": "科技史",
    "src": "263342"
}, {
    "name": "地球科学",
    "src": "263344"
}, {
    "name": "预防医学/卫生学",
    "src": "262699"
}, {
    "name": "临床医学理论",
    "src": "262759"
}, {
    "name": "内科学",
    "src": "262747"
}, {
    "name": "外科学",
    "src": "262737"
}, {
    "name": "妇产科学",
    "src": "262779"
}, {
    "name": "儿科学",
    "src": "262784"
}, {
    "name": "中医学",
    "src": "262691"
}, {
    "name": "药学",
    "src": "262732"
}, {
    "name": "护理学",
    "src": "262778"
}, {
    "name": "宗教与精神生活",
    "src": "383555"
}, {
    "name": "科学幻想",
    "src": "383557"
}, {
    "name": "科学",
    "src": "383558"
}, {
    "name": "旅游",
    "src": "383562"
}, {
    "name": "中国题材",
    "src": "383568"
}, {
    "name": "儿童图书",
    "src": "383538"
}, {
    "name": "食品与酒类",
    "src": "383541"
}, {
    "name": "休闲娱乐",
    "src": "383542"
}, {
    "name": "身心健康",
    "src": "383543"
}, {
    "name": "历史",
    "src": "383544"
}, {
    "name": "家居与园艺",
    "src": "383545"
}, {
    "name": "文学与虚构类",
    "src": "383547"
}, {
    "name": "推理与惊悚",
    "src": "383549"
}, {
    "name": "非虚构类",
    "src": "383550"
}, {
    "name": "养育与家庭",
    "src": "383552"
}, {
    "name": "医学",
    "src": "383548"
}, {
    "name": "参考书",
    "src": "383554"
}, {
    "name": "时尚美妆",
    "src": "383509"
}, {
    "name": "财经管理",
    "src": "383510"
}, {
    "name": "母婴育儿",
    "src": "383511"
}, {
    "name": "旅游地理",
    "src": "383512"
}, {
    "name": "社会人文",
    "src": "383516"
}, {
    "name": "文学文摘",
    "src": "383517"
}, {
    "name": "生活休闲",
    "src": "383518"
}, {
    "name": "健康美食",
    "src": "383519"
}, {
    "name": "男士",
    "src": "383521"
}, {
    "name": "影音娱乐",
    "src": "383526"
}, {
    "name": "科普期刊",
    "src": "383522"
}, {
    "name": "语言与教学",
    "src": "383527"
}, {
    "name": "体育运动",
    "src": "383528"
}, {
    "name": "行业刊物",
    "src": "383531"
}, {
    "name": "期刊合订本",
    "src": "383532"
}, {
    "name": "外版杂志",
    "src": "383533"
}]

let funArr = []

tag.forEach(function (tagItem) {
    for (let cp = 1; cp <= 600; cp++) {
        let url = `http://list.suning.com/emall/bookShowProductList.do?ci=${tagItem.src}&pg=09&n=2&cp=${cp}&st=0&cc=010`;

        let fun = function (cb) {
            http.get(url, function (res) {
                var html = "";
                res.on("data", function (chunk) {
                    html += chunk;
                });
                res.on("end", function () {
                    var $ = cheerio.load(html);
                    if (!$(".search_noresult_tips").length) {
                        var date = []
                        $("#proList li").each(function () {
                            var item = {}
                            item['author'] = $('.commentStat .text-line .author>a', this).text();
                            item['booksName='] = $('.thirdInfo .sell', this).text();
                            item['isbn'] = $(this).find('.bookCover').attr('rel');
                            item['press'] = $('.commentStat .text-line>a', this).text();
                            item['price'] = $('.thirdInfo .bookPrice .fixedPrice>b', this).text().replace("¥", '');
                            item['publishDate'] = $('.commentStat .text-line .author+.text666', this).text().replace(/\//g, '');
                            item['type'] = tagItem.src;
                            item['typeName'] = tagItem.name;
                            item['context'] = $('.thirdInfo p.bookIntro', this).text();
                            item['imgUrl'] = $(this).find('.bookCover').attr('src');
                            date.push(item);
                        });
                        fs.appendFile(path.join(__dirname, 'books.bak'), JSON.stringify(date) + "\n", function (err, c) {
                            if (err) {
                                console.log(err);
                                cb(err)
                            } else {
                                cb(null, 'ok')
                            }
                        })
                    }else{
                        cb(null)
                    }
                })
            }).on("error", function (err) {
                console.log(err)
                cb(err)
            })
        }
        funArr.push(fun)
    }
})

async.series(funArr, function (err, result) {
    console.log("transaction error: " + err);
    console.log(result.length);
});
