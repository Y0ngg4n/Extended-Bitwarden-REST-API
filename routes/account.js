const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')
const config = require('../config')

const dockerStartup = require('../middleware/dockerStartup');
const containerUtils = require('../utils/container')


router.post('/account/login', dockerStartup, async (req, res) => {
    {
        try {
            await login(req.header('username'), req.header('password'), req.header('server'))
            res.status(201).send()
        } catch (error) {
            if (!error.message) {
                if (!error.stderr) res.status(401).send({error: error});
                else res.status(401).send({error: error.stderr.toString()});
            } else res.status(401).send({error: error.message});
        }
    }
})

router.post('/account/logout', dockerStartup, async (req, res) => {
    {
        try {
            await logout(req.header('username'))
            res.status(201).send()
        } catch (error) {
            if (!error.message) {
                if (!error.stderr) res.status(401).send({error: error});
                else res.status(401).send({error: error.stderr.toString()});
            } else res.status(401).send({error: error.message});
        }
    }
})

const login = async (username, password, server) => {
    const container_name = containerUtils.getContainerName(username)

    if (!docker.container.has(container_name)) {
        try {
            await spawn('docker', ['run', '--name', container_name, '-d', config.slave_docker_image_name])
        } catch (e) {
            throw new Error("Could not start a docker session container")
        }

        if (server) {
            try {
                await spawn('docker', ['exec', container_name, 'bw', 'config', 'server', server])
            } catch (e) {
                throw new Error("Could not set custom Bitwarden Server")
            }
        }

        try {
            const session = await spawn('docker', ['exec', container_name, 'bw', 'login', username, password, '--raw'])
            docker.container.set(container_name, session.toString())
        } catch (e) {
            throw new Error("Could not login. Please check you login data.")
        }
    }
}

const logout = async (username) => {
    const container_name = containerUtils.getContainerName(username)
    if (docker.container.has(container_name)) {
        try {
            await spawn('docker', ['exec', container_name, 'bw', 'logout'])
            await spawn('docker', ['container', 'stop', container_name])
            await spawn('docker', ['container', 'rm', container_name])
            docker.container.delete(container_name)
        }catch (e) {
            throw new Error("Could not logout")
        }
    }
}

module.exports = router;