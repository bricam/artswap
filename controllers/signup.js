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
      userName: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }).then((user) => {
      req.login(user, () =>
        res.redirect('/')
      );
    }).catch(() => {
      res.render('signup');
    });
  },
};
