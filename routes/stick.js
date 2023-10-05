const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.get(
  '/create',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Create stick page');
  }),
);

router.post(
  '/create',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Create stick page');
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Stick details page');
  }),
);

router.get(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Update stick page');
  }),
);

router.post(
  '/:id/update',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Update stick page');
  }),
);

router.get(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: GET Delete stick page');
  }),
);

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    res.send('Not implemented: POST Delete stick page');
  }),
);

module.exports = router;
