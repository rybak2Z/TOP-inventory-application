const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Stick = require('../models/stick');

const router = express.Router();

function createNameValidationChain() {
  return body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name must not be empty.')
    .escape()
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters long.')
    .isAlphanumeric()
    .withMessage('Description must only contain alphanumeric characters.');
}

router.get(
  '/all',
  asyncHandler(async (req, res, next) => {
    const [allSticks, allCategories] = await Promise.all([
      Stick.find({}).populate('category').exec(),
      Category.find({}).exec(),
    ]);

    res.render('index', {
      selectedCategoryId: 'all',
      categories: allCategories,
      sticks: allSticks,
    });
  }),
);

router.get(
  '/list',
  asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).exec();
    res.render('categoryList', { categories: allCategories });
  }),
);

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    res.render('categoryForm', {});
  }),
);

router.post(
  '/create',
  createNameValidationChain(),
  asyncHandler(async (req, res, next) => {
    const category = new Category({ name: req.body.name });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('categoryForm', { category, errors: errors.array() });
      return;
    }

    await category.save();
    res.redirect('/category/list');
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const [allSticksByCategory, allCategories] = await Promise.all([
      Stick.find({ category: req.params.id }).populate('category').exec(),
      Category.find({}).exec(),
    ]);

    res.render('index', {
      selectedCategoryId: req.params.id.toString(),
      categories: allCategories,
      sticks: allSticksByCategory,
    });
  }),
);

router.get(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();
    res.render('categoryForm', { category });
  }),
);

router.post(
  '/:id/update',
  createNameValidationChain(),
  asyncHandler(async (req, res, next) => {
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('categoryForm', { category, errors: errors.array() });
      return;
    }

    await Category.findByIdAndUpdate(req.params.id, category, {});
    res.redirect('/category/list');
  }),
);

router.get(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    const [category, allSticksByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Stick.find({ category: req.params.id }).exec(),
    ]);
    res.render('categoryDelete', { category, sticks: allSticksByCategory });
  }),
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    const allSticksByCategory = await Stick.find({
      category: req.params.id,
    }).exec();
    if (allSticksByCategory.length > 0) {
      res.redirect(`/category/${req.params.id}/delete`);
      return;
    }

    await Category.findByIdAndRemove(req.body.categoryId);
    res.redirect('/category/list');
  }),
);

module.exports = router;
