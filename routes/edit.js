const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

router.post('/edit/item', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'item', args, id, json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.post('/edit/folder', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'folder', args, id, json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.post('/edit/item-collections', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'item-collections', args, id, json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    const {organizationid} = req.body;
    if (organizationid) args += " --organizationid " + organizationid

    return args
}

const editObject = async (username, type, args, id, json) => {
    json = encodeToBase64(json);
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw edit' + args + " " + type + " " + id + " " + json])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router
