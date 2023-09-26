const { execSync } = require('child_process')
module.exports = async function () {
    execSync('ls ../str', { stdio: "inherit" })
}