const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

router.get('/get/item', dockerStartup, sync, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'item', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/username', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'username', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})


router.get('/get/password', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'password', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})


router.get('/get/uri', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'uri', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/totp', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'totp', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/exposed', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'exposed', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/attachment', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'attachment', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/folder', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'folder', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/collection', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'collection', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/org-collection', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'org-collection', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/organization', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'organization', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/template', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'template', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

router.get('/get/fingerprint', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        var result = await getObject(req.header('username'), args, 'fingerprint', req.header('search'))
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})


const buildArgs = (req) => {
    let args = ""
    if (req.header('itemid')) args += " --itemid " + req.header('itemid')
    if (req.header('output')) args += " --output " + req.header('output')
    if (req.header('organizationid')) args += " --organizationid " + req.header('organizationid')
    if (req.header('raw')) args += " --raw"
    return args
}


const getObject = async (username, args, type, search) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            // TODO: Fix Attachments
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw get ' + type + ' ' + search + args])
        } catch (e) {
            throw new Error("Could not get item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router;