const { execSync } = require('child_process')
const TYPE_CHOOSE = require('../../type/CHOOSE')

/**
 * 
 * @param {TYPE_CHOOSE} data 
 */
module.exports = async function (data) {
    const cmd = `
    cd ../${data.name}
    git pull origin build
    yarn install
    npx prisma db push
    pm2 restart ${data.id}

    `
    execSync(cmd, { stdio: "inherit" })
}