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

CREATE TABLE accounts (
	userid INT(10) AUTO_INCREMENT NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	reg_date VARCHAR(50) DEFAULT '2020-01-01',
	PRIMARY KEY (userid)
);

CREATE TABLE posts (
	postid INT(10) AUTO_INCREMENT,
	title VARCHAR(50) NOT NULL,
	content VARCHAR(512) NOT NULL,
	posterid INT(10) NOT NULL,
	post_date VARCHAR(50) DEFAULT '2020-01-01',
	last_update VARCHAR(50),
	PRIMARY KEY (postid),
	FOREIGN KEY (posterid) REFERENCES accounts(userid)
);

/*Inserting standard admin account upon creation*/
INSERT INTO accounts (
	email, 
	username, 
	password,
	firstname, 
	lastname
	)
	VALUES (
		"admin@admin.com", 
		"admin", 
		"admin",
		"admin", 
		"admin"
);

/*Inserting standard post into posts upon creation for testing*/
INSERT INTO posts (
	title, 
	content, 
	posterid
	)
	VALUES (
		"First test post", 
		"Ye but I mean, this was a nice test, right??", 
		1
);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*Quick SQL query to view all accounts*/
/*
SELECT * FROM accounts;
*/

/*Quick SQL query to view all posts*/
/*
SELECT * FROM posts;
*/

/*DANGER, remoes tables from database!*/
/*
DROP TABLE posts;
DROP TABLE accounts;
*/