const express = require('express');
const { graph } = require('../methods/graph');

const router = express.Router();

router.get('/graph', (req, res) => {
  graph(req.query.start, req.query.range, req.query.tokens)
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
