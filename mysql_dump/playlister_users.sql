-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: playlister
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`username`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('aa','a.com','X','A','$2a$10$23YmvWgv4Ouckbei74v6j.zqD3lZg0FPiRhWyJXRiGE2oKm8UFo0q','2022-12-03 20:36:25','2022-12-03 20:36:25'),('AAAAAAAA','bbb','mike','Tyson','$2a$10$z8g8rhqNJBqhHiO/keWcL.vkRrunLESAX5A5L0ZLfa/biXrwUzqRq','2022-12-08 03:59:54','2022-12-08 03:59:54'),('Andy','You','111','222','$2a$10$g3x/JP58G3z0CvAtugsDje7hh9R/5yyhx.RoztOwy.34ao/tBV5jO','2022-12-07 21:13:16','2022-12-07 21:13:16'),('andyyou','andyyou115@gmail.com','Andy','You','$2a$10$Vk7GkUaGRqTyKxP5hZuLEuk8YgXxfvu7NTXfvTNMVxvTI.sAN0O.K','2022-12-05 05:08:17','2022-12-05 05:08:17'),('andyyou115@gmail.com','sadfghj','a','a','$2a$10$uKc8U7Uwzb73RwdHSiiPHuNsIS9weXV09EBr2g443o67zqkIL7rCC','2022-12-08 01:41:13','2022-12-08 01:41:13'),('xolaani','xol@ani.com','X','A','$2a$10$foaJ4f9f2aneEsV4GHBaiuSkh3qnXz7mKmG6T16/NjKW7JxKiLrzm','2022-12-03 20:35:10','2022-12-03 20:35:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-07 23:10:26
