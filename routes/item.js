const express = require('express');
const router = express.Router();
const spawn = require('await-spawn')

router.get('/collection/item', async (req, res) => {
    {
        try {
            var result = await getItem(req.header('item'))
            res.status(201).send(result.toString())
        } catch (error) {
            if (!error.stderr) res.status(401).send({error: error});
            else res.status(401).send({error: error.stderr.toString()});
        }
    }
})

const getItem = async (item) => {
    return result = await spawn('bw', ['get', 'item', item])
}

module.exports = router;