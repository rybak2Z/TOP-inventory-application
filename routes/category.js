const express = require('express');
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

const router = express.Router();

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
  asyncHandler(async (req, res, next) => {
    const category = new Category({ name: req.body.name });
    await category.save();
    res.redirect('/category/list');
  }),
);

router.get(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Update category page');
  }),
);

router.post(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Update category page');
  }),
);

router.get(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Delete category page');
  }),
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Delete category page');
  }),
);

module.exports = router;
