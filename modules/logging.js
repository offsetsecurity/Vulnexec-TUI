const { lib, misc } = require('./dependencies')

const log = async (message) => {
    console.log(lib.chalk.redBright(['[', misc.get_time(), '] ', message].join('')))

    if (!lib.fs.existsSync('./logs')) {
        lib.fs.mkdirSync('./logs')
    }
    lib.fs.writeFileSync('../dev-log.log', ['[', misc.get_time(), '] ', message].join(''))
}

module.exports = {
    log
}