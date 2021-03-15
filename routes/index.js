var express = require('express');
var router = express.Router();
const Message = require('../models/message')
const { body, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only' });
});

router.get('/newmessage', (req, res, next) => {
  res.render('newmessage_form', {title: 'Create a new message'})
})

router.post('/newmessage',
  body('title', 'Title required').trim().isLength({ min: 1 }).escape(),
  body('body', 'Message required').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('newmessage_form_form', {errors, title:'Sign Up Form'})
    }
    else {
      const message = new Message({
        title: req.body.title,
        body: req.body.body,
        user: req.user
      })
      message.save((err) => {
        if (err) {
          next(err)
        }
        else {
          console.log(message)
          return res.redirect('/')
        }
      })
    }
  }
)

router.get('/delete/:id', (req, res, next) => {
  Message.deleteOne({_id: req.params.id}, (err, data) => {
    if (err) {
      next(err)
    }
    else {
      res.redirect('/')
    }
  })
})

module.exports = router;
