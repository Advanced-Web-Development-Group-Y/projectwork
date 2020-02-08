/* 
  To manually run an SQL-query: 
	1 - Highlight the query you want to run.
	2 - Press CTRL + ALT + E 

	For example, highlight the following SQL-query:
		SELECT * FROM accounts;
	And press CTRL + ALT + E
*/

/* RUN THE SQL-QUERIES INSIDE THE " - - - " MARKS TO MANUALLY CREATE THE DB  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

CREATE TABLE accounts
(
	userid INT(10)
	AUTO_INCREMENT NOT NULL UNIQUE,
	email VARCHAR
	(100) NOT NULL UNIQUE,
	username VARCHAR
	(50) NOT NULL UNIQUE,
	password VARCHAR
	(255) NOT NULL,
	firstname VARCHAR
	(50) NOT NULL,
	lastname VARCHAR
	(50) NOT NULL,
	permission_level INT
	(10) NOT NULL DEFAULT 0,
	reg_date datetime
	DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY
	(userid)
);

	CREATE TABLE posts
	(
		postid INT(10)
		AUTO_INCREMENT,
	title VARCHAR
		(50) NOT NULL,
	content VARCHAR
		(512) NOT NULL,
	posterid INT
		(10) NOT NULL,
	post_date datetime
		DEFAULT CURRENT_TIMESTAMP,
	last_update datetime
		DEFAULT NULL,
	platform VARCHAR
		(256) NOT NULL,
	PRIMARY KEY
		(postid),
	FOREIGN KEY
		(posterid) REFERENCES accounts
		(userid)
);

		/*Inserting standard admin account upon creation*/
		INSERT INTO accounts
			(
			email,
			username,
			password,
			firstname,
			lastname,
			permission_level
			)
		VALUES
			(
				"admin@admin.com",
				"admin",
				"$2b$10$U/fRD0/j/haEPEHjDMe7lu8ZxlG1d7bVl5p8af0rUcjNIxInTrBy6",
				"admin",
				"admin",
				1
);

		/*Inserting standard posts into posts upon creation for testing*/
		INSERT INTO posts
			(
			title,
			content,
			posterid,
			platform
			)
		VALUES
			(
				"Diamond account EUW lvl420",
				"Bestest account of all times, I promise!!",
				1,
				"League of Legends"
);

		INSERT INTO posts
			(
			title,
			content,
			posterid,
			platform
			)
		VALUES
			(
				"Thunderfury, Blessed Blade of the Windseeker",
				"Did someone say [ Thunderfury, Blessed Blade of the Windseeker ]?",
				1,
				"World of Warcraft"
);


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*Quick SQL query to view all accounts*/
/*
SELECT * FROM `webAppDatabase`.`accounts`;
*/

/*Quick SQL query to view all posts*/
/*
{SELECT * FROM `webAppDatabase`.`posts`;}
*/

/*DANGER, remoes tables from database!*/
/*
DROP TABLE posts;
DROP TABLE accounts;
*/

/* TEST QUERYS

SELECT * FROM `webAppDatabase`.`posts` WHERE posterid = 1 AND postid = 1

*/