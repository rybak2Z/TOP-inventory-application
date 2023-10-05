const express = require('express');
const asyncHandler = require('express-async-handler');
const Stick = require('../models/stick');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const allSticks = await Stick.find({}).populate('category').exec();
    console.log(allSticks);
    res.render('index', { sticks: allSticks });
  }),
);

module.exports = router;
