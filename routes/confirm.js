const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')

const sync = require('../middleware/sync');
const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')
const errorUtils = require('../utils/error')

// TODO: Contact Support because delete is not workin right

router.post('/confirm', dockerStartup, sync, async (req, res) => {
    try {
        let {id, org_member} = req.body;
        const args = buildArgs(req)
        const result = await confirmObject(req.header('username'), id, args, org_member);
        res.send(JSON.parse(result.toString()))
    } catch (error) {
        await errorUtils.sendErrorMessage(error, res)
    }
})

const buildArgs = (req) => {
    let args = ""
    const {organizationid} = req.body
    if (organizationid) args += " --organizationid " + organizationid

    return args
}

const confirmObject = async (username, id, args, org_member) => {
    const container_name = containerUtils.getContainerName(username)

    if (docker.container.has(container_name)) {
        try {
            return await spawn('docker', ['exec', '-e', 'BW_SESSION='
            + docker.container.get(container_name), container_name, 'bash', '-c', 'bw confirm' + args + ' ' + org_member + ' ' + id])
        } catch (e) {
            errorUtils.printConsoleError(e)
            throw new Error("Could not edit item")
        }
    } else {
        throw new Error("You have to login first or check if item exist")
    }
}

module.exports = router