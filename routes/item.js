const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

router.get('/collection/item', dockerStartup, async (req, res) => {
    {
        try {
            await containerUtils.sync(req.header('username'))
            var result = await getItem(req.header('username'), req.header('item'))
            res.send(JSON.parse(result.toString()))
        } catch (error) {
            if (!error.message) {
                if (!error.stderr) res.status(401).send({error: error});
                else res.status(401).send({error: error.stderr.toString()});
            } else res.status(401).send({error: error.message});

        }
    }
})

const getItem = async (username, item) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bw', 'get', 'item', item])
        } catch (e) {
            throw new Error("Could not get item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router;