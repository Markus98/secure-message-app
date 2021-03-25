
const crypto = require('crypto');

const algorithm = 'AES-256-CBC-HMAC-SHA256'//'aes-256-ecb';
const pepper = 'pepperforpassword'; // long random constant stored in the code

const encryptMsg = (password, msg) => {
    // defining iv == initialization vector, basically a salt for the cypted message
    const iv = crypto.randomBytes(16);
    // create salt
    const salt = crypto.randomBytes(32).toString('hex');
    // create key TODO might be better to use our own implementation
    const key = crypto.scryptSync(password + pepper, salt, 32); // key length of 256-bits
    // create cipher
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    // encrypt the msg
    const encryptedMsg = Buffer.concat([cipher.update(msg), cipher.final()]);
    // Returning iv and encrypted msg
    return {salt: salt, hash:{iv: iv.toString('hex'), content: encryptedMsg.toString('hex')}};
}

const decryptMsg = (password, salt, hash) => {
    // create key
    const key = crypto.scryptSync(password + pepper, salt, 32); // key lenght of 256-bits
    // create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
    // decrypt
    const deryptedMsg = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    // return the plaint text msg
    return deryptedMsg.toString()
}

/*
const msg = 'Hello there';
const {salt, hash} = encryptMsg('password', msg);
console.log(decryptMsg('password', salt, hash));
*/