const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

router.get('/generate', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        const result = await generate(req.header('username'), args);
        res.send(result.toString())
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    if (req.header('uppercase')) args += " --uppercase"
    if (req.header('lowercase')) args += " --lowercase"
    if (req.header('number')) args += " --number"
    if (req.header('special')) args += " --special"
    if (req.header('passphrase')) args += " --passphrase"
    if (req.header('length')) args += " --length " + req.header('length')
    if (req.header('words')) args += " --words " + req.header('words')
    if (req.header('seperator')) args += " --seperator " + req.header('seperator')

    return args
}

const generate = async (username, args) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw generate' + args])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router