const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

// TODO: Contact Support because delete is not workin right

router.post('/delete/item', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {id} = req.body;
        const result = await deleteObject(req.header('username'), 'item', args, id);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

// TODO: Fix Attachments
router.post('/delete/attachment', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {id} = req.body;
        const result = await deleteObject(req.header('username'), 'attachment', args, id);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/delete/folder', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {id} = req.body;
        const result = await deleteObject(req.header('username'), 'folder', args, id);
        res.status(201).send()
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

// TODO: Fix org-collection
router.post('/delete/org-collection', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {id} = req.body;
        const result = await deleteObject(req.header('username'), 'org-collection', args, id);
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
            console.log(json)
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw delete' + args + " " + type + " " + id])
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