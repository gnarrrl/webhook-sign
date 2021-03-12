# Webhook Signature

### Sign payload of HTTP post with shared secret
```
const whsign = require('webhook-sign');
const axios = require('axios').default;

const payload = { my: 'data' };
const secret = 'my shared secret key string';
const path = 'your target url';

axios.post(path, payload, {
    headers: {
        signature: whsign.sign(payload, secret)
    }
});
```

### Verify payload of HTTP post with shared secret
```
const whsign = require('webhook-sign');

async function main(event) {
    const signature = event.headers.signature;
    const secret = 'my shared secret key string';

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch (err) {
        // handle error
    }

    // authorize the request
    if (!whsign.verify(signature, secret, payload)) {
        console.log('Signature mismatch or timeout', signature, payload);
        return {
            statusCode: 401
        };
    }
}
```

### Other properties
```
// Change max deviation in seconds between sign and verify (default = 5 seconds)
whsign.setMaxDeviation(2);
```