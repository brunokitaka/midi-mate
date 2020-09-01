CREATE database midimate;
USE midimate

CREATE TABLE user(
     idUser INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     userName VARCHAR(100) NOT NULL,   
     userEmail VARCHAR(100) UNIQUE NOT NULL,
     userInstagram VARCHAR(100) UNIQUE,
     userPassword VARCHAR(256) NOT NULL
);

CREATE TABLE idea(
     idIdea INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     appId INT,
     ideaName VARCHAR(100) NOT NULL,   
     ideaPath VARCHAR(100) UNIQUE NOT NULL,
     idUser INT NOT NULL,
     ideaSource INT NOT NULL, -- 1-app, 2-web
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

-- INSERTS --

INSERT INTO account (email, password, idProfile)
VALUES
('admin@email.com', '$2a$10$Z6tzeJuBMTS5rvqfX3.5Nuramr7Pp0fbAnXAKiuyzgeitNADsGzNG', 1);

