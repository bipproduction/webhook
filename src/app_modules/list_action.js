const path = require('path')
const TYPE_CHOOSE = require(path.join(__dirname, '../../type/CHOOSE'));
const { execSync } = require('child_process')
// const listServer = require('./list_server.json')
const fs = require('fs')
const yaml = require('yaml');
// const log_wa = require('./log_wa');
const CONFIG = require(path.join(__dirname, '../../type/CONFIG'));

/**
 * @type {CONFIG}
 */
const config = yaml.parse(fs.readFileSync(path.join(__dirname, './../../config.yaml')).toString())
const listServer = config.list_server

/**
 * 
 * @param {TYPE_CHOOSE} data 
 */
async function action(data) {
    const cmd = `
    cd ../${data.name}
    git stash
    git pull origin build
    yarn install
    npx prisma db push
    npx prisma generate
    yarn build
    pm2 restart ${data.id}
    `
    execSync(cmd, { stdio: "inherit" })

    // digantikan dengan function
    // fetch(`https:/wa.wibudev.com/code?nom=6289697338821&text=${data.name} build success`)
    // fetch(`https:/wa.wibudev.com/code?nom=628980185458&text=${data.name} build success`)

    // await log_wa(`${data.name} build success`)
}

/**
 * @type {TYPE_CHOOSE}
 */
const listAction = listServer.map((v) => ({
    ...v,
    action: action
}))

module.exports = listAction