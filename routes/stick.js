const express = require('express');
const asyncHandler = require('express-async-handler');
const Stick = require('../models/stick');
const Category = require('../models/category');

const router = express.Router();

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();
    res.render('stickForm', { categories: allCategories });
  }),
);

router.post(
  '/create',
  asyncHandler(async (req, res, next) => {
    const stick = new Stick({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      has_image: false,
    });

    await stick.save();
    res.redirect(stick.url);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const stick = await Stick.findById(req.params.id)
      .populate('category')
      .exec();
    res.render('stickDetails', { stick });
  }),
);

router.get(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    const [stick, allCategories] = await Promise.all([
      Stick.findById(req.params.id).populate('category').exec(),
      Category.find({}).exec(),
    ]);

    res.render('stickForm', { stick: stick, categories: allCategories });
  }),
);

router.post(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    const stick = new Stick({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      has_image: false,
      _id: req.params.id,
    });

    const updatedStick = await Stick.findByIdAndUpdate(
      req.params.id,
      stick,
      {},
    );
    res.redirect(updatedStick.url);
  }),
);

router.get(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    const stick = await Stick.findById(req.params.id).exec();
    res.render('stickDelete', { stick });
  }),
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    await Stick.findByIdAndRemove(req.body.stickId);
    res.redirect('/');
  }),
);

module.exports = router;
