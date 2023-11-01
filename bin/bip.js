const arg = process.argv.splice(2)
const _ = require('lodash')
require('colors')
const { execSync } = require('child_process')
const host = execSync('hostname').toString()
const branch = execSync('git branch --show-current').toString()

const project_config = {
    id: "webhook_5008",
    path: "webhook",
    branch: "build"
}

let list_menu = [
    {
        id: "push",
        name: "push",
        arg: "--push",
        des: "auto push",
        is_server: false,
        act: () => {

            execSync(`
            git add -A 
            git commit -m "auto push" 
            git push origin ${branch}
            ssh makuro@wibudev.com "cd projects/${project_config.path} && yarn bip --pull"
            `, { stdio: "inherit" })
            console.log("SUCCESS".green)
        }
    },
    {
        id: "pull",
        name: "pull",
        arg: "--pull",
        des: "pull dari server",
        is_server: true,
        act: () => {
            execSync(`
            source ~/.nvm/nvm.sh
            git pull origin ${project_config.branch}
            yarn install
            pm2 restart ${project_config.id}
            `, { stdio: "inherit" })
        }
    }
]

if (host === "bip") {
    list_menu = list_menu.filter((v) => v.is_server)
} else {
    list_menu = list_menu.filter((v) => !v.is_server)
}

function info() {
    console.log(`
    MENU
    -----------------
    \t${list_menu.map((v) => v.arg + "\t\t" + v.des).join('\t\n\t')}

    EXAMPLE
    \tyarn server ${list_menu[0].arg}
    
    `.yellow)
}

async function main() {
    if (_.isEmpty(arg)) return info()
    const cmd = list_menu.find((v) => v.arg === arg[0])
    if (!cmd) return info()
    cmd.act()
}

main()