Currently nothing is crypted, just tested how sql.db works.
Can post and request either all messages or only url. 
Delete should be easy to do. I used Postman for posting, REST can also be used.
SQL consists of one table: 
messages, with "url" as primary key and unique and string, and "crymessage" as string.


Secret message with password:
- message encrypted with hashed password as key
- password is not hashed plainly, instead hash something like hash(CONSTANT + password + salt)
- URL is random generated and the hash is used to identify a row in the database

Secret message without password:
- URL is random generated and the hash is used to identify a row in the database
- the key to the crypted message is the original random url