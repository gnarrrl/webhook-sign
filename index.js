const crypto = require('crypto');

const sign = (payload, secret) => {
    const t = Math.floor(Date.now() / 1000);
    const payload_string = JSON.stringify(payload);
    const signed_payload = t.toString() + '.' + payload_string;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signed_payload);
    const digest = hmac.digest('hex');
    return `t=${t},v0=${digest}`;
};

const verify = (signature, secret, payload) => {
    const src_elements = signature.split(',');
    const src_t = src_elements[0].split('=')[1];

    // validate timestamp
    const now = Math.floor(Date.now() / 1000);
    const deviation = (now - src_t);
    if (deviation < 0 || deviation > 2) {
        return false;
    }

    // request was received within time window -> validate signature
    const src_content = JSON.stringify(payload);
    const signed_payload = src_t + '.' + src_content;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(signed_payload);

    const src_hash = src_elements[1].split('=')[1];
    const cmp_hash = hmac.digest('hex');

    return crypto.timingSafeEqual(Buffer.from(src_hash), Buffer.from(cmp_hash));
};

exports.sign = sign;
exports.verify = verify;