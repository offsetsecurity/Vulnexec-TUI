const {spawnSync, spawn} = require('child_process')
const fs = require('fs')


const { mod } = require('./dependencies')
const { nmap_log } = require('..')

const is_alive = async (ip) => {

    const scan = await spawnSync('nmap', ['-Pn','-T','insane', ip])
    fs.writeFileSync('./scans/' + ip + '-alive.txt', '')
    fs.appendFileSync('./scans/' + ip + '-alive.txt', scan.stdout.toString())

    if (scan.stdout.toString().includes('1 host up')) {
        return true
    } else {
        return false
    }

}


const scan_vulns = async (ip, mode) => {
    const log_time = `[${new Date().toLocaleString()}]`

    if (!fs.existsSync('./scans/' + ip + '-vuln.txt')) { fs.writeFileSync('./scans/' + ip + '-vuln.txt', '') } else { fs.writeFileSync('./scans/' + ip + '-vuln.txt', '')}

    nmap = spawn('nmap', ['-Pn', '-sV','--script vuln', ip])

    nmap.stdout.on('data', (data) => {
        fs.appendFileSync('./scans/' + ip + '-vuln.txt', data.toString() + '\n')

        return data.toString()
    })

    nmap.on('exit', (code) => {
        return true
    })


}
module.exports = {
    is_alive,
    scan_vulns
}