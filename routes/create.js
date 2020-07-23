const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')


router.post('/create/item', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        let {json} = req.body;
        const result = await createObject(req.header('username'), 'item', json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/create/folder', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        const {json} = req.body;
        const result = await createObject(req.header('username'), 'folder', json);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/create/org-collection', dockerStartup, async (req, res) => {
    try {
        const args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        const {json} = req.body;
        const result = await createOrgCollection(req.header('username'), 'org-collection', json, args);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

router.post('/create/attachment', dockerStartup, async (req, res) => {
    try {
        let args = buildArgs(req)
        await containerUtils.sync(req.header('username'))
        const {file, json} = req.body;
        console.log(file)
        const attachment = await createAttachmentFile(req.header('username'), file)
        if (attachment) {
            args = "--file " + attachment + args
            const result = await createAttachment(req.header('username'), 'attachment', args, json);
            await removeAttachmentFile(attachment)
            res.send(JSON.parse(result.toString()))
        } else throw new Error("No file provided")
    } catch (error) {
        if (!error.message) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        } else res.status(401).send({error: error.message});
    }
})

const createAttachmentFile = async (username, file) => {
    const container_name = containerUtils.getContainerName(username)
    if (file) {
        try {
            const buff = Buffer.from(file, 'base64');
            let str = buff.toString('utf-8');
            str = str.replace(/'/g, "'\\\''")
            let tmpFile = await spawn("mktemp")
            tmpFile = tmpFile.toString().replace(/\n/g, "")
            await spawn('bash', ['-c', "echo -e '" + str + "' > " + tmpFile])
            let dockerTmpFile = await spawn('docker', ['exec', container_name, 'mktemp'])
            dockerTmpFile = dockerTmpFile.toString().replace(/\n/g, "")
            await spawn('docker', ['cp', tmpFile, container_name + ":" + dockerTmpFile])
            await spawn('rm', ['-rf', tmpFile])
            return dockerTmpFile
        } catch (e) {
            console.error(e.toString())
            throw new Error("Could not create attachment file")
        }
    }
}

const removeAttachmentFile = async (username, attachment) => {
    const container_name = containerUtils.getContainerName(username)
    try {
        await spawn('docker', ['exec', container_name, 'rm', '-rf', attachment])
    } catch (e) {
        console.error(e.toString())
        throw new Error("Could not remove attachment file")
    }
}

const buildArgs = (req) => {
    let args = ""
    const {itemid, organizationid} = req.body;
    if (itemid) args += " --itemid " + itemid
    if (organizationid) args += " --organizationid " + organizationid

    return args
}

const createObject = async (username, type, json) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bw', 'create', type, json])
        } catch (e) {
            console.error(e.stderr.toString())
            console.error(e.toString())
            throw new Error("Could not create item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

// TODO: Fix "--organizationid <organizationid> does not match request object."
const createOrgCollection = async (username, type, json, args) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            console.log(args)
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash','-c', 'bw create ' + type + args + " " +  json])
        } catch (e) {
            console.error(e.stderr.toString())
            console.error(e.toString())
            throw new Error("Could not create item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

// TODO: Fix create attachment (transform in bash -c)
const createAttachment = async (username, type, args, json) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            console.log(type)
            console.log(args)
            console.log(json)
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bw', 'create', type + " " + args, json])
        } catch (e) {
            console.error(e.stderr.toString())
            console.error(e.toString())
            throw new Error("Could not create item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}


module.exports = router;

