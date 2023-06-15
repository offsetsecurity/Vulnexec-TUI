const {spawnSync} = require('child_process')

const is_alive = async (ip) => {

    const scan = spawnSync('ping', ['-c', '1', ip])

    if (scan.stdout.toString().includes('1 received')) {
        return true
    } else {
        return false
    }

}


module.exports = {
    is_alive
}