const crypto = require('crypto');

const decipherAlgorithm = process.env.DECIPHER_ALGORITHM || 'AES-256-CTR';
const hashAlgorithm = process.env.HASH_ALGORITHM || 'SHA256';
const pepper = process.env.PEPPER_STRING || 'pepperforpassword'; // long random constant stored in secure place
const hashNumber = process.env.HASH_NUMBER || 1;

// hash the password with the provided salt
const hashPassword = (password, salt) => {
    // generate password hash
    let k = pepper + password + salt;
    for(i = 0; i < hashNumber; i++) {
        k = crypto.createHash(hashAlgorithm).update(k).digest();
    }
    const len = k.length;
    const key = sha256(k.slice(0, len / 2));
    const hmac = k.slice(len / 2, len).toString('hex');
    return {key, hmac};
}

// encrypt message with the password
// returns generated salt, initialization vector and encrypted content
const encryptMsg = (password, msg) => {
    // defining iv == initialization vector, basically a salt for the cypted message
    const iv = crypto.randomBytes(16);
    // create salt
    const salt = crypto.randomBytes(32).toString('hex');
    // create key and hmac
    const {key, hmac} = hashPassword(password, salt);
    // create cipher
    const cipher = crypto.createCipheriv(decipherAlgorithm, key, iv);
    // encrypt the msg
    const encryptedMsg = Buffer.concat([cipher.update(msg), cipher.final()]);
    // Returning iv and encrypted msg
    return {
        salt, 
        hash:{
            iv: iv.toString('hex'), 
            content: encryptedMsg.toString('hex')
        },
        hmac
    };
}

// decrypt message using password, salt, inialization vector and content
const decryptMsg = (password, salt, hash, hmac_v) => {
    // create key and hmac
    const {key, hmac} = hashPassword(password, salt);
    // check the hmac
    if(hmac !== hmac_v) {
        throw "Incorrect hmac";
    }
    // create decipher
    const decipher = crypto.createDecipheriv(decipherAlgorithm, key, Buffer.from(hash.iv, 'hex'));
    // decrypt
    const deryptedMsg = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    // return the plaint text msg
    return deryptedMsg.toString()
}

// secure hash
const hashSecure = (password) => {
    return hashPassword(password, "");
}

// sha256
const sha256 = (a) => {
    return crypto.createHash('SHA256').update(a).digest();
}

/*
const msg = 'Hello there';
const {salt, hash} = encryptMsg('password', msg);
console.log(decryptMsg('password', salt, hash));
*/

module.exports = {encryptMsg, decryptMsg, hashSHA256: sha256, hashSecure};
