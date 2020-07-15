const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')

router.get('/list/items', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'items')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.get('/list/folders', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'folders')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})


router.get('/list/collections', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'collections')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.get('/list/organisations', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'organisations')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.get('/list/org-collections', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'org-collections')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.get('/list/org-members', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        var result = await listObject(req.header('username'), args, 'org-members')
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
    if (req.header('search')) args += " --search " + req.header('search')
    if(req.header('url')) args += " --url " + req.header('url')
    if(req.header('folderid')) args += " --folderid " + req.header('folderid')
    if(req.header('collectionid')) args += " --collectionid" + req.header('collectionid')
    if(req.header('organisationid')) args += " --organisationid" + req.header('organisationid')
    if(req.header('trash')) args += " --trash" + req.header('trash')

    return args
}

const listObject = async (username, args, type) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bw', 'list', type, args])
        } catch (e) {
            console.error(e.stderr.toString())
            throw new Error("Could not get items")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}


module.exports = router;