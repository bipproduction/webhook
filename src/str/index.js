const { execSync } = require('child_process')
module.exports = async function () {
    execSync('cd ../str', { stdio: "inherit" })
}