const yaml = require('yaml')
const fs = require('fs')

const data  = fs.readFileSync('./list_server.yaml').toString()
console.log(yaml.parse(data))