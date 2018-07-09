const express = require('express');

const router = express.Router();
const packageJson = require('../package.json');

router.get('/', (req, res) => {
  res.send({
    name: 'demonette-backend',
    version: packageJson.version,
  });
});
module.exports = router;
