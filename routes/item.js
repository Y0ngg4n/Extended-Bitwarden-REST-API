const auth = require('../middleware/auth')
const express = require('express');
const router = express.Router();
const spawn = require('await-spawn')

router.get('/collection/item', auth, async (req, res) => {
    {
        try {
            var result = await getItem(req.header('item'), req.header('password'))
            console.log(result.child.stdout)
            res.status(201).send(result.child.stdout)
        } catch (error) {
            console.log(error)
            res.status(400).send(error.stderr.toString());
        }
    }
})

const getItem = async (item, password) => {
    console.log(item)
    await spawn('bw', ['get', 'item', item, '<', password])
    console.log(item)
}


module.exports = router;