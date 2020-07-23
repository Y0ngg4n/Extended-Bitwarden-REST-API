const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

router.post('/restore', dockerStartup, async (req, res) => {
    try {
        await containerUtils.sync(req.header('username'))
        const {id} = req.body
        const result = await restore(req.header('username'), id);
        res.status(201).send()
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

const restore = async (username, id) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw restore item ' + id])
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