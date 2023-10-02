const configFile = require('fs').readFileSync('./../../config.yaml').toString()
const yaml = require('yaml')
const CONFIG = require('../../type/CONFIG')
const fs = require('fs')

/**
 * @type {CONFIG}
 */
const config = yaml.parse(configFile)

module.exports = async function (text) {
    for (let lw of config.list_wa) {
        await fetch(`https:/wa.wibudev.com/code?nom=${lw.number}&text=${text}`)
        console.log(`send wa to ${lw.name} , ${text}`)
        const dataLog = `
        date: ${new Date().toISOString()}
        log: ${text}
        ---------------------------------
        \n
        `
        fs.appendFileSync('../../app.log', dataLog)
    }
}