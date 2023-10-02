require('dotenv').config()
const configFile = require('fs').readFileSync('./config.yaml').toString()
const yaml = require('yaml')
const config = yaml.parse(configFile)
const fs = require('fs')
const configVal = yaml.parse(fs.readFileSync('./config.yaml').toString())
const { list_server: listServer } = yaml.parse(fs.readFileSync('./config.yaml').toString())
// console.log(JSON.stringify(configVal, null, 2))

const d = `
halo
apa ka
bar
%0Ahalo%0Aapa%20ka%0Abar%0A
`
console.log(decodeURIComponent(d))
// fs.appendFileSync('./app.log', "halo apa kabarnya \n")