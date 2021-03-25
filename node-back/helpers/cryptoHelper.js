const crypto = require('crypto');

const decipherAlgorithm = process.env.DECIPHER_ALGORITHM;
const hashAlgorithm = process.env.HASH_ALGORITHM;
const pepper = process.env.PEPPER_STRING; // long random constant stored in secure place

// hash the password with the provided salt
const hashPassword = (password, salt) => {
    // generate password hash
    let key = pepper + password + salt;
    for(i = 0; i < process.env.HASH_NUMBER; i++) {
        key = crypto.createHash(hashAlgorithm).update(key).digest();
    }
    return key;
}

// encrypt message with the password
// returns generated salt, initialization vector and encrypted content
const encryptMsg = (password, msg) => {
    // defining iv == initialization vector, basically a salt for the cypted message
    const iv = crypto.randomBytes(16);
    // create salt
    const salt = crypto.randomBytes(32).toString('hex');
    // create key
    const key = hashPassword(password, salt);
    // create cipher
    const cipher = crypto.createCipheriv(decipherAlgorithm, Buffer.from(key), iv);
    // encrypt the msg
    const encryptedMsg = Buffer.concat([cipher.update(msg), cipher.final()]);
    // Returning iv and encrypted msg
    return {salt: salt, hash:{iv: iv.toString('hex'), content: encryptedMsg.toString('hex')}};
}

// decrypt message using password, salt, inialization vector and content
const decryptMsg = (password, salt, hash) => {
    // create key
    const key = hashPassword(password, salt);
    // create decipher
    const decipher = crypto.createDecipheriv(decipherAlgorithm, key, Buffer.from(hash.iv, 'hex'));
    // decrypt
    const deryptedMsg = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    // return the plaint text msg
    return deryptedMsg.toString()
}

// simple sha256 hash
const hashSHA256 = (msg) => {
    return crypto.createHash('SHA256').update(msg).digest();
}

/*
const msg = 'Hello there';
const {salt, hash} = encryptMsg('password', msg);
console.log(decryptMsg('password', salt, hash));
*/

module.exports = {encryptMsg, decryptMsg, hashSHA256};
