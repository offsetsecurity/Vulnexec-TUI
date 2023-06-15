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
    rows: 50,
    cols: 50,
    screen: screen
})

const info_panel = grid.set(0, 0, 10, 30, lib.blessed.box, {
    label: 'Info',
    content : lib.chalk.redBright(`VulnExec TUI v${lib.fs.readFileSync('./modules/assets/version.txt')}\nMode: ${mode}\nTarget: ${args[args.indexOf('--target') + 1]} - ${target.length} Addresses`),
    style: {
        border: {
            fg: 'red'
        }
    }
})

const vulnexec_main = grid.set(10, 0, 40, 30, lib.blessed.box, {
    label: 'VulnExec',
    style: {
        border: {
            fg: 'red'
        }
    }
})

const nmap_log = grid.set(0, 30, 25, 20, lib.blessed.box, {
    label: 'Nmap Log',
    style: {
        border: {
            fg: 'red'
        }
    }
})

const meta_sploit_log = grid.set(25, 30, 25, 20, lib.blessed.box, {
    label: 'Target Log',
    style: {
        border: {
            fg: 'red'
        }
    }
})


setInterval(() => {
    screen.render()
}, 100)


const main = async () => {
    if (mode == 'Loud') {
       await vulnexec_main.setContent(`${vulnexec_main.getContent()}Starting VulnExec TUI v${lib.fs.readFileSync('./modules/assets/version.txt')}`)
       await mod.misc.delay(1000)

       for (let i = 0; i < target.length; i++) {
           await vulnexec_main.setContent(`${vulnexec_main.getContent()}\nScanning ${target[i]}`)
           let scan = await mod.nmap_mod.is_alive(target[i])
           await mod.misc.delay(1000) * Math.floor(Math.random() * 10)
              if (scan) {
                nmap_log.setContent(`${nmap_log.getContent()}\n${lib.chalk.greenBright(target[i])} is alive`)
              } else {
                nmap_log.setContent(`${nmap_log.getContent()}\n${lib.chalk.redBright(target[i])} is dead`)
              }

       }
    }

}

main()

module.exports = {
    info_panel,
    vulnexec_main,
    nmap_log,
    meta_sploit_log,
    mode,
    target
}