const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

// TODO: Contact Support because delete is not workin right

router.post('/share', dockerStartup, sync, async (req, res) => {
    try {
        let {id} = req.body;
        const result = await deleteObject(req.header('username'), 'item', args, id);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    const {organizationid, itemid, permanent} = req.body;
    if (organizationid) args += " --organizationid " + organizationid
    if (itemid) args += " --organizationid " + itemid
    if (permanent) args += " --permanent"
    return args
}

const deleteObject = async (username, type, args, id) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw delete' + args + " " + type + " " + id])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router