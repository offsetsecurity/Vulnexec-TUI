const {spawnSync, spawn, exec} = require('child_process')


const scan_vulns = async (ip, mode) => {
    const log_time = `[${new Date().toLocaleString()}]`
    ip = ip.toString()
    const scan = exec(`nmap -T5 -Pn --script vuln -i ./scans/192.168.0.1.txt 192.168.0.1 -vv`, (err, stdout, stderr) => {
    
        if (err) {
            console.log(err)
        }
        console.log(stdout)
    })

    scan.on('stdout', (data) => {
        console.log(data)
    })

    console.log(scan.pid)
}

scan_vulns('192.168.0.1')