const spawn = require('await-spawn')
const auth = async (req, res, next) => {
    try {
        //TODO: Change cli commands to nodejs commands: https://github.com/bitwarden/cl
        await logout()

        await server(req.header('server'))

        await login(req.header('username'), req.header('password'))

        next();
    } catch (error)
        if (!error.stderr) res.status(401).send({error: error});
        else res.status(401).send({error: error.stderr.toString()});
    }
};

const logout = async () => {
    try {
        await spawn('bw', ['logout']);
    } catch (ignore) {
    }
}

const login = async (username, password) => {
    return await spawn('bw', ['login', username, password])
}

const server = async (server = "https://bitwarden.com") => {
    return await spawn('bw', ['config', 'server', server])
}

module.exports = auth;