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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `playlist_id` int DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'best playlist','2022-12-07 01:03:28','2022-12-07 01:03:28',NULL,'xolaani'),(2,'best playl11323123ist','2022-12-07 01:12:25','2022-12-07 01:12:25',NULL,'xolaani'),(3,'qwertyu','2022-12-07 01:48:09','2022-12-07 01:48:09',NULL,'xolaani'),(4,'werty','2022-12-07 01:48:30','2022-12-07 01:48:30',NULL,'xolaani'),(5,'sdsdsds','2022-12-07 01:48:59','2022-12-07 01:48:59',NULL,'xolaani'),(6,'cdsvfdvfdvdfvdfbvfd','2022-12-07 05:37:28','2022-12-07 05:37:28',NULL,'xolaani'),(7,'x x xvfb','2022-12-07 05:37:34','2022-12-07 05:37:34',NULL,'xolaani'),(8,'cccc','2022-12-07 05:58:09','2022-12-07 05:58:09',NULL,'xolaani'),(9,'asdefgthy','2022-12-07 06:18:13','2022-12-07 06:18:13',NULL,'xolaani'),(10,'vSDAer679otyiluyityfdkiufy\\','2022-12-07 23:22:41','2022-12-07 23:22:41',NULL,'xolaani'),(11,'dsfghjm','2022-12-08 03:33:51','2022-12-08 03:33:51',2,'xolaani'),(12,'help me, for i am trapped in the walls','2022-12-08 03:33:58','2022-12-08 03:33:58',2,'xolaani'),(13,'trust nobody','2022-12-08 03:34:13','2022-12-08 03:34:13',2,'xolaani'),(14,'Not even yourself','2022-12-08 03:41:44','2022-12-08 03:41:44',2,'xolaani'),(15,'sadvvvvvvfbbbbbbsadvvvvvvfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbsadvvvvvvfbbbbbbbbbbbbbbbbbbbbbbbbbbbbb','2022-12-08 03:43:35','2022-12-08 03:43:35',2,'xolaani'),(16,'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a','2022-12-08 03:45:30','2022-12-08 03:45:30',2,'xolaani');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
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
