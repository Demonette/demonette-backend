const express = require('express');
const search = require('../methods/search');

const router = express.Router();

router.get('/search', (req, res) => {
  search(req.query.token, res);
});
module.exports = router;
