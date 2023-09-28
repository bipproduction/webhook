require('dotenv').config()
const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const cors = require('cors')
const app = express();
const port = process.env.MY_PORT | 5008;
const TYPE_PAYLOAD = require('./payload.json');
const { fetch } = require('cross-fetch');
const listAction = require('./list_action');

const webhooks = new Webhooks({
    secret: process.env.SCRT.toString()
});

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!'
    })
})

app.post('/', (req, res) => {
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

    console.log("update data")
    res.status(200).end();
})

webhooks.onAny(async ({ id, name, payload }) => {
    if (name === "push") {
        /**
         * @type {TYPE_PAYLOAD}
         */
        const pyl = payload
        if (!pyl) return console.log("no repository")
        const namaBranch = pyl.ref.split('/').pop()
        const repositoryName = pyl.repository.full_name.split("/").pop()
        await fetch(`https:/wa.wibudev.com/code?nom=6289697338821&text=${repositoryName}, ${namaBranch}, ${id}, ${name}`)
        await fetch(`https:/wa.wibudev.com/code?nom=628980185458&text=${repositoryName}, ${namaBranch}, ${id}, ${name}`)
        if (!namaBranch) return console.log("no branch")
        if (namaBranch != "build") return console.log("not build")
        const ada = listAction.find((v) => v.name === repositoryName)
        if (!ada) return console.log("no branch ref")
        ada.action(ada)
    }

});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
