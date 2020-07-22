const express = require('express');
const router = express.Router();

var initFunction = (req, res, next) => {
  res.send({
    code: (req.user !== undefined) ? 500 : 430,
    userDATA: JSON.stringify(req.user)
  })
};

router.post('/init', initFunction);

module.exports = router;
