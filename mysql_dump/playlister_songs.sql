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
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `songs` (
  `_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `youTubeId` varchar(255) DEFAULT NULL,
  `refs` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (4,'Untitled','Unknown','dQw4w9WgXcQ',10,'2022-12-06 21:27:38','2022-12-08 04:20:27'),(6,'Uwe','qwe','dQw4w9WgXcQ',1,'2022-12-06 21:38:36','2022-12-06 21:38:36'),(10,'Untitdwdled','Unknown','dQw4w9WgXcQ',1,'2022-12-06 21:50:56','2022-12-06 21:50:56'),(11,'b','Unknown','dQw4w9WgXcQ',1,'2022-12-06 21:50:59','2022-12-06 21:50:59'),(12,'c','Unknown','dQw4w9WgXcQ',1,'2022-12-06 21:51:02','2022-12-06 21:51:02'),(15,'forgot','xomu','FwWUqQz6Llk',1,'2022-12-07 05:03:16','2022-12-07 05:03:16'),(16,'inori','kirara magic','Lu7pFZWR0zk',2,'2022-12-07 05:14:55','2022-12-08 04:18:54'),(17,'Untitled','Unknown','nUzjJ1mNRRQ',1,'2022-12-08 03:50:44','2022-12-08 03:50:44'),(18,'Angriefer','Unlucky Morpheus','hz6nMsQPSJk',1,'2022-12-08 04:19:19','2022-12-08 04:19:19'),(19,'Night of Bloom','Xomu','FwWUqQz6Llk',1,'2022-12-08 04:20:05','2022-12-08 04:20:05'),(20,'Motherland','Ado','_wZfYtYwxro',1,'2022-12-08 04:20:27','2022-12-08 04:20:27');
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-07 23:29:35
