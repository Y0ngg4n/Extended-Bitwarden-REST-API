function encodeToBase64(data){
    let buff = new Buffer(data, 'utf8');
    return buff.toString('base64');
}

function decodeFromBase64(data){
    let buff = new Buffer(data, 'base64');
    return buff.toString('utf-8');
}
