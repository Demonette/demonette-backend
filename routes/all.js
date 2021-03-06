const express = require('express');
const all = require('../methods/all');

const router = express.Router();

router.get('/all', (req, res) => {
  all(req.query.size, req.query.from, req.query.originFilter)
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
