const mysql = require('mysql2')
const shortid = require('shortid')
const moment = require('moment')
const { postDao, sequelize, termDao } = require('./index')
// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog'
})


function formatDate (time, f = 'YYYY-MM-DD hh:mm:ss') {
    return moment(time).format(f)
}

// connection.query(
//     'SELECT * FROM `j_terms`',
//     function(err, results, fields) {
//         // console.log(results); // results contains rows returned by server
//         results.forEach((item) => {
//             let s = `INSERT INTO \`blog\`.\`j_terms\` (\`name\`, \`slug\`, \`taxonomy\`, \`description\`, \`createdAt\`, \`updatedAt\`) VALUES ('${item.name}', '${shortid.generate()}', '${item.taxonomy === 'category' ? 'category': 'post_tag'}', '${item.description}', '${formatDate(item.create_at)}', '${formatDate(item.create_at)}');`
//             console.log(s)
//         })
//
//     }
// );

connection.query(
    'SELECT * FROM `j_posts`',
    async function (err, results, fields) {
        // console.log(results); // results contains rows returned by server
        // console.log(postDao)

        let defaultTerm = await termDao.findByPk(1)
        results.forEach(async (item) => {
            if (item.post_status === 'publish') {
                // ${item.}
                // let s= `
                //     INSERT INTO \`j_posts\` (\`post_content\`,\`post_title\`,\`post_excerpt\`,\`post_status\`,\`comment_status\`,\`ping_status\`,\`post_name\`,\`guid\`,\`menu_order\`,\`post_type\`,\`comment_count\`,\`seq_in_nb\`,\`createdAt\`,\`updatedAt\`,\`post_author\`,\`post_date\`)
                //         VALUES ('${item.post_content}','${item.post_title}','${item}','publish','open','open','','','0','post','0','${item.seq_in_nb}','${formatDate(item.create_at)}','${formatDate(item.post_modified)}',1, '${formatDate(item.post_date)}')`
                try {
                    let obj = item
                    obj.id = undefined
                    obj.createdAt = item.create_at
                    obj.updatedAt = item.post_modified
                    obj.guid = shortid.generate()
                    let post = await postDao.create(obj)
                    await post.setTerms([defaultTerm])
                } catch (e) {
                    console.error('=========', e)
                }
                // console.log(s)
            }
            // let s = `INSERT INTO \`blog\`.\`j_terms\` (\`name\`, \`slug\`, \`taxonomy\`, \`description\`, \`createdAt\`, \`updatedAt\`) VALUES ('${item.name}', '${shortid.generate()}', '${item.taxonomy === 'category' ? 'category': 'post_tag'}', '${item.description}', '${formatDate(item.create_at)}', '${formatDate(item.create_at)}');`
            // console.log(s)
        })

    }
)

