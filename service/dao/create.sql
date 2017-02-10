-- MySQL dump 10.13  Distrib 5.7.12, for osx10.9 (x86_64)
--
-- Host: 127.0.0.1    Database: myblog
-- ------------------------------------------------------
-- Server version	5.6.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `j_commentmeta`
--

DROP TABLE IF EXISTS `j_commentmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_commentmeta`
--

LOCK TABLES `j_commentmeta` WRITE;
/*!40000 ALTER TABLE `j_commentmeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `j_commentmeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_comments`
--

DROP TABLE IF EXISTS `j_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_comments`
--

LOCK TABLES `j_comments` WRITE;
/*!40000 ALTER TABLE `j_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `j_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_postmeta`
--

DROP TABLE IF EXISTS `j_postmeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_postmeta`
--

LOCK TABLES `j_postmeta` WRITE;
/*!40000 ALTER TABLE `j_postmeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `j_postmeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_posts`
--

DROP TABLE IF EXISTS `j_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `j_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_author` bigint(20) unsigned DEFAULT '0' COMMENT '对应作者ID',
  `post_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `post_content` longtext COLLATE utf8_bin COMMENT '正文',
  `post_title` text COLLATE utf8_bin COMMENT '标题',
  `post_excerpt` text COLLATE utf8_bin COMMENT '摘录',
  `post_status` varchar(20) COLLATE utf8_bin DEFAULT 'auto-draft' COMMENT '文章状态（publish/auto-draft/inherit/trash/delete等）',
  `comment_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT '评论状态（open/closed）',
  `ping_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT 'PING状态（open/closed）',
  `post_password` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '文章密码',
  `post_name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '文章缩略名',
  `term_id` bigint(20) unsigned DEFAULT NULL COMMENT '所属分类',
  `pinged` text COLLATE utf8_bin COMMENT '已经PING过的链接',
  `post_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `post_content_filtered` text COLLATE utf8_bin COMMENT '未知\n内容 过滤',
  `post_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父文章，主要用于PAGE',
  `guid` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '未知',
  `menu_order` int(11) DEFAULT '0' COMMENT '排序ID',
  `post_type` varchar(20) COLLATE utf8_bin DEFAULT 'post' COMMENT '文章类型（post/page等）',
  `post_mime_type` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'MIME类型',
  `comment_count` bigint(20) DEFAULT '0' COMMENT '评论总数',
  `seq_in_nb` int(11) DEFAULT '0',
  `delete_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_name` (`post_name`),
  KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`id`),
  KEY `post_author` (`post_author`),
  KEY `fk_j_terms_idx` (`term_id`),
  CONSTRAINT `fk_j_terms` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_j_users` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_posts`
--

LOCK TABLES `j_posts` WRITE;
/*!40000 ALTER TABLE `j_posts` DISABLE KEYS */;
INSERT INTO `j_posts` VALUES (63,1,'2017-02-07 21:53:01','11asdasdasdaszxkcja\nzxkasdk\n#\nasdkajsd\nss\nasddasdssda\n![](http://)','无标题文章asd',NULL,'auto-draft','open','open',NULL,NULL,13,NULL,'2017-02-08 20:18:02',NULL,0,NULL,0,'post',NULL,0,0,NULL),(64,1,'2017-02-08 10:03:13','22asdasdasdasdaaaaaaasdasdsssdasd','无标题文章kkk',NULL,'trash','open','open',NULL,NULL,13,NULL,'2017-02-08 11:04:49',NULL,0,NULL,0,'post',NULL,0,-1,'2017-02-09 21:16:59'),(65,1,'2017-02-08 10:31:50','33sdasdasd','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,13,NULL,'2017-02-08 10:53:47',NULL,0,NULL,0,'post',NULL,0,-2,NULL),(66,1,'2017-02-08 15:32:37','sssdaassasdasdasdasddasdwasdws','无标题文章2222',NULL,'auto-draft','open','open',NULL,NULL,12,NULL,'2017-02-09 19:54:57',NULL,0,NULL,0,'post',NULL,0,0,NULL),(67,1,'2017-02-08 15:37:27',NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,14,NULL,'2017-02-08 07:37:26',NULL,0,NULL,0,'post',NULL,0,0,NULL),(70,1,'2017-02-08 16:17:43',NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,14,NULL,'2017-02-08 08:17:43',NULL,0,NULL,0,'post',NULL,0,-1,NULL),(71,1,'2017-02-08 16:35:36','asdsad','无标题文章',NULL,'auto-draft','open','open',NULL,NULL,12,NULL,'2017-02-09 09:53:11',NULL,0,NULL,0,'post',NULL,0,-1,NULL),(72,1,'2017-02-09 09:52:56',NULL,'无标题文章',NULL,'auto-draft','open','open',NULL,NULL,16,NULL,'2017-02-09 01:52:56',NULL,0,NULL,0,'post',NULL,0,0,NULL),(73,1,'2017-02-09 21:17:04','# 3阿萨德','无标题文章3',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 13:17:04',NULL,0,NULL,0,'post',NULL,0,0,'2017-02-10 11:19:31'),(74,1,'2017-02-09 21:17:05','2','无标题文章2',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 13:17:04',NULL,0,NULL,0,'post',NULL,0,-1,'2017-02-10 11:19:31'),(75,1,'2017-02-09 21:17:05','1','无标题文章1',NULL,'trash','open','open',NULL,NULL,45,NULL,'2017-02-09 13:17:04',NULL,0,NULL,0,'post',NULL,0,-2,'2017-02-10 11:19:31');
/*!40000 ALTER TABLE `j_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_term_relationships`
--

DROP TABLE IF EXISTS `j_term_relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_term_relationships`
--

LOCK TABLES `j_term_relationships` WRITE;
/*!40000 ALTER TABLE `j_term_relationships` DISABLE KEYS */;
/*!40000 ALTER TABLE `j_term_relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_terms`
--

DROP TABLE IF EXISTS `j_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个目录、标签';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_terms`
--

LOCK TABLES `j_terms` WRITE;
/*!40000 ALTER TABLE `j_terms` DISABLE KEYS */;
INSERT INTO `j_terms` VALUES (12,'javascript',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(13,'html',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(14,'css',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(15,'asd',NULL,0,'category',NULL,0,'分类','2017-02-10 11:19:00','2017-02-09 07:00:00'),(16,'javaweb',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(17,'jquery',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(18,'git',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(19,'mac',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(20,'sql',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(21,'nodejs',NULL,0,'category',NULL,0,'分类',NULL,'2017-02-09 07:00:00'),(39,'obkdd',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:07','2017-02-09 07:00:00'),(40,'test',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:17','2017-02-09 07:00:00'),(41,'test2',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:13','2017-02-09 07:00:00'),(43,'test22',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:21','2017-02-09 07:00:00'),(44,'test222',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:26','2017-02-09 07:00:00'),(45,'testsss',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:31','2017-02-09 07:00:00'),(47,'tttttss',NULL,NULL,'category',NULL,0,'分类','2017-02-10 11:19:36','2017-02-09 07:00:00'),(59,'test11',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 07:00:00'),(60,'java',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 07:00:00'),(63,'oo',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 07:00:00'),(64,'css',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 07:00:00'),(65,'s',NULL,NULL,'tag',NULL,0,'标签',NULL,'2017-02-09 07:00:00');
/*!40000 ALTER TABLE `j_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_usermeta`
--

DROP TABLE IF EXISTS `j_usermeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `j_usermeta` (
  `umeta_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8_bin NOT NULL,
  `meta_value` longtext COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`umeta_id`),
  KEY `fk_idx` (`user_id`),
  CONSTRAINT `fk` FOREIGN KEY (`user_id`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_usermeta`
--

LOCK TABLES `j_usermeta` WRITE;
/*!40000 ALTER TABLE `j_usermeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `j_usermeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `j_users`
--

DROP TABLE IF EXISTS `j_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_users`
--

LOCK TABLES `j_users` WRITE;
/*!40000 ALTER TABLE `j_users` DISABLE KEYS */;
INSERT INTO `j_users` VALUES (1,'jyx','$2a$10$99suXIoD.koRh.BT0HE9RO/IfGCP7V3nE7A2pspY1iv5r/Ub/E66i','jjjjyx','jyx@rpgame.net','www.mbdoge.cn',NULL,NULL,1,'管理员');
/*!40000 ALTER TABLE `j_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-10 22:24:57
