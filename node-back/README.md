# Secure Messaging App Back End

To install node modules before first run:
```
npm install
```

Back end can then be started with:
```
npm start
```

The back end will start with the port `3001` by default.

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
### **POST** `/api/<MESSAGE_URL>`
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