/*
 # 没有 icon
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('javascript', '0gyHX_b3_', 'category', 'JavaScript广泛用于客户端的脚本语言，最早是在HTML（标准通用标记语言下的一个应用）网页上使用，用来给HTML网页增加动态功能。', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('html5', 'iwTo6WHdaK', 'category', '万维网的核心语言、标准通用标记语言下的一个应用超文本标记语言（HTML）的第五次重大修改', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('css', '4fqs0SFbO3', 'category', 'CSS即层叠样式表（Cascading StyleSheet）。 在网页制作时采用层叠样式表技术，可以有效地对页面的布局、字体、颜色、背景和其它效果实现更加精确', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('asd', 'KX0kIbHHu4', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('java2EE', 'sBUo180DDm', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('jquery', 'Kxi9Krk6Mf', 'category', 'jQuery设计的宗旨是“write Less，Do More”，即倡导写更少的代码，做更多的事情。', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('git', 'u9M-PlxyWw', 'category', 'Git是一款免费、开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('mac', '027UjW6GOG', 'category', 'OS X系统是苹果机专用系统', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('sql', 'w9zwNR6DZT', 'category', '结构化查询语言(Structured Query Language)简称SQL', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('nodejs', 'pherVAJ6rM', 'category', 'Node.js是一个Javascript运行环境(runtime)。实际上它是对Google V8引擎进行了封装。V8引 擎执行Javascript的速度非常快', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('obkdd', '16zRImPCcl', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('test', 'XWBpDsJv3h', 'category', '增加重复测试', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('test2', '8fS6_TUUGg', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('test22', 'M46nPDQcbA', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('test222', 'rzGgbygjcF', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('testsss', '5E7vkep0a0', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('tttttss', 'keq1lT6T1yz', 'category', '分类', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('java', 'EXixiY3yveM', 'post_tag', '标签', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('oo', 'trA8c7kC3Mq', 'post_tag', '标签', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('css', 'CoQfoIhOkjb', 'post_tag', '标签', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('s', 'S9wCKLLVWaW', 'post_tag', '标签', '2017-02-09 03:00:00', '2017-02-09 03:00:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('java', 'apobCKMBrmD', 'category', 'Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。', '2017-02-12 07:25:43', '2017-02-12 07:25:43');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('渗透', 'luLzfnYdhDv', 'category', '嘿嘿嘿。你懂得', '2017-02-12 07:25:59', '2017-02-12 07:25:59');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('毕业论文', 'doClm5gLKFT', 'category', '我的毕业论文。别乱看都是要密码的~', '2017-03-01 09:53:55', '2017-03-01 09:53:55');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('null', 'pB9Ev-tuULo', 'post_tag', 'null', '2017-03-01 11:03:54', '2017-03-01 11:03:54');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('个人笔记', 'FJgkWbhwlHu', 'category', '随心而记', '2017-03-04 03:00:17', '2017-03-04 03:00:17');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('tttta', 'qF-OG7Hco2m', 'category', '分类', '2017-03-18 08:29:46', '2017-03-18 08:29:46');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('okbc', 'w1yF8f9q-8N', 'category', 'asdasdasdasd', '2017-03-18 08:34:00', '2017-03-18 08:34:00');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('okllla', 'dSqZSTAJLAn', 'category', 'askldjaskld', '2017-03-18 08:35:46', '2017-03-18 08:35:46');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('askdjas', '12oZJ2arLwc', 'category', 'aaaaa', '2017-03-18 08:39:06', '2017-03-18 08:39:06');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('vue', 'RqQGV3_LF_d', 'post_tag', '标签', '2017-03-18 09:42:08', '2017-03-18 09:42:08');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('分页', 'RrwGPLzKHmo', 'post_tag', '标签', '2017-03-18 09:42:16', '2017-03-18 09:42:16');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('orcale', 'sfSSqxcPScm', 'post_tag', '标签', '2017-03-18 10:12:08', '2017-03-18 10:12:08');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('mysql', 'HdpA0f1sdD-', 'post_tag', '标签', '2017-03-18 10:16:52', '2017-03-18 10:16:52');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('sql', 'LkugF4mQjtN', 'post_tag', '标签', '2017-03-18 10:16:56', '2017-03-18 10:16:56');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('垃圾表', 'AjmKJScQixp', 'post_tag', '标签', '2017-03-18 10:17:07', '2017-03-18 10:17:07');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('学习', 'SPFYfZfhW4c', 'post_tag', '标签', '2017-03-18 10:18:35', '2017-03-18 10:18:35');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('我爱学习', '_C9GtB3SaLp', 'post_tag', '标签', '2017-03-18 10:18:41', '2017-03-18 10:18:41');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('idea', 'kdVmZtGJTpV', 'post_tag', '标签', '2017-03-18 10:20:01', '2017-03-18 10:20:01');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('maven', 'WLR29nSLeYh', 'post_tag', '标签', '2017-03-18 10:20:04', '2017-03-18 10:20:04');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('ssh', 'iiNqPlqDIOW', 'post_tag', '标签', '2017-03-18 10:21:01', '2017-03-18 10:21:01');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('struts2', 'dmUcDfvuYy3', 'post_tag', '标签', '2017-03-18 10:21:08', '2017-03-18 10:21:08');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('spring', 'X74QrKoCnaM', 'post_tag', '标签', '2017-03-18 10:21:12', '2017-03-18 10:21:12');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('hibernate', 'traTnD3qKPO', 'post_tag', '标签', '2017-03-18 10:21:17', '2017-03-18 10:21:17');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('Sring', 'OXHZDihrfrX', 'post_tag', '标签', '2017-03-18 10:22:07', '2017-03-18 10:22:07');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('html', 'EiKI0FIVN39', 'post_tag', '标签', '2017-04-08 12:56:30', '2017-04-08 12:56:30');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('js', 'BfLLGc8B-P6', 'post_tag', '标签', '2017-04-08 12:56:36', '2017-04-08 12:56:36');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('servler', 'q96czGWB6hY', 'post_tag', '标签', '2017-04-15 03:30:12', '2017-04-15 03:30:12');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('jsp', 'MkQvaqi_hjH', 'post_tag', '标签', '2017-04-15 03:30:14', '2017-04-15 03:30:14');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('文件上传', 'vPMj90Dg1la', 'post_tag', '标签', '2017-04-15 03:30:23', '2017-04-15 03:30:23');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('webpack', 'I7g04K8eFdk', 'post_tag', '标签', '2017-04-21 07:16:12', '2017-04-21 07:16:12');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('aa', 'qPByAK4DF7Q', 'post_tag', '标签', '2017-04-21 09:28:09', '2017-04-21 09:28:09');
 INSERT INTO `blog`.`j_terms` (`name`, `slug`, `taxonomy`, `description`, `createdAt`, `updatedAt`) VALUES ('工作计划', 'STGP52bqEse', 'category', '分类', '2017-05-04 11:04:15', '2017-05-04 11:04:15');


 */
