const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

router.get('/list/items', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'items')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/list/folders', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'folders')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})


router.get('/list/collections', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'collections')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/list/organizations', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'organizations')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/list/org-collections', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'org-collections')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/list/org-members', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await listObject(req.header('username'), args, 'org-members')
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    if (req.header('search')) args += " --search " + req.header('search')
    if (req.header('url')) args += " --url " + req.header('url')
    if (req.header('folderid')) args += " --folderid " + req.header('folderid')
    if (req.header('collectionid')) args += " --collectionid" + req.header('collectionid')
    if (req.header('organizationid')) args += " --organizationid" + req.header('organizationid')
    if (req.header('trash')) args += " --trash"

    return args
}

const listObject = async (username, args, type) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw list ' + type + args])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not get items")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}


module.exports = router;