'use strict';
const express = require('express');
const router = express.Router();


global.isAdminParse = function(req){
  if (req.session && req.session.admin && req.session.user !== undefined) //
    {
      return true
    } else {
      return true
    }
};

module.exports = router;
