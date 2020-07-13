const docker = require('../states/docker')

const dockerCheckStartup = async (req, res, next) => {
    try {
        console.log("CheckStartup")
        if (docker.startup) next(); else throw new Error("API not fully started")
    }  catch (error) {
        res.status(423).send({error: error.message});
    }
};

module.exports = dockerCheckStartup;