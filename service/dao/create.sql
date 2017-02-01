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
  `comment_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
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
  `post_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `post_content` longtext COLLATE utf8_bin COMMENT '正文',
  `post_title` text COLLATE utf8_bin COMMENT '标题',
  `post_excerpt` text COLLATE utf8_bin COMMENT '摘录',
  `post_status` varchar(20) CHARACTER SET utf8 DEFAULT 'publish' COMMENT '文章状态（publish/auto-draft/inherit/trash/delete等）',
  `comment_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT '评论状态（open/closed）',
  `ping_status` varchar(20) COLLATE utf8_bin DEFAULT 'open' COMMENT 'PING状态（open/closed）',
  `post_password` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '文章密码',
  `post_name` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '文章缩略名',
  `to_ping` text COLLATE utf8_bin COMMENT '未知',
  `pinged` text COLLATE utf8_bin COMMENT '已经PING过的链接',
  `post_modified` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `post_content_filtered` text COLLATE utf8_bin COMMENT '未知\n内容 过滤',
  `post_parent` bigint(20) unsigned DEFAULT '0' COMMENT '父文章，主要用于PAGE',
  `guid` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '未知',
  `menu_order` int(11) DEFAULT '0' COMMENT '排序ID',
  `post_type` varchar(20) COLLATE utf8_bin DEFAULT 'post' COMMENT '文章类型（post/page等）',
  `post_mime_type` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'MIME类型',
  `comment_count` bigint(20) DEFAULT '0' COMMENT '评论总数',
  PRIMARY KEY (`id`),
  KEY `post_name` (`post_name`),
  KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`id`),
  KEY `post_parent` (`post_parent`),
  KEY `post_author` (`post_author`),
  CONSTRAINT `fk_ j_posts` FOREIGN KEY (`post_parent`) REFERENCES `j_posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_j_users` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_posts`
--

LOCK TABLES `j_posts` WRITE;
/*!40000 ALTER TABLE `j_posts` DISABLE KEYS */;
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
  `term_taxonomy_id` bigint(20) unsigned NOT NULL COMMENT '对应分类方法ID',
  PRIMARY KEY (`object_id`,`term_taxonomy_id`),
  KEY `fk_ j_term_relationships_idx` (`term_taxonomy_id`),
  CONSTRAINT `fk_ j_term_relationships` FOREIGN KEY (`term_taxonomy_id`) REFERENCES `j_term_taxonomy` (`term_taxonomy_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
-- Table structure for table `j_term_taxonomy`
--

DROP TABLE IF EXISTS `j_term_taxonomy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `j_term_taxonomy` (
  `term_taxonomy_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `term_id` bigint(20) unsigned DEFAULT NULL,
  `taxonomy` varchar(32) CHARACTER SET utf8 DEFAULT NULL COMMENT '分类方法(category/post_tag)',
  `description` longtext CHARACTER SET utf8 COMMENT '说明',
  `parent` bigint(20) unsigned DEFAULT NULL COMMENT '所属父分类方法ID',
  `count` bigint(20) DEFAULT '0' COMMENT '文章数统计',
  PRIMARY KEY (`term_taxonomy_id`),
  UNIQUE KEY `term_id_taxonomy` (`term_id`,`taxonomy`),
  KEY `taxonomy` (`taxonomy`),
  CONSTRAINT `fk_j_term_taxonomy` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个目录、标签所对应的分类';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_term_taxonomy`
--

LOCK TABLES `j_term_taxonomy` WRITE;
/*!40000 ALTER TABLE `j_term_taxonomy` DISABLE KEYS */;
INSERT INTO `j_term_taxonomy` VALUES (19,11,'category','分类',NULL,0),(20,12,'category','分类',NULL,0),(21,13,'category','分类',NULL,0),(22,14,'category','分类',NULL,0),(23,15,'category','分类',NULL,0),(24,16,'category','分类',NULL,0),(25,17,'category','分类',NULL,0),(26,18,'category','分类',NULL,0),(27,19,'category','分类',NULL,0),(28,20,'category','分类',NULL,0),(29,21,'category','分类',NULL,0);
/*!40000 ALTER TABLE `j_term_taxonomy` ENABLE KEYS */;
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
  PRIMARY KEY (`term_id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个目录、标签';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `j_terms`
--

LOCK TABLES `j_terms` WRITE;
/*!40000 ALTER TABLE `j_terms` DISABLE KEYS */;
INSERT INTO `j_terms` VALUES (11,'java',NULL,0),(12,'javascript',NULL,0),(13,'html',NULL,0),(14,'css',NULL,0),(15,'vue',NULL,0),(16,'javaweb',NULL,0),(17,'jquery',NULL,0),(18,'git',NULL,0),(19,'mac',NULL,0),(20,'sql',NULL,0),(21,'nodejs',NULL,0);
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
  `user_registered` datetime DEFAULT NULL COMMENT '注册时间',
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

-- Dump completed on 2017-02-01 18:44:26
