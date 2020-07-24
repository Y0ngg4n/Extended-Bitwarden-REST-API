const config = require('../config')
const docker = require('../states/docker');
const spawn = require('await-spawn')
const errorUtils = require('../utils/error')

const getContainerName = (username) => {
    return config.container_prefix + username.replace('\@', config.slave_docker_image_name_replacement_char)
}

const sync = async (username) => {
    const container_name = getContainerName(username)
    try {
        await spawn('docker', ['exec', '-e', 'BW_SESSION='
        + docker.container.get(container_name), container_name, 'bw', 'sync'])
    } catch (e) {
        errorUtils.printConsoleError(e)
        throw new Error("Could not sync")
    }
}

module.exports = {
    getContainerName,
    sync
}