

let urlGenerator = function (len) {
    url = "";
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-_'.split('');
    for (let i = 0; i < len; i++) {
        url += chars[Math.floor(Math.random() * chars.length)];
    }
    return url;
  };

module.exports = urlGenerator;