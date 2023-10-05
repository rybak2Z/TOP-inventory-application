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
    const category = await Category.findById(req.params.id).exec();
    res.render('categoryForm', { category });
  }),
);

router.post(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    await Category.findByIdAndUpdate(req.params.id, category, {});
    res.redirect('/category/list');
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
