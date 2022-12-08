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
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `listens` int DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `owner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` VALUES (2,'BestList (DUPLICATE)',12,1,'2022-12-03 03:15:44','2022-12-06 21:53:13','xolaani'),(29,'Untitled',0,0,'2022-12-08 03:25:13','2022-12-08 03:25:13','xolaani'),(30,'Untitled (1)',0,0,'2022-12-08 03:25:16','2022-12-08 03:25:16','xolaani'),(31,'X (5)',0,0,'2022-12-08 03:25:17','2022-12-08 03:25:53','xolaani'),(32,'BestList (DUPLICATE) (1)',1,1,'2022-12-08 03:25:25','2022-12-08 03:34:08','xolaani'),(33,'BestList (DUPLICATE) (1) (1)',1,0,'2022-12-08 03:25:30','2022-12-08 03:25:30','xolaani'),(34,'X (5) (1)',0,0,'2022-12-08 03:25:57','2022-12-08 03:25:57','xolaani'),(35,'X (5) (1) (1)',0,0,'2022-12-08 03:26:00','2022-12-08 03:26:41','xolaani'),(36,'Untitled (2)',0,0,'2022-12-08 03:26:22','2022-12-08 03:26:22','xolaani'),(37,'X (5) (1) (1) (1)',0,0,'2022-12-08 03:27:15','2022-12-08 03:27:15','xolaani'),(38,'X (5) (1) (1) (1) (1)',0,0,'2022-12-08 03:29:09','2022-12-08 03:29:09','xolaani'),(39,'X (5) (1) (1) (1) (1) (1)',0,0,'2022-12-08 03:30:06','2022-12-08 03:30:06','xolaani'),(40,'X (5) (1) (1) (1) (1) (1) (1)',0,0,'2022-12-08 03:31:23','2022-12-08 03:31:23','xolaani'),(41,'Untitled (3)',0,0,'2022-12-08 03:31:51','2022-12-08 03:31:51','xolaani'),(42,'Untitled (4)',0,0,'2022-12-08 03:32:14','2022-12-08 03:32:14','xolaani'),(43,'Untitled (5)',0,0,'2022-12-08 03:32:18','2022-12-08 03:32:18','xolaani'),(44,'Untitled (6)',0,0,'2022-12-08 03:32:19','2022-12-08 03:32:19','xolaani'),(45,'Untitled',0,0,'2022-12-08 04:07:06','2022-12-08 04:07:06','AAAAAAAA');
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
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
