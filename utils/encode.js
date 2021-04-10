const encodeToBase64 = (json) => {
    let buff = new Buffer.from(JSON.stringify(json), 'utf8');
    buff = buff.toString('base64');
    return buff;
}

const decodeFromBase64 = (string) => {
    let buff = new Buffer.from(string, 'base64');
    buff = JSON.parse(buff.toString('utf-8'));
    return buff;
}

module.exports = {
    encodeToBase64,
    decodeFromBase64
}
