// import all dependencies
const { lib, mod } = require('./modules/dependencies.js')
const { delay } = require('./modules/misc.js')


const args = process.argv.slice(2)

let mode = args.indexOf('--mode') > -1 ? args[args.indexOf('--mode') + 1] : 'tui'
let target = args.indexOf('--target') > -1 ? args[args.indexOf('--target') + 1] : 'tui'
let dev = args.indexOf('-dev') > -1 ? true : false



//check if the target is an ip range or a single ip
if (target.includes('-') || target.includes('/') && !target.includes('http')) {
    target = lib.getIPRange(target)
} else if (target.includes('http')) {
    target = target.replace('http://', '')
    target = target.replace('https://', '')
    target = target.replace('/', '')
    target = [target]
} else {
    target = [target]
}

/*
            NOTES:

            - Alive Scan works using  nmap with the -Pn flag
            - Sometimes the --script vuln doesn't output anything, but the vuln is still there
            - Need to filter out DOS attacks from the vuln scan
            
            - Program is full crashing after the isalive scan, need to fix that

            - Need to add a dev mode which allows a seperate screen to be opened for the dev console
            - Need to add a dev console which allows the user to run commands in the background



*/


// Dev mode
if (dev) {
    console.log('Developer Mode')

    lib.exec('bash', (err, stdout, stderr) => {
        if (err) {
            console.log(err)
        }
        console.log(stdout)
    })
}
if (mode == 'tui') {
    console.log('You must add --mode (Loud / Quiet) AND --target (IP / URL) to run in tui mode')
    process.exit(1)
} 

if (mode == 'quiet' || mode == 'q' || mode == 'Q' || mode == 'Quiet') {
    mode = 'Quiet'
} else if (mode == 'loud' || mode == 'l' || mode == 'L' || mode == 'Loud') {
    mode = 'Loud'
} else {
    console.log('You must add --mode (Loud / Quiet) AND --target (IP / URL) to run in tui mode')
    process.exit(1)
}

if (target == 'tui') {
    console.log('You must add --mode (Loud / Quiet) AND --target (IP / URL) to run in tui mode')
    process.exit(1)
}

console.error = function(msg) {
    if (msg.includes('Warning: '))
        return
    else
        process.stderr.write(msg)
}

const screen = lib.blessed.screen({
    smartCSR: true,
    title: 'VulnExec'
})

const grid = new lib.contrib.grid({
    rows: 100,
    cols: 100,
    screen: screen
})

const info_panel = grid.set(30, 0, 10, 50, lib.blessed.box, {
    label: 'Info',
    content : lib.chalk.redBright(`VulnExec TUI v${lib.fs.readFileSync('./modules/assets/version.txt')}\nMode: ${mode}\nTarget: ${args[args.indexOf('--target') + 1]} - ${target.length} Addresses`),
    style: {
        border: {
            fg: 'red'
        }
    }
})

const vulnexec_main = grid.set(40, 0, 50, 50, lib.blessed.log, {
    label: 'VulnExec',
    style: {
        border: {
            fg: 'red'
        }
    }
})

const nmap_log = grid.set(40, 50, 50, 25, lib.blessed.log, {
    label: 'Nmap Log',
    style: {
        border: {
            fg: 'red'
        }
    }
})

const target_log = grid.set(0, 50, 40, 25, lib.blessed.log, {
    label: 'Target Log',
    style: {
        border: {
            fg: 'red'
        }
    }
})

const logo = grid.set(0, 0, 30, 50, lib.contrib.lcd, { segmentWidth: 0.06 // how wide are the segments in % so 50% = 0.5
, segmentInterval: 0 // spacing between the segments in % so 50% = 0.550% = 0.5
, strokeWidth: 0.1 // spacing between the segments in % so 50% = 0.5
, elements: 8 // how many elements in the display. or how many characters can be displayed.
, display: 321 // what should be displayed before first call to setDisplay
, elementSpacing: 0 // spacing between each element
, elementPadding: 0 // how far away from the edges to put the elements
, color: 'red' // color for the segments
, label: 'Storage Remaining',
    style: {
        border: {
            fg: 'red'
        }
    }

})


const meta_box = grid.set(0, 75, 90, 25, lib.blessed.log, {
    label: 'Metasploit Log',
    style: {
        border: {
            fg: 'red'
        }
    }
})


