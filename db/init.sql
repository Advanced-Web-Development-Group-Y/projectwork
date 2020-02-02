/* 
  To manually run an SQL-query: 
	1 - Highlight the query you want to run.
	2 - Press CTRL + ALT + E 

	For example, highlight the following SQL-query:
		SELECT * FROM accounts;
	And press CTRL + ALT + E
*/

/* RUN THE SQL-QUERIES INSIDE THE " - - - " MARKS WHEN CREATING THE DATABASE */
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

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*Quick SQL query to view all accounts*/
/*
SELECT * FROM accounts;
*/

/*DANGER, remoes tables from database!*/
/*
DROP TABLE posts;
DROP TABLE accounts;
*/