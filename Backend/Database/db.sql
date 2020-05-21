CREATE database midimate;
USE midimate

CREATE TABLE profile(
     idProfile INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     nameProfile VARCHAR (64) UNIQUE NOT NULL
);

CREATE TABLE permission(
     idPermission INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     route VARCHAR (64) UNIQUE NOT NULL,
     namePermission VARCHAR (64) UNIQUE NOT NULL,
     icon VARCHAR (64)
);

CREATE TABLE user(
     idUser INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     userName VARCHAR(100) NOT NULL,   
     userEmail VARCHAR (64) UNIQUE NOT NULL,
     userPassword VARCHAR (256) NOT NULL,
     idProfile INT NOT NULL,
     CONSTRAINT fk_id_profile FOREIGN KEY (idProfile)
          REFERENCES profile (idProfile) MATCH SIMPLE
          ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE profilePermission(
     idProfile INT NOT NULL,
     idPermission INT NOT NULL,
     PRIMARY KEY (idProfile, idPermission)
);

--===================================INSERTS======================================--

--PERMISSION--
INSERT INTO permission (route, namePermission, icon)
VALUES
('/insertUser', 'Insert new user', ''),                 -- 1
('/listUsers', 'All Users', 'fas fa-users'),            -- 2
('/listAllIdeas', 'List all ideas', 'fas fa-music'),    -- 3
('/listIdeas', 'List my ideas', 'fas fa-music'),        -- 4

--PROFILE--
INSERT INTO tprofile (nameProfile)
VALUES
('Admin'),  -- 1
('User'),   -- 2

INSERT INTO profilePermission (idProfile, idPermission)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),

(2, 4),
;

--ACCOUNT--
INSERT INTO account (email, password, idProfile)
VALUES
('admin@email.com', '$2a$10$Z6tzeJuBMTS5rvqfX3.5Nuramr7Pp0fbAnXAKiuyzgeitNADsGzNG', 1);

