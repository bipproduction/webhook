require('dotenv').config()
const fs = require('fs')
const CONFIG = require('./type/CONFIG');

/**
 * @type {CONFIG}
 */
const config = require('yaml').parse(fs.readFileSync('./config.yaml').toString())
const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const cors = require('cors')
const app = express();
const port = config.server.port;
const TYPE_PAYLOAD = require('./payload.json');
// const { fetch } = require('cross-fetch');
const listAction = require('./src/app_modules/list_action');
const log_wa = require('./src/app_modules/log_wa');


const webhooks = new Webhooks({
    secret: process.env.SCRT.toString()
});

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    const dataLog = fs.readFileSync('./app.log').toString()
    res.status(200).send(decodeURIComponent(dataLog))
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
        const branchName = pyl.ref.split('/').pop()
        const repositoryName = pyl.repository.full_name.split("/").pop()

        // digantikan dengan function
        // await fetch(`https:/wa.wibudev.com/code?nom=6289697338821&text=${repositoryName}, ${namaBranch}, ${id}, ${name}`)
        // await fetch(`https:/wa.wibudev.com/code?nom=628980185458&text=${repositoryName}, ${namaBranch}, ${id}, ${name}`)

        let log_data = `
        repository: ${repositoryName}
        branch: ${branchName}
        pusher: ${pyl.pusher.name}
        message: push success
        `

        await log_wa(repositoryName, encodeURIComponent(log_data))

        if (!branchName) return console.log("no branch")
        if (branchName != "build") return console.log("not build")
        const ada = listAction.find((v) => v.name === repositoryName)
        if (!ada) return console.log("no branch ref")
        await ada.action(ada)
        log_data = `
        repository: ${repositoryName}
        branch: ${branchName}
        pusher: ${pyl.pusher.name}
        message: build success
        `
        await log_wa(repositoryName, encodeURIComponent(log_data))
    }

});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
