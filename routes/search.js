const express = require('express');
const search = require('../methods/search');

const router = express.Router();

router.get('/search', (req, res) => {
  search(req.query.token, req.query.size, req.query.from)
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
