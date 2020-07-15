const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')


router.get('/create/item', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await getObject(req.header('username'), args, 'item', req.header('json'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});

    }
})


const buildArgs = (req) => {
    let args = ""
    if (req.header('itemid')) args += " --itemid " + req.header('itemid')
    if (req.header('organizationid')) args += " --organizationid " + req.header('organizationid')

    return args
}


const createObject = async (username, args, type, search) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bw', 'get', type, search, args])
        } catch (e) {
            throw new Error("Could not get item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router;

