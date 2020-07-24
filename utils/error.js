const consoleColors = require('./consoleColors')

const sendErrorMessage = async (error, res) => {
    if (!error.message) {
        if (!error.stderr) res.status(401).send({error: error});
        else res.status(401).send({error: error.stderr.toString()});
    } else res.status(401).send({error: error.message});
}

const printConsoleError = (e) => {
    console.error(consoleColors.red + "########### Error ##########")
    console.error(consoleColors.errorPrefix + e.toString())
    console.error(consoleColors.errorPrefix + e.stderr.toString())
    console.error("############################" + consoleColors.reset)
}

module.exports = {
    sendErrorMessage,
    printConsoleError
}