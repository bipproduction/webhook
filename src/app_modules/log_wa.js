const path = require('path')
const configFile = require('fs').readFileSync(path.join(__dirname, './../../config.yaml')).toString()
const yaml = require('yaml')
const CONFIG = require('../../type/CONFIG')
const fs = require('fs')
const _ = require('lodash')

/**
 * @type {CONFIG}
 */
const config = yaml.parse(configFile)

module.exports = async function (repositoryName, text) {
    for (let lw of config.list_wa) {
        if (lw.list_server.includes(repositoryName) || lw.list_server[0] === 'all') {
            await fetch(`https:/wa.wibudev.com/code?nom=${lw.number}&text=${text}`)
            console.log(`send wa to ${lw.name} , ${text}`)
        }

        const dataLog = `
        date: ${new Date().toISOString()}
        log: ${text}
        ---------------------------------
        \n
        `
        if (!fs.existsSync(path.join(__dirname, '../../app.log'))) {
            fs.writeFileSync(path.join(__dirname, '../../app.log'), "", 'utf-8')
        }

        fs.appendFileSync(path.join(__dirname, '../../app.log'), dataLog)
        console.log(`note log ${dataLog}`)
    }
}