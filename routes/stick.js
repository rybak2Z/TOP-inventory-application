const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Stick = require('../models/stick');
const Category = require('../models/category');

const router = express.Router();

function createStickFormValidationChains() {
  return [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Name must not be empty.')
      .escape()
      .isLength({ max: 100 })
      .withMessage('Name must be at most 100 characters long.')
      .isAlphanumeric()
      .withMessage('Name must only contain alphanumeric characters.'),
    body('description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description must not be empty.')
      .escape()
      .isLength({ max: 200 })
      .withMessage('Description must be at most 200 characters long.')
      .isAlphanumeric()
      .withMessage('Description must only contain alphanumeric characters.'),
    body('category').custom(async (categoryId) => {
      const allCategories = await Category.find({}).select('_id').exec();
      for (const category of allCategories) {
        if (categoryId === category._id) {
          return true;
        }
      }
    }),
    body('price', 'Price must be an integer greater or equal to 0.').isInt({
      min: 0,
    }),
  ];
}

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();
    res.render('stickForm', { categories: allCategories });
  }),
);

router.post(
  '/create',
  createStickFormValidationChains(),
  asyncHandler(async (req, res, next) => {
    const stick = new Stick({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      has_image: false,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).exec();
      res.render('stickForm', {
        categories: allCategories,
        stick,
        errors: errors.array(),
      });
    }

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
  createStickFormValidationChains(),
  asyncHandler(async (req, res, next) => {
    const stick = new Stick({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      has_image: false,
      _id: req.params.id,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).exec();
      res.render('stickForm', {
        categories: allCategories,
        stick,
        errors: errors.array(),
      });
    }

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
