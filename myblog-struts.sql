-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2018-04-18 15:41:23
-- 服务器版本： 5.7.21-0ubuntu0.16.04.1
-- PHP Version: 7.0.28-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myblog`
--

-- --------------------------------------------------------

--
-- 表的结构 `j_commentmeta`
--

CREATE TABLE `j_commentmeta` (
  `meta_id` bigint(20) NOT NULL,
  `comment_id` bigint(20) DEFAULT '0',
  `meta_key` varchar(255) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_comments`
--

CREATE TABLE `j_comments` (
  `comment_id` bigint(20) NOT NULL,
  `comment_post_id` varchar(25) DEFAULT NULL,
  `comment_author` text,
  `comment_author_email` varchar(100) DEFAULT NULL,
  `comment_author_url` varchar(200) DEFAULT NULL,
  `comment_author_ip` varchar(100) DEFAULT NULL,
  `comment_content` text,
  `comment_karma` int(11) DEFAULT '1',
  `comment_approved` varchar(20) DEFAULT '1',
  `comment_agent` varchar(255) DEFAULT NULL,
  `comment_type` varchar(20) DEFAULT 'normal',
  `comment_parent` bigint(20) DEFAULT '0',
  `user_id` bigint(20) DEFAULT '0',
  `comment_author_avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=677 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_postmeta`
--

CREATE TABLE `j_postmeta` (
  `meta_id` bigint(20) NOT NULL,
  `post_id` bigint(20) DEFAULT NULL,
  `meta_key` varchar(255) DEFAULT NULL,
  `meta_value` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_posts`
--

CREATE TABLE `j_posts` (
  `id` bigint(20) NOT NULL,
  `post_author` bigint(20) DEFAULT '0',
  `post_date` datetime DEFAULT NULL,
  `post_content` text,
  `post_title` text,
  `post_excerpt` text,
  `post_status` varchar(20) DEFAULT 'auto-draft',
  `comment_status` varchar(20) DEFAULT 'open',
  `ping_status` varchar(20) DEFAULT 'open',
  `post_password` varchar(20) DEFAULT NULL,
  `post_name` varchar(200) DEFAULT NULL,
  `term_id` bigint(20) DEFAULT NULL,
  `pinged` text,

  `post_content_filtered` text,
  `post_parent` bigint(20) DEFAULT '0',
  `guid` varchar(25) DEFAULT NULL,
  `menu_order` int(11) DEFAULT '0',
  `post_type` varchar(20) DEFAULT 'post',
  `post_mime_type` varchar(100) DEFAULT NULL,
  `comment_count` bigint(20) DEFAULT '0',
  `seq_in_nb` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deleteAt` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_reads`
--

CREATE TABLE `j_reads` (
  `id` int(11) NOT NULL,
  `ip` varchar(15) NOT NULL,
  `guid` varchar(25) NOT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_site`
--

CREATE TABLE `j_site` (
  `key` varchar(30) NOT NULL,
  `value` text,
  `text` varchar(30) DEFAULT NULL,
  `textSmall` varchar(30) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_terms`
--

CREATE TABLE `j_terms` (
  `term_id` bigint(20) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `term_group` bigint(20) DEFAULT '0',
  `taxonomy` varchar(32) DEFAULT NULL,
  `parent` bigint(20) DEFAULT NULL,
  `count` bigint(20) DEFAULT NULL,
  `description` text,
  `icon` varchar(200) DEFAULT 'am-icon-tag',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deleteAt` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个目录、标签';

-- --------------------------------------------------------

--
-- 表的结构 `j_term_relationships`
--

CREATE TABLE `j_term_relationships` (
  `object_id` bigint(20) NOT NULL,
  `term_order` int(11) DEFAULT NULL,
  `term_id` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存储每个文章、链接和对应分类的关系';

-- --------------------------------------------------------

--
-- 表的结构 `j_usermeta`
--

CREATE TABLE `j_usermeta` (
  `umeta_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT '0',
  `meta_key` varchar(255) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `j_users`
--

CREATE TABLE `j_users` (
  `id` bigint(20) NOT NULL,
  `user_login` varchar(60) DEFAULT NULL,
  `user_pass` varchar(64) DEFAULT NULL,
  `user_nickname` varchar(50) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `user_url` varchar(100) DEFAULT NULL,
  `user_registered` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_activation_key` varchar(60) DEFAULT NULL,
  `user_status` int(11) DEFAULT '0',
  `display_name` varchar(250) DEFAULT NULL,
  `role` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='这个用户表其实用户不多，\n只有超级管理员用户，有此账号就能管理博客后台';

-- --------------------------------------------------------

--
-- 表的结构 `j_visitors`
--

CREATE TABLE `j_visitors` (
  `id` bigint(20) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `userName` varchar(60) DEFAULT 'no',
  `address` varchar(255) DEFAULT NULL,
  `isp` varchar(30) DEFAULT NULL,
  `originalUrl` varchar(300) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `j_commentmeta`
--
ALTER TABLE `j_commentmeta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Indexes for table `j_comments`
--
ALTER TABLE `j_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comment_parent` (`comment_parent`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `j_postmeta`
--
ALTER TABLE `j_postmeta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `j_posts`
--
ALTER TABLE `j_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_author` (`post_author`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `j_reads`
--
ALTER TABLE `j_reads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `j_site`
--
ALTER TABLE `j_site`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `j_terms`
--
ALTER TABLE `j_terms`
  ADD PRIMARY KEY (`term_id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `j_term_relationships`
--
ALTER TABLE `j_term_relationships`
  ADD PRIMARY KEY (`object_id`,`term_id`),
  ADD KEY `term_id` (`term_id`);

--
-- Indexes for table `j_usermeta`
--
ALTER TABLE `j_usermeta`
  ADD PRIMARY KEY (`umeta_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `j_users`
--
ALTER TABLE `j_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_login` (`user_login`);

--
-- Indexes for table `j_visitors`
--
ALTER TABLE `j_visitors`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `j_commentmeta`
--
ALTER TABLE `j_commentmeta`
  MODIFY `meta_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_comments`
--
ALTER TABLE `j_comments`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_posts`
--
ALTER TABLE `j_posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_reads`
--
ALTER TABLE `j_reads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_terms`
--
ALTER TABLE `j_terms`
  MODIFY `term_id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_users`
--
ALTER TABLE `j_users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `j_visitors`
--
ALTER TABLE `j_visitors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- 限制导出的表
--

--
-- 限制表 `j_commentmeta`
--
ALTER TABLE `j_commentmeta`
  ADD CONSTRAINT `j_commentmeta_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `j_comments` (`comment_id`);

--
-- 限制表 `j_comments`
--
ALTER TABLE `j_comments`
  ADD CONSTRAINT `j_comments_ibfk_1` FOREIGN KEY (`comment_parent`) REFERENCES `j_comments` (`comment_id`),
  ADD CONSTRAINT `j_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `j_users` (`id`);

--
-- 限制表 `j_postmeta`
--
ALTER TABLE `j_postmeta`
  ADD CONSTRAINT `j_postmeta_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `j_posts` (`id`);

--
-- 限制表 `j_posts`
--
ALTER TABLE `j_posts`
  ADD CONSTRAINT `j_posts_ibfk_1` FOREIGN KEY (`post_author`) REFERENCES `j_users` (`id`),
  ADD CONSTRAINT `j_posts_ibfk_2` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`);

--
-- 限制表 `j_term_relationships`
--
ALTER TABLE `j_term_relationships`
  ADD CONSTRAINT `j_term_relationships_ibfk_1` FOREIGN KEY (`object_id`) REFERENCES `j_posts` (`id`),
  ADD CONSTRAINT `j_term_relationships_ibfk_2` FOREIGN KEY (`term_id`) REFERENCES `j_terms` (`term_id`);

--
-- 限制表 `j_usermeta`
--
ALTER TABLE `j_usermeta`
  ADD CONSTRAINT `j_usermeta_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `j_users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
