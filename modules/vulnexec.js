
const {exec, execSync} = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

const check_vulners = async () => {
    let isInstalled = await execAsync('cd /usr/share/nmap/scripts && ls')

    if (isInstalled.stdout.includes('vulners.nse')) {
        return 'installed'

    } else {
        exec('cd /usr/share/nmap/scripts && sudo wget https://raw.githubusercontent.com/vulnersCom/nmap-vulners/master/vulners.nse')
        return 'installing'
        
    }
}

module.exports = {
    check_vulners
}