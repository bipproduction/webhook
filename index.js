require('dotenv').config()
const express = require('express');
const { Webhooks } = require('@octokit/webhooks');
const cors = require('cors')
const app = express();
const port = 5008;
const TYPE_PAYLOAD = require('./payload.json');
const str = require('./src/str');
const TYPE_CHOOSE = require('./type/CHOOSE');
const { execSync } = require('child_process')

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

// app.post('/:name', (req, res) => {
//     try {
//         webhooks.verifyAndReceive({
//             id: req.headers['x-github-delivery'],
//             name: req.headers['x-github-event'],
//             payload: JSON.stringify(req.body),
//             signature: req.headers['x-hub-signature'],
//         });
//     } catch (error) {
//         console.log("error disini")
//     }

//     console.log("update data")
//     res.status(200).end();
// });

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


/**
 * 
 * @param {TYPE_CHOOSE} data 
 */
async function action(data) {
    const cmd = `
    cd ../${data.name}
    git pull origin build
    yarn install
    npx prisma db push
    npx prisma generate
    yarn build
    pm2 restart ${data.id}
    `
    execSync(cmd, { stdio: "inherit" })
}

const listAction = [
    {
        id: "str_5001",
        name: "str",
        branch: "build",
        port: "5001",
        action: action
    },
    {
        id: "arm_5004",
        name: "arm",
        branch: "build",
        port: "5004",
        action: action
    }
]

webhooks.onAny(({ id, name, payload }) => {
    if (name === "push") {
        /**
         * @type {TYPE_PAYLOAD}
         */
        const pyl = payload
        if (!pyl) return console.log("no repository")
        const namaBranch = pyl.ref.split('/').pop()
        const repositoryName = pyl.repository.full_name.split("/").pop()
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
