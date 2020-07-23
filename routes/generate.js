const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

router.get('/generate', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        const result = await generate(req.header('username'), args);
        res.send(result.toString())
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
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
            console.error(e.stderr.toString())
            console.error(e.toString())
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router