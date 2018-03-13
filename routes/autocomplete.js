const express = require('express');
const autocomplete = require('../methods/autocomplete');

const router = express.Router();

router.get('/autocomplete', (req, res) => {
  autocomplete(req.query.token)
    .then(resp => res.status(200).send(resp))
    .catch(resp => res.status(400).send(resp));
});
module.exports = router;
