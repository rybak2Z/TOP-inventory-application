const express = require('express');
const asyncHandler = require('express-async-handler');
const Stick = require('../models/stick');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.redirect('/category/all');
  }),
);

module.exports = router;
