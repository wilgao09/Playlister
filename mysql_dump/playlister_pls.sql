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
-- Table structure for table `pls`
--

DROP TABLE IF EXISTS `pls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pls` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `indexIn` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `song_id` int DEFAULT NULL,
  `in` int DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `song_id` (`song_id`),
  KEY `in` (`in`),
  CONSTRAINT `pls_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pls_ibfk_2` FOREIGN KEY (`in`) REFERENCES `playlists` (`_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pls`
--

LOCK TABLES `pls` WRITE;
/*!40000 ALTER TABLE `pls` DISABLE KEYS */;
INSERT INTO `pls` VALUES (5,0,'2022-12-06 21:38:30','2022-12-06 21:38:36',6,NULL),(6,0,'2022-12-06 21:38:31','2022-12-06 21:50:41',4,NULL),(20,0,'2022-12-06 21:50:51','2022-12-06 21:50:56',10,2),(21,0,'2022-12-06 21:50:52','2022-12-08 00:07:27',11,2),(22,0,'2022-12-06 21:50:52','2022-12-08 00:07:27',12,2),(23,1,'2022-12-06 21:50:53','2022-12-08 00:07:27',4,2),(25,2,'2022-12-06 21:52:02','2022-12-08 00:07:27',4,2),(28,0,'2022-12-06 21:53:20','2022-12-08 00:07:27',4,NULL),(29,0,'2022-12-07 04:59:43','2022-12-07 04:59:43',4,NULL),(30,0,'2022-12-07 05:01:57','2022-12-08 00:07:27',15,NULL),(31,0,'2022-12-07 05:14:39','2022-12-07 05:14:55',16,NULL),(33,0,'2022-12-07 23:46:51','2022-12-07 23:46:51',4,NULL),(35,1,'2022-12-08 02:12:55','2022-12-08 02:12:55',4,NULL),(36,0,'2022-12-08 02:18:59','2022-12-08 02:18:59',4,NULL),(37,0,'2022-12-08 02:23:57','2022-12-08 02:23:57',4,NULL),(38,0,'2022-12-08 03:50:28','2022-12-08 03:50:28',4,33),(39,1,'2022-12-08 03:50:30','2022-12-08 03:50:44',17,33);
/*!40000 ALTER TABLE `pls` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-07 23:10:25
