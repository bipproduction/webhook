const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const cors = require('cors')
const app = express();
const port = 5008;

const webhooks = new Webhooks({
    secret: 'ghjkhgfcdtfyguhkjhgfderdtfyguhjgfcdtrfyguhjgfrtfyguhigfrftyguhbjgvftyguhjgvfcftgyhjgvfcftyguhgfcftgyuhgfctyghbgvfcgyhgfghbgvfhggfchgghvgfghvghjgfchjhbgfgcchgjhjbgvfgchgjhbfcghjhbgvfghgjhgvfchgjhgfcghjgvfhjgvfchgvfgyhgvhyhgvfhgvhyghbbvgfhfghgvfvhghyhfgchgfchggcfgyhgcfguyhfgbhghvgvgfvhh',
});

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!'
    })
})

app.post('/str', (req, res) => {
    try {
        webhooks.verifyAndReceive({
            id: req.headers['x-github-delivery'],
            name: req.headers['x-github-event'],
            payload: JSON.stringify(req.body),
            signature: req.headers['x-hub-signature'],
        });
    } catch (error) {
        console.log("error disini")
    }

    console.log("ada berita dari post")
    res.status(200).end();
});



webhooks.onAny(({ id, name, payload }) => {
    console.log(`Received event ${name} for action ${payload.action}`);
    // Tambahkan logika Anda di sini untuk menangani perubahan
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
