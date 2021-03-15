var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require("passport");
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

router.get('/new', (req, res) => {
  res.render('signup_form', {title: "Sign Up Form"});
})

router.post('/new',
  body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
  body('name', 'Name required').trim().isLength({ min: 1 }).escape(),
  body('passwordConfirmation').custom((value, { req }) => {
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup_form', {errors, title:'Sign Up Form'})
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
              next()
            }
          })
        }
      })
    }
  },
  passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/"
  })

);

router.get('/membership', (req, res, next) => {
  res.render('membership_form', {title: 'Change Membership Status'});
})

router.post('/membership',
  body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('membership_form', {errors, title: 'Change Membership Status'})
    }
    else {
      if (req.body.password === process.env.MEMBER_PASSWORD) {
        req.user.ismember = true
        req.user.save((err, data) => {
          if(err) {
            return next(err)
          }
        })
        res.render('correct_password', {title: 'Success', status: 'member'})
      }
      else if (req.body.password === process.env.ADMIN_PASSWORD) {
        req.user.ismember = true
        req.user.isadmin = true
        req.user.save((err, data) => {
          if(err) {
            return next(err)
          }
        })
        res.render('correct_password', {title: 'Success', status: 'admin'})
      }
      else {
        res.render('membership_form', {title: 'Sign Up Form', failure: true})
      }
    }
  }
)

router.get('/login', (req, res) => {
  res.render('login_form', {title: 'Login'})
})

router.post('/login', 
  body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login_form', {errors, title: 'Login'})
    }
    else {
      next()
    }
  },
  passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
})
module.exports = router;
