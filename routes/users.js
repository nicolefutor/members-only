var express = require('express');
var router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

router.get('/new', (req, res) => {
  res.render('signup_form');
})

router.post('/new',
  body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
  body('name', 'Name required').trim().isLength({ min: 1 }).escape(),
  body('passwordConfirmation').custom((value, { req }) => {
    console.log(value, req.body.password);
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup_form', {errors})
    }
    else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          next(err)
        }
        else {
          const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hash
          });
          user.save(err => {
            if (err) {
              next(err)
            }
            else {
              res.redirect('/')
            }
          })
        }
      })
    }
  }

);

module.exports = router;
