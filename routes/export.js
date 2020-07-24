const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/dockerStartup');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

router.get('/export', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        const result = await exportObject(req.header('username'), req.header('password'), args);
        res.send(result.toString())
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    if (req.header('organizationid')) args += " --organizationid " + req.header('organizationid')
    if (req.header('format')) args += " --format " + req.header('format')
    return args
}

const exportObject = async (username, password, args) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw export ' + password + args])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router