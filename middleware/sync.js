const containerUtils = require('../utils/container')

const dockerCheckStartup = async (req, res, next) => {
    try {
        await containerUtils.sync(req.header('username'))
        next();
    }  catch (error) {
        res.status(423).send({error: error.message});
    }
};

module.exports = dockerCheckStartup;