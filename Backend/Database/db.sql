CREATE database midimate;
USE midimate;

CREATE TABLE user(
     idUser INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     userName VARCHAR(100) NOT NULL,   
     userEmail VARCHAR(100) UNIQUE NOT NULL,
     userSc VARCHAR(100) UNIQUE,
     userPassword VARCHAR(256) NOT NULL,
     userCluster INT
);

CREATE TABLE idea(
     idIdea INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     appId INT,
     ideaName VARCHAR(100) NOT NULL,   
     ideaPath VARCHAR(100) UNIQUE NOT NULL,
     idUser INT NOT NULL,
     ideaSource INT NOT NULL, -- 1-app, 2-web
     ideaCluster INT,
     CONSTRAINT fk_idea_id_user
        FOREIGN KEY (idUser) 
        REFERENCES user (idUser)
);

CREATE TABLE suggestion(
     idSuggestion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     suggestionName VARCHAR(100) NOT NULL,   
     suggestionPath VARCHAR(100) UNIQUE NOT NULL,
     idIdea INT NOT NULL,
     CONSTRAINT fk_suggestion_id_idea
        FOREIGN KEY (idIdea) 
        REFERENCES idea (idIdea)
);


-- DELIMITER $$
-- DROP PROCEDURE IF EXISTS CLUSTERUSER$$

-- CREATE PROCEDURE CLUSTERUSER()
-- BEGIN
-- 	DECLARE n INT DEFAULT 0;
-- 	DECLARE i INT DEFAULT 0;
-- 	SELECT COUNT(*) FROM midimate.user INTO n;
-- 	SET i=0;
--     WHILE i<n DO
-- 		SELECT ideaCluster, COUNT(ideaCluster) as most INTO @cluster, @counter FROM idea WHERE idUser = i GROUP BY ideaCluster ORDER BY most DESC LIMIT 1;
-- 		UPDATE midimate.user SET userCluster = (SELECT @cluster) WHERE idUser = i;
-- 		SET i = i + 1;
-- 	END WHILE;
-- END $$
-- DELIMITER ;

