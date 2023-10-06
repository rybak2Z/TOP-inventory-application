const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Stick = require('../models/stick');
const Category = require('../models/category');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '/../public/images'),
  filename: (req, file, cb) => {
    const uniqueName = `${req.body.name}-${Date.now()}.webp`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });
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
  upload.single('image'),
  createStickFormValidationChains(),
  asyncHandler(async (req, res, next) => {
    const stick = new Stick({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      image_file_name: req.file ? req.file.filename : undefined,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete image because request was invalid (I can't figure out how
      // to upload file only after the request has been validated)
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            throw err;
          }
        });
      }

      const allCategories = await Category.find({}).exec();
      res.render('stickForm', {
        categories: allCategories,
        stick,
        errors: errors.array(),
      });
      return;
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
  upload.single('image'),
  createStickFormValidationChains(),
  asyncHandler(async (req, res, next) => {
    const oldStick = await Stick.findById(
      req.params.id,
      'image_file_name',
    ).exec();
    const newImageExists = Boolean(req.file);
    let new_file_name;
    if (newImageExists) {
      new_file_name = req.file.filename;
    } else if (oldStick.image_file_name) {
      new_file_name = oldStick.image_file_name;
    } else {
      new_file_name = undefined;
    }

    const stick = new Stick({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      image_file_name: new_file_name,
      _id: req.params.id,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete image because request was invalid (I can't figure out how
      // to upload file only after the request has been validated)
      fs.unlink(req.file.path, (err) => {
        if (err) {
          throw err;
        }
      });

      const allCategories = await Category.find({}).exec();
      res.render('stickForm', {
        categories: allCategories,
        stick,
        errors: errors.array(),
      });
      return;
    }

    // Delete old image file
    if (oldStick.image_file_name && newImageExists) {
      const oldImageFilePath = path.join(
        __dirname,
        '/../public/images',
        oldStick.image_file_name,
      );
      fs.unlink(oldImageFilePath, (err) => {
        if (err) {
          throw err;
        }
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
    // Delete old image file
    const stick = await Stick.findById(req.params.id, 'image_file_name').exec();
    if (stick.image_file_name) {
      const imageFilePath = path.join(
        __dirname,
        '/../public/images',
        stick.image_file_name,
      );
      fs.unlink(imageFilePath, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    await Stick.findByIdAndRemove(req.body.stickId);
    res.redirect('/');
  }),
);

module.exports = router;
