## idea 下的 maven
写在前面：

> 本来标题应该是idea 热部署的，但是没成功啊，折腾了好久的idea maven的配置，干脆写成idea maven 的配置得了


##### 首先说明下环境
- java 1.7
- maven 3.3.9
- tomcat 使用的是maven带的
- idea 16.3.1

### idea 下载

这个下载链接很多，官网也有社区版（免费版），以及Ultimate版（收费）随便附上一个多版本下载地址

* [Download](http://www.jetbrains.org/display/IJOS/Download)

### 第一个问题出现
---
 ![图片](https://dn-coding-net-production-pp.qbox.me/0cc2ec09-6a9a-493d-9ddc-fe8a46c78c27.png)

> 原谅我图是从别的地方截的，因为我的已经解决了

加载maven 一直提示 loading archetype list 虽然这时候下一步可以点，但是进去后不能新建java 文件，也无法运行。

安装网上说的将

`Setting---->Build Tools → Maven → Importing, set VM options for importer to -Xmx1024m (默认的是-Xmx512m )`
就可以了
 ![图片](https://dn-coding-net-production-pp.qbox.me/ee8f9a78-3270-40cf-8e42-e141f4c6c270.png)

但是我设置完后重启都没有效果。果断怀疑是idea的问题 遂重新下载安装,此时碰到第另外一个问题，
> 此时心情已经快爆炸，因为我弄了好久了，每天除了上班就1-2小时的时间搞这东西。

### 第二个问题出现
----

idea卸载不干净,卸载重新安装后，原先设置全部都还在。肯定是有残留文件，找一波资料。
这个小问题轻松解决：
原来在home/Library下记录了所有安装软件的信息

``` bash
    cd ~/Library
    ls -al
    # 其中Caches ，
    # Config: ~/Library/Preferences/IdeaIc
    # System: ~/Library/Caches/IdeaIC
    # Plugins: ~/Library/Application Support/IdeaIC
    # Logs: ~/Library/Logs/IdeaIC

    # 保留的文件的残留信息
    # 逐个删除即可
```
再次重新安装 原汁原味新鲜的idea。

### 好吧继续回到第一个问题上

重新安装的idea 还是一个的问题，那么排除idea 的问题，那肯定是环境出问题了。到底是哪里呢，mvn 没有问题。
没有思路搜索一波姿势：发现如下：
[IntelliJ new project - maven archetype list empty](http://stackoverflow.com/questions/27893134/intellij-new-project-maven-archetype-list-empty)

> 这个网站真好，我大部分问题都能在这里得到解决，推荐大家

在评论区中发现：
 ![图片](https://dn-coding-net-production-pp.qbox.me/72e45c4f-f9c7-4258-88cb-506cd68c3682.png)

吓的我看一波host文件。

将host 一些乱七八糟的指向删除后，意外的正常了！！！！！ 激动啊。困扰了我2天的问题竟然只是host 一些乱七八糟的指向。

配改后的host文件：
 ![图片](https://dn-coding-net-production-pp.qbox.me/a57c8f21-7db6-4547-9ead-a27791d909a1.png)

改后

 ![图片](https://dn-coding-net-production-pp.qbox.me/c64efb38-ad5b-4471-a6f5-e05224d37ea7.png)

于是新建项目，又遇到问题。。。编译过慢
### 第3个问题

这个问题比较简单了 参考这里一下解决 [IDEA新建MAVEN项目时速度缓慢](http://blog.csdn.net/qq_30551211/article/details/51277444)

以及拷贝`archetype-catalog.xml` 文件到
`(你的maven仓库路径)/repository/org/apache/maven/archetype/archetype-catalog/2.4/`
下
至此 解决

 ![图片](https://dn-coding-net-production-pp.qbox.me/61294b63-a166-4770-ba77-78613389386d.png)

> 坑爹的热部署啊 还没解决啊！！！！

自从习惯了热部署带来的好处后，一发不可收拾。现在后头写起java代码，发现maven修改完一行代码就要重启一次，简直不能忍受啊。遂找姿势。

一开始我意思是我本机配置有问题（因为我印象中我以前写有热部署的），然后换回以前的win电脑尝试，无果。才发现我以前就是这样操蛋写代码，改一次重启一次服务。。。
既然以前这操蛋了，那现在可不行啊。


在网上找一波资料发现都说要把`Project >Build Automatically` 勾选，
 ![图片](https://dn-coding-net-production-pp.qbox.me/99921320-f52c-47a4-a7d4-a0a560888d1c.png)

 但是我表示这个选项是一致勾选的。
后又一尝试一些 mvn 命令后还是无效，翻墙，google看到博文说要将其转换成java web项目才能热部署。但是我是很想转
