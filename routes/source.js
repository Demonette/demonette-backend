const express = require('express');
const source = require('../methods/source');

const router = express.Router();

router.get('/source', (req, res) => {
  source()
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
