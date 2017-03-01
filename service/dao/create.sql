/*
SQLyog Ultimate v11.27 (32 bit)
MySQL - 5.6.25 : Database - myblog
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`myblog` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `myblog`;

/*Table structure for table `j_commentmeta` */

DROP TABLE IF EXISTS `j_commentmeta`;

CREATE TABLE `j_commentmeta` (
  `meta_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` bigint(20) unsigned DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8_bin NOT NULL,
  `meta_value` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `comment_id` (`comment_id`),
  KEY `meta_key` (`meta_key`),
  CONSTRAINT `fk_j_cm_c` FOREIGN KEY (`comment_id`) REFERENCES `j_comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `j_commentmeta` */

/*Table structure for table `j_comments` */

DROP TABLE IF EXISTS `j_comments`;

CREATE TABLE `j_comments` (
  `comment_id` bigint(20) unsigned NOT NULL,
  `comment_post_id` bigint(20) unsigned DEFAULT '0' COMMENT '对应文章ID',
  `comment_author` tinytext CHARACTER SET utf8 COMMENT '评论者',
  `comment_author_email` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '评论者邮箱',
  `comment_author_url` varchar(200) CHARACTER SET utf8 DEFAULT NULL COMMENT '评论者网址',
  `comment_author_ip` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '评论者IP',
  `comment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `comment_content` text CHARACTER SET utf8 COMMENT '评论正文',
  `comment_karma` int(11) DEFAULT '0',
  `comment_approved` varchar(20) CHARACTER SET utf8 DEFAULT '1' COMMENT '评论是否被批准',
  `comment_agent` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '评论者的USER AGENT',
  `comment_type` varchar(20) CHARACTER SET utf8 DEFAULT NULL COMMENT '评论类型(pingback/普通)',
  `comment_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父评论ID',
  `user_id` bigint(20) unsigned DEFAULT '0' COMMENT '评论者用户ID（不一定存在）',
  PRIMARY KEY (`comment_id`),
  KEY `comment_approved` (`comment_approved`),
  KEY `comment_post_id` (`comment_id`),
  KEY `comment_approved_date` (`comment_approved`,`comment_date`),
  KEY `comment_date` (`comment_date`),
  KEY `comment_parent` (`comment_parent`),
  KEY `fk_j_c_p_idx` (`comment_post_id`),
  KEY `fk_j_c_u_idx` (`user_id`),
  CONSTRAINT `fk_j_c_c` FOREIGN KEY (`comment_parent`) REFERENCES `j_comments` (`comment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_j_c_p` FOREIGN KEY (`comment_post_id`) REFERENCES `j_posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_j_c_u` FOREIGN KEY (`user_id`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `j_comments` */

/*Table structure for table `j_postmeta` */

DROP TABLE IF EXISTS `j_postmeta`;

CREATE TABLE `j_postmeta` (
  `meta_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned DEFAULT NULL,
  `meta_key` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `meta_value` longtext COLLATE utf8_bin,
  PRIMARY KEY (`meta_id`),
  KEY `post_id` (`post_id`),
  KEY `meta_key` (`meta_key`),
  CONSTRAINT `fk_post` FOREIGN KEY (`post_id`) REFERENCES `j_posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `j_postmeta` */

/*Table structure for table `j_posts` */

DROP TABLE IF EXISTS `j_posts`;

CREATE TABLE `j_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) unsigned DEFAULT '0' COMMENT '创建者 ID',
  `post_date` timestamp NULL DEFAULT NULL COMMENT '发布时间',
  `post_content` longtext COLLATE utf8_bin COMMENT '正文',
  `post_title` text COLLATE utf8_bin COMMENT '标题',
  `post_excerpt` text COLLATE utf8_bin COMMENT '摘录',
  `post_status` varchar(20) COLLATE utf8_bin DEFAULT 'auto-draft' COMMENT '文章状态（publish/auto-draft/inherit/trash/delete等）',
  `comment_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT '评论状态（open/closed）',
  `ping_status` varchar(20) CHARACTER SET utf8 DEFAULT 'open' COMMENT 'PING状态（open/closed）\n是否公开',
  `post_password` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '文章密码',
  `post_name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '文章缩略名',
  `term_id` bigint(20) unsigned DEFAULT NULL COMMENT '所属分类',
  `pinged` text COLLATE utf8_bin COMMENT '已经PING过的链接',
  `post_modified` timestamp NULL DEFAULT NULL COMMENT '修改时间',
  `post_content_filtered` text COLLATE utf8_bin COMMENT '未知\n内容 过滤',
  `post_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父文章，主要用于PAGE',
  `guid` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '文章链接',
  `menu_order` int(11) DEFAULT '0' COMMENT '排序ID',
  `post_type` varchar(20) COLLATE utf8_bin DEFAULT 'post' COMMENT '文章类型（post/page等）',
  `post_mime_type` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'MIME类型',
  `comment_count` bigint(20) DEFAULT '0' COMMENT '评论总数',
  `seq_in_nb` int(11) DEFAULT '0',
  `delete_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
  `author` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '文章作者',
  `eye_count` bigint(20) DEFAULT '0' COMMENT '查看次数',
  PRIMARY KEY (`id`),
  KEY `post_name` (`post_name`),
  KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`id`),
  KEY `post_author` (`post_author`),
  KEY `fk_j_terms_idx` (`term_id`),
  CONSTRAINT `fk_j_terms` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_j_users` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `j_posts` */

insert  into `j_posts`(`id`,`post_author`,`post_date`,`post_content`,`post_title`,`post_excerpt`,`post_status`,`comment_status`,`ping_status`,`post_password`,`post_name`,`term_id`,`pinged`,`post_modified`,`post_content_filtered`,`post_parent`,`guid`,`menu_order`,`post_type`,`post_mime_type`,`comment_count`,`seq_in_nb`,`delete_at`,`create_at`,`author`,`eye_count`) values (63,1,NULL,'11asdasdasdaszxkcja\nzxkasdk\n#\nasdkajsd\nss\nasddasdssda\n![](http://)','无标题文章asd',NULL,'auto-draft','open','open',NULL,NULL,13,NULL,'2017-02-09 04:18:02',NULL,0,NULL,0,'post',NULL,0,0,NULL,'2017-02-08 05:53:01','jyx',0),(64,1,NULL,'22asdasdasdasdaaaaaaasdasdsssdasd','无标题文章kkk',NULL,'trash','open','open',NULL,NULL,13,NULL,'2017-02-08 19:04:49',NULL,0,NULL,0,'post',NULL,0,-1,'2017-02-10 05:16:59','2017-02-08 18:03:13','jyx',0),(65,1,NULL,'33sdasdasd','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,13,NULL,'2017-02-08 18:53:47',NULL,0,NULL,0,'post',NULL,0,-2,NULL,'2017-02-08 18:31:50','jyx',0),(66,1,NULL,'sssdaassasdasdasdasddasdwasdws','无标题文章2222',NULL,'trash','open','open','123',NULL,12,NULL,'2017-02-18 23:08:32',NULL,0,NULL,0,'post',NULL,0,0,'2017-02-20 05:30:56','2017-02-08 23:32:37','jyx',0),(67,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,14,NULL,'2017-02-08 15:37:26',NULL,0,NULL,0,'post',NULL,0,0,NULL,'2017-02-08 23:37:27','jyx',0),(70,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,14,NULL,'2017-02-08 16:17:43',NULL,0,NULL,0,'post',NULL,0,-1,NULL,'2017-02-09 00:17:43','jyx',0),(71,1,'2017-02-24 14:29:16','# 主要特性\n\n- 支持“标准”Markdown / CommonMark和Github风格的语法，也可变身为代码编辑器；\n- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；\n- 支持ToC（Table of Contents）、Emoji表情、Task lists、@链接等Markdown扩展语法；\n- 支持TeX科学公式（基于KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;\n- 支持识别和解析HTML标签，并且支持自定义过滤标签解析，具有可靠的安全性和几乎无限的扩展性；\n- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；\n- 兼容主流的浏览器（IE8+）和Zepto.js，且支持iPad等平板设备；\n- 支持自定义主题样式；\n\n\n### Editor.md\n\n![](https://pandao.github.io/editor.md/images/logos/editormd-logo-180x180.png)\n\n![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)\n\n**目录 (Table of Contents)**\n\n[TOCM]\n\n[TOC]\n\n# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n# Heading 1 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n## Heading 2 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n### Heading 3 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n#### Heading 4 link [Heading link](https://github.com/pandao/editor.md \"Heading link\") Heading link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n##### Heading 5 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n###### Heading 6 link [Heading link](https://github.com/pandao/editor.md \"Heading link\")\n\n#### 标题（用底线的形式）Heading (underline)\n\nThis is an H1\n=============\n\nThis is an H2\n-------------\n\n### 字符效果和横线等\n                \n----\n\n~~删除线~~ <s>删除线（开启识别HTML标签时）</s>\n*斜体字*      _斜体字_\n**粗体**  __粗体__\n***粗斜体*** ___粗斜体___\n\n上标：X<sub>2</sub>，下标：O<sup>2</sup>\n\n**缩写(同HTML的abbr标签)**\n\n> 即更长的单词或短语的缩写形式，前提是开启识别HTML标签时，已默认开启\n\nThe <abbr title=\"Hyper Text Markup Language\">HTML</abbr> specification is maintained by the <abbr title=\"World Wide Web Consortium\">W3C</abbr>.\n\n### 引用 Blockquotes\n\n> 引用文本 Blockquotes\n\n引用的行内混合 Blockquotes\n                    \n> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。\n\n### 锚点与链接 Links\n\n[普通链接](http://localhost/)\n\n[普通链接带标题](http://localhost/ \"普通链接带标题\")\n\n直接链接：<https://github.com>\n\n[锚点链接][anchor-id] \n\n[anchor-id]: http://www.this-anchor-link.com/\n\nGFM a-tail link @pandao\n\n> @pandao\n\n### 多语言代码高亮 Codes\n\n#### 行内代码 Inline code\n\n执行命令：`npm install marked`\n\n#### 缩进风格\n\n即缩进四个空格，也做为实现类似`<pre>`预格式化文本(Preformatted Text)的功能。\n\n    <?php\n        echo \"Hello world!\";\n    ?>\n    \n预格式化文本：\n\n    | First Header  | Second Header |\n    | ------------- | ------------- |\n    | Content Cell  | Content Cell  |\n    | Content Cell  | Content Cell  |\n\n#### JS代码　\n\n```javascript\nfunction test(){\n	console.log(\"Hello world!\");\n}\n \n(function(){\n    var box = function(){\n        return box.fn.init();\n    };\n\n    box.prototype = box.fn = {\n        init : function(){\n            console.log(\'box.init()\');\n\n			return this;\n        },\n\n		add : function(str){\n			alert(\"add\", str);\n\n			return this;\n		},\n\n		remove : function(str){\n			alert(\"remove\", str);\n\n			return this;\n		}\n    };\n    \n    box.fn.init.prototype = box.fn;\n    \n    window.box =box;\n})();\n\nvar testBox = box();\ntestBox.add(\"jQuery\").remove(\"jQuery\");\n```\n\n#### HTML代码 HTML codes\n\n```html\n<!DOCTYPE html>\n<html>\n    <head>\n        <mate charest=\"utf-8\" />\n        <title>Hello world!</title>\n    </head>\n    <body>\n        <h1>Hello world!</h1>\n    </body>\n</html>\n```\n\n### 图片 Images\n\nImage:\n\n![](https://pandao.github.io/editor.md/examples/images/4.jpg)\n\n> Follow your heart.\n\n![](https://pandao.github.io/editor.md/examples/images/8.jpg)\n\n> 图为：厦门白城沙滩\n\n图片加链接 (Image + Link)：\n\n[![](https://pandao.github.io/editor.md/examples/images/7.jpg)](https://pandao.github.io/editor.md/examples/images/7.jpg \"李健首张专辑《似水流年》封面\")\n\n> 图为：李健首张专辑《似水流年》封面\n                \n----\n\n### 列表 Lists\n\n#### 无序列表（减号）Unordered Lists (-)\n                \n- 列表一\n- 列表二\n- 列表三\n     \n#### 无序列表（星号）Unordered Lists (*)\n\n* 列表一\n* 列表二\n* 列表三\n\n#### 无序列表（加号和嵌套）Unordered Lists (+)\n                \n+ 列表一\n+ 列表二\n    + 列表二-1\n    + 列表二-2\n    + 列表二-3\n+ 列表三\n    * 列表一\n    * 列表二\n    * 列表三\n\n#### 有序列表 Ordered Lists (-)\n                \n1. 第一行\n2. 第二行\n3. 第三行\n\n#### GFM task list\n\n- [x] GFM task list 1\n- [x] GFM task list 2\n- [ ] GFM task list 3\n    - [ ] GFM task list 3-1\n    - [ ] GFM task list 3-2\n    - [ ] GFM task list 3-3\n- [ ] GFM task list 4\n    - [ ] GFM task list 4-1\n    - [ ] GFM task list 4-2\n                \n----\n                    \n### 绘制表格 Tables\n\n| 项目        | 价格   |  数量  |\n| --------   | -----:  | :----:  |\n| 计算机      | $1600   |   5     |\n| 手机        |   $12   |   12   |\n| 管线        |    $1    |  234  |\n                    \nFirst Header  | Second Header\n------------- | -------------\nContent Cell  | Content Cell\nContent Cell  | Content Cell \n\n| First Header  | Second Header |\n| ------------- | ------------- |\n| Content Cell  | Content Cell  |\n| Content Cell  | Content Cell  |\n\n| Function name | Description                    |\n| ------------- | ------------------------------ |\n| `help()`      | Display the help window.       |\n| `destroy()`   | **Destroy your computer!**     |\n\n| Left-Aligned  | Center Aligned  | Right Aligned |\n| :------------ |:---------------:| -----:|\n| col 3 is      | some wordy text | $1600 |\n| col 2 is      | centered        |   $12 |\n| zebra stripes | are neat        |    $1 |\n\n| Item      | Value |\n| --------- | -----:|\n| Computer  | $1600 |\n| Phone     |   $12 |\n| Pipe      |    $1 |\n                \n----\n\n#### 特殊符号 HTML Entities Codes\n\n&copy; &  &uml; &trade; &iexcl; &pound;\n&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot; \n\nX&sup2; Y&sup3; &frac34; &frac14;  &times;  &divide;   &raquo;\n\n18&ordm;C  &quot;  &apos;\n\n### Emoji表情 :smiley:\n\n> Blockquotes :star:\n\n#### GFM task lists & Emoji & fontAwesome icon emoji & editormd logo emoji :editormd-logo-5x:\n\n- [x] :smiley: @mentions, :smiley: #refs, [links](), **formatting**, and <del>tags</del> supported :editormd-logo:;\n- [x] list syntax required (any unordered or ordered list supported) :editormd-logo-3x:;\n- [x] [ ] :smiley: this is a complete item :smiley:;\n- [ ] []this is an incomplete item [test link](#) :fa-star: @pandao; \n- [ ] [ ]this is an incomplete item :fa-star: :fa-gear:;\n    - [ ] :smiley: this is an incomplete item [test link](#) :fa-star: :fa-gear:;\n    - [ ] :smiley: this is  :fa-star: :fa-gear: an incomplete item [test link](#);\n \n#### 反斜杠 Escape\n\n\\*literal asterisks\\*\n            \n### 科学公式 TeX(KaTeX)\n                    \n$$E=mc^2$$\n\n行内的公式$$E=mc^2$$行内的公式，行内的$$E=mc^2$$公式。\n\n$$\\(\\sqrt{3x-1}+(1+x)^2\\)$$\n                    \n$$\\sin(\\alpha)^{\\theta}=\\sum_{i=0}^{n}(x^i + \\cos(f))$$\n\n多行公式：\n\n```math\n\\displaystyle\n\\left( \\sum\\_{k=1}^n a\\_k b\\_k \\right)^2\n\\leq\n\\left( \\sum\\_{k=1}^n a\\_k^2 \\right)\n\\left( \\sum\\_{k=1}^n b\\_k^2 \\right)\n```\n\n```katex\n\\displaystyle \n    \\frac{1}{\n        \\Bigl(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigr) e^{\n        \\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {\n        1+\\frac{e^{-6\\pi}}\n        {1+\\frac{e^{-8\\pi}}\n         {1+\\cdots} }\n        } \n    }\n```\n\n```latex\nf(x) = \\int_{-\\infty}^\\infty\n    \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\n    \\,d\\xi\n```\n                \n### 绘制流程图 Flowchart\n\n```flow\nst=>start: 用户登陆\nop=>operation: 登陆操作\ncond=>condition: 登陆成功 Yes or No?\ne=>end: 进入后台\n\nst->op->cond\ncond(yes)->e\ncond(no)->op\n```\n                    \n### 绘制序列图 Sequence Diagram\n                    \n```seq\nAndrew->China: Says Hello \nNote right of China: China thinks\\nabout it \nChina-->Andrew: How are you? \nAndrew->>China: I am good thanks!\n```\n\n### End','test 文章',NULL,'publish','open','open',NULL,NULL,12,NULL,'2017-02-28 14:36:25',NULL,0,'58afd2bc54669560fe8fae92',0,'post',NULL,0,-1,NULL,'2017-02-09 00:35:36','jyx',0),(72,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,16,NULL,'2017-02-09 09:52:56',NULL,0,NULL,0,'post',NULL,0,0,NULL,'2017-02-09 17:52:56','jyx',0),(73,1,NULL,'# 3阿萨德','无标题文章3',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 21:17:04',NULL,0,NULL,0,'post',NULL,0,0,'2017-02-13 02:56:36','2017-02-10 05:17:04','jyx',0),(74,1,NULL,'2','无标题文章2',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 21:17:04',NULL,0,NULL,0,'post',NULL,0,-1,'2017-02-13 02:56:36','2017-02-10 05:17:05','jyx',0),(75,1,NULL,'1','无标题文章1',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 21:17:04',NULL,0,NULL,0,'post',NULL,0,-2,'2017-02-13 02:56:36','2017-02-10 05:17:05','jyx',0),(76,1,NULL,'12312321','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,13,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-3,NULL,'2017-02-12 19:23:53','jyx',0),(77,1,NULL,'# 在ubuntu 配置Nginx 反向代理\n> 也是坑爹，本来在我的服务器上有安装Apache2 原本想使用Apache2来做代理，但是Apache2 出了点问题无法重新启动，而且也关不掉。尝试解决无果后果断卸载，安装Nginx。\n更坑爹的我首次安装 不是很顺利，因为很早的时候我有安装过，但是问题很大。卸载重装多次也没办法。不过功夫不负有心人，还是被我解决了。\n\n***\n\n1. ### 首先有安装要卸载干净Nginx\n  1. ##### 删除nginx，–purge包括配置文件\n```bash\nsudo apt-get --purge remove nginx\n```\n  2. ##### 自动移除全部不使用的软件包\n```bash\nsudo apt-get autoremove\n```\n  3. ##### 罗列出与nginx相关的软件 \n```bash\ndpkg --get-selections|grep nginx\n```\n   执行结果：\n   ![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/a114f919-1414-47ac-99c9-9f39f910866d.png)\n  4. 删除掉3查询出来的结果\n  `sudo apt-get  --purge remove xxx`\n\n2. ### 查看nginx正在运行的进程，如果有就kill掉\n```bash\nps -ef |grep nginx\n```\n\n3. ### 全局查找与nginx相关的文件 并删除\n```bash\n sudo  find  /etc  -name  nginx* -exec  rm -rf {} \\;\n```\n\n4. ### 重新安装Nginx\n```bash\nsudo add-apt-repository ppa:nginx/stable \nsudo apt-get update\nsudo apt-get install nginx\n```\n执行结果 并查看：\n![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/58d965a3-8df6-4364-91b2-c63f90f9979f.png)\n```bash\ncurl http://127.0.0.1/\n```\n\n5. ### 配置反向代理\n   1. 进入nginx配置目录\n```bash\ncd /etc/nginx/conf.d\n# 编辑 前先拷贝一份\nsudo cp default.conf default.bak\nsudo vim default.conf\n```\ndefault.conf：\n```bash\nserver {\n        listen       80;\n        server_name  www.mbdoge.cn;\n        location / {\n            #root   /usr/share/nginx/html;\n            #index  index.html index.htm;\n            proxy_pass http://www.mbdoge.cn:3000/;\n            proxy_redirect off;\n            proxy_set_header X-Real-IP $remote_addr;\n            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        }\n        error_page   500 502 503 504  /50x.html;\n        location = /50x.html {\n            root   /usr/share/nginx/html;\n        }\n    }\n```\n\n## 至此完成配置\n> 总结\n  不想说话并print出一句 \n  hello world！','在ubuntu 配置Nginx 反向代理',NULL,'auto-draft','open','open','0',NULL,66,NULL,'2017-02-18 23:55:21',NULL,0,NULL,0,'post',NULL,0,0,NULL,'2017-02-18 23:53:39','jyx',0),(78,1,NULL,'# 在ubuntu 配置Nginx 反向代理\n> 也是坑爹，本来在我的服务器上有安装Apache2 原本想使用Apache2来做代理，但是Apache2 出了点问题无法重新启动，而且也关不掉。尝试解决无果后果断卸载，安装Nginx。\n更坑爹的我首次安装 不是很顺利，因为很早的时候我有安装过，但是问题很大。卸载重装多次也没办法。不过功夫不负有心人，还是被我解决了。\n\n***\n\n1. ### 首先有安装要卸载干净Nginx\n  1. ##### 删除nginx，–purge包括配置文件\n```bash\nsudo apt-get --purge remove nginx\n```\n  2. ##### 自动移除全部不使用的软件包\n```bash\nsudo apt-get autoremove\n```\n  3. ##### 罗列出与nginx相关的软件 \n```bash\ndpkg --get-selections|grep nginx\n```\n   执行结果：\n   ![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/a114f919-1414-47ac-99c9-9f39f910866d.png)\n  4. 删除掉3查询出来的结果\n  `sudo apt-get  --purge remove xxx`\n\n2. ### 查看nginx正在运行的进程，如果有就kill掉\n```bash\nps -ef |grep nginx\n```\n\n3. ### 全局查找与nginx相关的文件 并删除\n```bash\n sudo  find  /etc  -name  nginx* -exec  rm -rf {} \\;\n```\n\n4. ### 重新安装Nginx\n```bash\nsudo add-apt-repository ppa:nginx/stable \nsudo apt-get update\nsudo apt-get install nginx\n```\n执行结果 并查看：\n![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/58d965a3-8df6-4364-91b2-c63f90f9979f.png)\n```bash\ncurl http://127.0.0.1/\n```\n\n5. ### 配置反向代理\n   1. 进入nginx配置目录\n```bash\ncd /etc/nginx/conf.d\n# 编辑 前先拷贝一份\nsudo cp default.conf default.bak\nsudo vim default.conf\n```\ndefault.conf：\n```bash\nserver {\n        listen       80;\n        server_name  www.mbdoge.cn;\n        location / {\n            #root   /usr/share/nginx/html;\n            #index  index.html index.htm;\n            proxy_pass http://www.mbdoge.cn:3000/;\n            proxy_redirect off;\n            proxy_set_header X-Real-IP $remote_addr;\n            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        }\n        error_page   500 502 503 504  /50x.html;\n        location = /50x.html {\n            root   /usr/share/nginx/html;\n        }\n    }\n```\n\n## 至此完成配置\n> 总结\n  不想说话并print出一句 \n  hello world  ！\n	','在ubuntu 配置Nginx 反向代理',NULL,'auto-draft','open','open','1',NULL,66,NULL,'2017-02-19 05:00:02',NULL,0,NULL,0,'post',NULL,0,-1,NULL,'2017-02-19 04:54:25','jyx',0),(79,1,NULL,'# 在ubuntu 配置Nginx 反向代理\n> 也是坑爹，本来在我的服务器上有安装Apache2 原本想使用Apache2来做代理，但是Apache2 出了点问题无法重新启动，而且也关不掉。尝试解决无果后果断卸载，安装Nginx。\n更坑爹的我首次安装 不是很顺利，因为很早的时候我有安装过，但是问题很大。卸载重装多次也没办法。不过功夫不负有心人，还是被我解决了。\n\n***\n\n1. ### 首先有安装要卸载干净Nginx\n  1. ##### 删除nginx，–purge包括配置文件\n```bash\nsudo apt-get --purge remove nginx\n```\n  2. ##### 自动移除全部不使用的软件包\n```bash\nsudo apt-get autoremove\n```\n  3. ##### 罗列出与nginx相关的软件 \n```bash\ndpkg --get-selections|grep nginx\n```\n   执行结果：\n   ![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/a114f919-1414-47ac-99c9-9f39f910866d.png)\n  4. 删除掉3查询出来的结果\n  `sudo apt-get  --purge remove xxx`\n\n2. ### 查看nginx正在运行的进程，如果有就kill掉\n```bash\nps -ef |grep nginx\n```\n\n3. ### 全局查找与nginx相关的文件 并删除\n```bash\n sudo  find  /etc  -name  nginx* -exec  rm -rf {} \\;\n```\n\n4. ### 重新安装Nginx\n```bash\nsudo add-apt-repository ppa:nginx/stable \nsudo apt-get update\nsudo apt-get install nginx\n```\n执行结果 并查看：\n![](a079da93-118a-42de-8209-f2e6344fbd90_128_files/58d965a3-8df6-4364-91b2-c63f90f9979f.png)\n```bash\ncurl http://127.0.0.1/\n```\n\n5. ### 配置反向代理\n   1. 进入nginx配置目录\n```bash\ncd /etc/nginx/conf.d\n# 编辑 前先拷贝一份\nsudo cp default.conf default.bak\nsudo vim default.conf\n```\ndefault.conf：\n```bash\nserver {\n        listen       80;\n        server_name  www.mbdoge.cn;\n        location / {\n            #root   /usr/share/nginx/html;\n            #index  index.html index.htm;\n            proxy_pass http://www.mbdoge.cn:3000/;\n            proxy_redirect off;\n            proxy_set_header X-Real-IP $remote_addr;\n            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        }\n        error_page   500 502 503 504  /50x.html;\n        location = /50x.html {\n            root   /usr/share/nginx/html;\n        }\n    }\n```\n\n## 至此完成配置\n> 总结\n  不想说话并print出一句 \n  hello world ！','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-2,NULL,'2017-02-19 04:57:02','jyx',0),(80,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-3,NULL,'2017-02-19 05:01:14','jyx',0),(81,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-4,NULL,'2017-02-19 05:04:57','jyx',0),(82,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-5,NULL,'2017-02-19 05:06:40','jyx',0),(83,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-6,NULL,'2017-02-19 05:12:11','jyx',0),(84,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-7,NULL,'2017-02-19 05:14:13','jyx',0),(85,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,'2017-02-19 06:22:18',NULL,0,NULL,0,'post',NULL,0,-8,NULL,'2017-02-19 05:15:22','jyx',0),(86,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-8,NULL,'2017-02-19 05:16:01','jyx',0),(87,1,'2017-02-19 22:22:55','asdasdasdasdassss','无标题文章3333',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,'2017-02-19 06:09:05',NULL,0,'58a939bfa7210b3d4dd60007',0,'post',NULL,0,-9,NULL,'2017-02-19 05:17:31','jyx',0),(88,1,NULL,NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,NULL,NULL,0,NULL,0,'post',NULL,0,-9,NULL,'2017-02-19 05:17:53','jyx',0),(89,1,'2017-02-19 05:53:22','asdasdsssssasdsadsssss','无标题文章2222',NULL,'auto-draft','open','open',NULL,NULL,66,NULL,'2017-02-19 06:22:19',NULL,0,'58a851d174a664a584878673',0,'post',NULL,0,-10,NULL,'2017-02-19 05:18:36','jyx',0),(90,1,'2017-02-20 05:41:24','所谓的前后端分离，到底是分离什么呢？其实就是页面的渲染工作，之前是后端渲染好页面，交给前端来显示，分离后前端需要自己拼装html代码，然后再显示。前端来管理页面的渲染有很多好处，比如减少网络请求量，制作单页面应用等。事情听起来简单，但这么一分离又会牵扯到很多问','无标题文章333333<script>alert(3333)</script>',NULL,'publish','open','open',NULL,NULL,12,NULL,'2017-02-22 16:37:15',NULL,0,'58a9a084d3c6f4507599bf06',0,'post',NULL,0,-2,NULL,'2017-02-20 05:40:14','jyx',0),(91,1,'2017-02-20 05:41:50','aaa<script>alert(1)</script>sssssssssss\nsdsa\n\n# asd\n3 Sasd\nasdasd\nasdasd\n# sdas\n','无标题文章<script>alert(1)</script>',NULL,'publish','open','open',NULL,NULL,12,NULL,'2017-02-24 14:28:48',NULL,0,'58a9a09ed3c6f4507599bf08',0,'post',NULL,0,-3,NULL,'2017-02-20 05:41:45','jyx',0),(92,1,'2017-02-22 16:31:25','test','无标题文章',NULL,'publish','open','open',NULL,NULL,12,NULL,'2017-02-22 16:32:35',NULL,0,'58ad4c5d6eb01f69a3c6c4a8',0,'post',NULL,0,-4,NULL,'2017-02-22 16:29:43','jyx',0),(93,1,'2017-02-24 14:29:41','asdasd\naaa\nsdfsdf\nasd\nasd\nasd\nasd\nasd\nas\ndas\nd\na\nasd\nsad\n','无标题文章3444123123',NULL,'publish','open','open','321456',NULL,12,NULL,'2017-02-28 14:52:38',NULL,0,'58afd2d454669560fe8fae93',0,'post',NULL,0,-5,NULL,'2017-02-24 14:29:31','jyx',0),(94,1,'2017-02-24 14:45:52','sdfdsfasdasd\n&lsaquo; &***rsa*quo;**','测试sd',NULL,'publish','open','open',NULL,NULL,67,NULL,'2017-02-24 15:15:43',NULL,0,'58afd69f54669560fe8fae94',0,'post',NULL,0,0,NULL,'2017-02-24 14:45:47','jyx',0),(95,1,NULL,'asdsad','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,12,NULL,'2017-02-28 14:37:20',NULL,0,NULL,0,'post',NULL,0,-6,NULL,'2017-02-28 14:37:17','酱酱酱酱油鲜',0),(96,1,'2017-02-28 16:16:27','asdsa','作者测试+标签测试',NULL,'publish','open','open',NULL,NULL,12,NULL,'2017-02-28 17:03:19',NULL,0,'58b531db249e4469ce93d3b9',0,'post',NULL,0,-7,NULL,'2017-02-28 16:15:53','酱酱酱酱油鲜',0);

/*Table structure for table `j_term_relationships` */

DROP TABLE IF EXISTS `j_term_relationships`;

CREATE TABLE `j_term_relationships` (
  `object_id` bigint(20) unsigned NOT NULL COMMENT '对应文章ID/链接ID',
  `term_order` int(11) DEFAULT NULL COMMENT '排序',
  `term_id` bigint(20) unsigned NOT NULL COMMENT '对应分类方法ID',
  PRIMARY KEY (`object_id`,`term_id`),
  KEY `objid` (`object_id`),
  KEY `pk_j_term_idx` (`term_id`),
  CONSTRAINT `pk_j_post` FOREIGN KEY (`object_id`) REFERENCES `j_posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `pk_j_term` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个文章、链接和对应分类的关系';

/*Data for the table `j_term_relationships` */

insert  into `j_term_relationships`(`object_id`,`term_order`,`term_id`) values (85,0,59),(87,0,59),(88,0,63),(89,0,60),(89,1,64),(90,1,60),(90,0,63),(91,0,63),(91,1,64),(91,2,65),(93,0,59),(93,1,60),(96,0,59),(96,1,60),(96,2,63),(96,3,64);

/*Table structure for table `j_terms` */

DROP TABLE IF EXISTS `j_terms`;

CREATE TABLE `j_terms` (
  `term_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'term_id：分类ID',
  `name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '分类名',
  `slug` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '缩略名',
  `term_group` bigint(10) DEFAULT '0' COMMENT '组',
  `taxonomy` varchar(32) COLLATE utf8_bin DEFAULT NULL,
  `parent` bigint(20) unsigned DEFAULT NULL COMMENT '所属父分类方法ID',
  `count` bigint(20) DEFAULT NULL COMMENT '文章数统计',
  `description` longtext COLLATE utf8_bin COMMENT '说明\n',
  `delete_at` timestamp NULL DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`term_id`),
  UNIQUE KEY `term_name` (`name`,`taxonomy`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个目录、标签';

/*Data for the table `j_terms` */

insert  into `j_terms`(`term_id`,`name`,`slug`,`term_group`,`taxonomy`,`parent`,`count`,`description`,`delete_at`,`create_at`) values (12,'javascript',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(13,'html',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(14,'css',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(15,'asd',NULL,0,'category',NULL,0,'分类','2017-02-10 19:19:00','2017-02-09 15:00:00'),(16,'java2EE',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(17,'jquery',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(18,'git',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(19,'mac',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(20,'sql',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(21,'nodejs',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 15:00:00'),(39,'obkdd',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:57','2017-02-09 15:00:00'),(40,'test',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:53','2017-02-09 15:00:00'),(41,'test2',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:49','2017-02-09 15:00:00'),(43,'test22',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:45','2017-02-09 15:00:00'),(44,'test222',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:40','2017-02-09 15:00:00'),(45,'testsss',NULL,NULL,'category',NULL,0,'分类','2017-02-13 02:56:36','2017-02-09 15:00:00'),(47,'tttttss',NULL,NULL,'category',NULL,0,'分类','2017-02-13 03:00:44','2017-02-09 15:00:00'),(59,'test11',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 15:00:00'),(60,'java',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 15:00:00'),(63,'oo',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 15:00:00'),(64,'css',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 15:00:00'),(65,'s',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 15:00:00'),(66,'java',NULL,NULL,'category',NULL,0,'分类',NULL,'2017-02-12 19:25:43'),(67,'渗透',NULL,NULL,'category',NULL,0,'分类',NULL,'2017-02-12 19:25:59');

/*Table structure for table `j_usermeta` */

DROP TABLE IF EXISTS `j_usermeta`;

CREATE TABLE `j_usermeta` (
  `umeta_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8_bin NOT NULL,
  `meta_value` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`umeta_id`),
  KEY `fk_idx` (`user_id`),
  CONSTRAINT `fk` FOREIGN KEY (`user_id`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Data for the table `j_usermeta` */

/*Table structure for table `j_users` */

DROP TABLE IF EXISTS `j_users`;

CREATE TABLE `j_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_login` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `user_pass` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `user_nickname` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `user_email` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `user_url` varchar(100) CHARACTER SET utf8 DEFAULT NULL COMMENT '网址',
  `user_registered` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `user_activation_key` varchar(60) CHARACTER SET utf8 DEFAULT NULL COMMENT '激活码',
  `user_status` int(11) DEFAULT '0' COMMENT '用户状态',
  `display_name` varchar(250) CHARACTER SET utf8 DEFAULT NULL COMMENT '显示名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_login_UNIQUE` (`user_login`),
  KEY `user_login_key` (`user_login`),
  KEY `user_nickname` (`user_nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='这个用户表其实用户不多，\n只有超级管理员用户，有此账号就能管理博客后台';

/*Data for the table `j_users` */

insert  into `j_users`(`id`,`user_login`,`user_pass`,`user_nickname`,`user_email`,`user_url`,`user_registered`,`user_activation_key`,`user_status`,`display_name`) values (1,'jyx','$2a$10$99suXIoD.koRh.BT0HE9RO/IfGCP7V3nE7A2pspY1iv5r/Ub/E66i','酱酱酱酱油鲜','jyx@rpgame.net','www.mbdoge.cn',NULL,NULL,1,'管理员');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
