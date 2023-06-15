// declare all dependencies required for the tui
const blessed = require('neo-blessed')
const contrib = require('blessed-contrib')

// declare dependecies required for vulnexec stanalone
const fs = require('fs')
const path = require('path')
const { spawn,exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
const spawnAsync = promisify(spawn)
const nmap = require('node-nmap')
const spinnies = require('spinnies')
const chalk = require('chalk')
const {getIPRange} = require('get-ip-range')
const check_alive = require('is-reachable')
const spinner = new spinnies()



// declare all modules
const main = require('../index.js')
const nmap_mod = require('./nmap')
const logging = require('./logging.js')
const vulnexec = require('./vulnexec.js')
const misc = require('./misc.js')
const meta = require('./metasploit.js')


// export all dependencies


const lib = {
    blessed,
    contrib,
    fs,
    path,
    spawn,
    exec,
    promisify,
    execAsync,
    spawnAsync,
    nmap,
    chalk,
    spinner,
    getIPRange,
    check_alive
}


const mod = {
    main,
    nmap_mod,
    logging,
    vulnexec,
    misc,
    meta
}

module.exports = {
    lib,
    mod
}
