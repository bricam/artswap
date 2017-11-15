const express = require('express');
const models = require('../models');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', this.index);
    router.post('/', this.submit);

    return router;
  },

  index(req, res) {
    res.render('signup', {title: 'Join Artswap', layout:'noNavigation'});
  },
  submit(req, res) {
    models.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    }).then((user) => {
      req.login(user, () =>
        res.redirect('/')
      );
    }).catch((err) => {
      //console.log(err);
      res.render('signup',  {title: 'Join Artswap', errorcode: err.errors ,layout:'noNavigation'});
      
    });
  },
};
