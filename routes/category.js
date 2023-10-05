const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.get(
  '/list',
  asyncHandler(async (req, res, next) => {
    res.render('categoryList', { categories: [] });
  }),
);

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Create category page');
  }),
);

router.post(
  '/create',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Create category page');
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
