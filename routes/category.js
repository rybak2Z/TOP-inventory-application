const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');

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
    const category = await Category.findById(req.params.id).exec();
    res.render('categoryDelete', { category });
  }),
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    await Category.findByIdAndRemove(req.body.categoryId);
    res.redirect('/category/list');
  }),
);

module.exports = router;
