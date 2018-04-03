const express = require('express');
const { searchOnElasticDb } = require('../methods/search');

const router = express.Router();
router.get('/search', (req, res) => {
  searchOnElasticDb(req.query.token, req.query.size, req.query.from)
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
