const TYPE_CHOOSE = require('./type/CHOOSE');
const { execSync } = require('child_process')
// const listServer = require('./list_server.json')
const fs = require('fs')
const yaml = require('yaml')
const listServer = yaml.parse(fs.readFileSync('./list_server.yaml').toString())

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
    fetch(`https:/wa.wibudev.com/code?nom=6289697338821&text=${data.name} build success`)
    fetch(`https:/wa.wibudev.com/code?nom=628980185458&text=${data.name} build success`)
}

/**
 * @type {TYPE_CHOOSE}
 */
const listAction = listServer.map((v) => ({
    ...v,
    action: action
}))

module.exports = listAction