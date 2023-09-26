const express = require('express');
const { Webhooks } = require('@octokit/webhooks');

const app = express();
const port = 5008;

const webhooks = new Webhooks({
    secret: 'YOUR_WEBHOOK_SECRET',
});

app.use(express.json());

app.post('/webhook', (req, res) => {
    webhooks.verifyAndReceive({
        id: req.headers['x-github-delivery'],
        name: req.headers['x-github-event'],
        payload: req.body,
        signature: req.headers['x-hub-signature'],
    });
    res.status(200).end();
});

webhooks.onAny(({ id, name, payload }) => {
    console.log(`Received event ${name} for action ${payload.action}`);
    // Tambahkan logika Anda di sini untuk menangani perubahan
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
