const {spawnSync, spawn} = require('child_process')
const fs = require('fs')
const nmap = require('node-nmap')

const {main} = require('../index')

const is_alive = async (ip) => {

    const scan = spawnSync('ping', ['-c', '1', ip])

    if (scan.stdout.toString().includes('1 received')) {
        return true
    } else {
        return false
    }

}


const scan_vulns = async (ip, mode) => {
    const log_time = `[${new Date().toLocaleString()}]`

    if (!fs.existsSync('./scans/' + ip + '.txt')) { fs.writeFileSync('./scans/' + ip + '.txt', '') }

    const vuln_scan = new nmap.NmapScan(ip, '-sV -Pn --script vuln')

    if (vuln_scan.scanComplete) {
        main.nmap_log.log(`${log_time} ${main.lib.chalk.greenBright(ip)} scan complete`)
    }

    main.nmap_log.log(vuln_scan.scanTime)
    vuln_scan.on('complete', (data) => {
        fs.writeFileSync(ip + '.txt', data)
        main.nmap_log.log(`${log_time} ${main.lib.chalk.greenBright(ip)} scan complete`)
    })
}
module.exports = {
    is_alive,
    scan_vulns
}