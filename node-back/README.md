# Secure Messaging App Back End

## Encryption Idea
Secret message with password:
- message encrypted with hashed password as key
- password is not hashed plainly, instead hash something like hash(pepper + password + salt)
- URL is random generated and the hash of it is used to identify a row in the database

Secret message without password:
- URL is random generated and the hash is used to identify a row in the database
- the key to the crypted message is the original random url

## API paths
### **POST** `/api`
Create a new secret message.

Request body JSON:

```js
{
  "message": "The secret message",
  "password" = "the_password", // OPTIONAL
  "lifetime" = 1000, // (milliseconds) OPTIONAL
  "readLimit" = 10 // (how many times) OPTIONAL
}
```

**Responds:**
- **400 Bad request:** If no message provided in request body
- **200 OK:** Message successfully created
  Response body JSON:
  ```js
  {
    "generatedUrl": "<MESSAGE_URL>"
  }
  ```
### **GET** `/api/<MESSAGE_URL>`
Get a secret message.

Request body JSON (OPTIONAL):

```js
{
  "password": "the_password"
}
```
Required if message requires a password.

**Responds:**
- **404 Not found:** If no message exists with specified URL
- **401 Unauthorized:** If attempting to read a message with a password without providing it
- **403 Forbidden:** If provided password is wrong
- **200 OK:** Message found and deciphered successfully
  Response body JSON:
  ```js
  {
    "timestamp": 1616761338528, // created on (unix time ms)
    "lifetime": 1000000, // set lifetime (ms)
    "aliveTimeLeft": 38032, // lifetime remaining (ms)
    "timesRead": 0,
    "readLimit": 10,
    "message": "This is a test secret message"
  }
  ```
### **DELETE** `/api/<MESSAGE_URL>`
Delete a secret message.

**Not yet implemented.**

