const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

router.post('/edit/item', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'item', args, id, json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/edit/folder', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'folder', args, id, json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/edit/item-collections', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {json, id} = req.body;
        const result = await editObject(req.header('username'), 'item-collections', args, id, json);
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
    const {organizationid} = req.body;
    if (organizationid) args += " --organizationid " + organizationid

    return args
}

const editObject = async (username, type, args, id, json) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            console.log(json)
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw edit' + args + " " + type + " " + id + " " + json])
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