setInterval(() => {
    logo.setDisplay('VULNEXEC')
    screen.render()
}, 100)

// Create a function to wait for return of true or false
const wait_for = async (func) => {
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (func) {
                clearInterval(interval)
                resolve(true)
            }
        }, 100)
    })
}
const main = async () => {

    let plus = lib.chalk.greenBright('[+] ')
    let minus = lib.chalk.redBright('[-] ')
    let tick = lib.chalk.greenBright('✓ ')
    let cross = lib.chalk.redBright('✗ ')
    let waiting = lib.chalk.yellowBright('[/] ')
    let alive = []

    vulnexec_main.log(`Checking if required scripts are installed`)
    let vulners = await mod.vulnexec.check_vulners()
    await mod.misc.delay(1000)
    if (vulners == 'installing') {
        vulnexec_main.log(`Installing Required Scripts`)
        await mod.misc.delay(5000)
        vulnexec_main.log(tick + `Required Scripts Installed`)
    } else if (vulners == 'installed') {
        vulnexec_main.log(tick + `Required Scripts Installed`)
    } else {
        vulnexec_main.log(`Error Installing Required Scripts`)
        process.exit(1)
    }

    if (mode == 'Loud') {
        for (let i = 0; i < target.length; i++) {
            nmap_log.log(waiting + `Scanning ${target[i]}`)
            await mod.misc.delay(1000)
            let isalive = await mod.nmap_mod.is_alive(target[i])
            if (isalive) {
                alive.push(target[i])
                nmap_log.log(`${tick}Scanned ${target[i]}`)
            } else {
                vulnexec_main.log(`${minus + target[i]} is not alive`)
            }
        }

        target_log.log(`Alive Targets:`)
        for (let i = 0; i < alive.length; i++) {
            target_log.log(`${plus}${alive[i]}`)
            nmap_log.log(waiting + `Scanning ${alive[i]} for vulnerabilities`)
            await mod.misc.delay(1000)
            let scan = await wait_for(nmap_vuln(alive[i]))
            console.log(scan)
        }
    }

    if (alive.length == 0) {
        vulnexec_main.log(`No Alive Targets`)
        await mod.misc.delay(2000)
        process.exit(1)
    }

}

let vuln_extract = async (ip) => {
    const nmap_file = lib.fs.readFileSync('./scans/' + ip + '-vuln.txt')

    // Find the vulnerabilities (MS + CVE)
    const ms_regex = /MS\d{2}-\d{3}/g
    const cve_regex = /CVE-\d{4}-\d{4,7}/g

    const ms_vulns = nmap_file.toString().match(ms_regex)
    const cve_vulns = nmap_file.toString().match(cve_regex)

    // Remove duplicates
    const ms_vulns_unique = [...new Set(ms_vulns)]
    const cve_vulns_unique = [...new Set(cve_vulns)]

    // Create a list of all the vulnerabilities
    const vulns = ms_vulns_unique.concat(cve_vulns_unique)

    // Remove duplicates
    const vulns_unique = [...new Set(vulns)]

    vulnexec_main.log(`${lib.chalk.greenBright('Vulnerabilities Found: ' + vulns_unique.length)}`)
    return vulns_unique
}


const nmap_vuln = async (ip) => {
    const nmap_scan = lib.spawn('nmap', ['-sV', '-Pn','--script','vuln', ip, '-oN', './scans/' + ip + '-vuln.txt'])
    let vuln = []
    nmap_scan.stdout.on('data', (data) => {
        meta_box.log(data.toString())
    })

    nmap_scan.stderr.on('data', async(data) => {

        if ( data.toString().includes('1 host up') ) {
            const vuln_found = await vuln_extract(lib.fs.readFileSync('./scans/' + ip + '-vuln.txt'))
            if ( vuln_found.length > 0) {
                meta_box.log(vuln_found)
                vuln.push(vuln_found)
            } else {
                meta_box.log(`No vulnerabilities found on ${ip}`)
            }
        }

        if ( vuln_extract(data.toString()).length > 0) {
            meta_box.log(vuln_extract(data.toString()))
            vuln.push(vuln_extract(data.toString()))
        }
        nmap_log.log(data.toString())
    })


}

main()

module.exports = {
    info_panel,
    vulnexec_main,
    nmap_log,
    target_log
}