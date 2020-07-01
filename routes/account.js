const express = require('express');
const router = express.Router();
const docker = require('../states/docker');
const spawn = require('await-spawn')
const config = require('../config')

const docker_startup = require('../middleware/docker_startup');

router.get('/account/login', docker_startup, async (req, res) => {
    {
        try {
            const session = await login(req.header('username'), req.header('password'))
            res.status(201).send(session)
        } catch (error) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        }
    }
})

const login = async (username, password) => {
    const container_name = config.container_prefix + username.replace('\@', config.slave_docker_image_name_replacement_char)
    console.log(container_name)

    if (!container_name in docker.container) {
        try {
            await spawn('docker', ['run', '--name', container_name, '-d', config.slave_docker_image_name])
            docker.container.push(container_name)
            console.log(docker.container)
        } catch (e) {
            console.error(e.toString())
            throw new Error("Could not start a docker session container")
        }
    }
    try {
        session = await spawn('docker', ['exec', container_name, 'bw', 'login', username, password, '--raw'])
        session = session.child.stdout.toString()
        await spawn('docker', ['exec', container_name, 'export', 'BW_SESSION=' + session])
    }catch (e) {
        console.error(e.toString())
        throw new Error("Could not login. Please check you login data.")
    }
    return session
}

const server = async (server = "https://bitwarden.com") => {
    return await spawn('bw', ['config', 'server', server])
}

const logout = async () => {
    try {
        process.env.BW_SESSION = ""
        await spawn('bw', ['logout']);
    } catch (ignore) {
    }
}

module.exports = router;