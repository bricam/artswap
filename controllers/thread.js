const express = require('express');
const models = require('../models');
const getSlug = require('speakingurl');
const multer = require('multer');
const path = require('path');


var file_image = '';
var storage = multer.diskStorage({
      destination: 'public/uploads',
      filename: function (req, file, cb) {
        file_image = file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        cb(null, file_image)
      }            
    });

var upload = multer({ storage: storage }).single('uploadImage');


module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', this.index);
    router.get('/:id', this.display);
    router.post('/', this.create);
    router.post('/:id', upload, this.createPost);
    
    //router.get('/edit/:slug', this.editThread);
    router.get('/edit/:id', this.edit);
    router.delete('/delete', this.remove);


    return router;
  },
  createPost(req, res){
    models.Post.create({
      UserId: req.user.id,
      ThreadId: req.params.id,
      body: req.body.info,
      image: '/uploads/'+file_image
    }).then((post) => {
      res.redirect(`/thread/${post.ThreadId}`);
    }).catch((err) => {
      if (err) {
        // An error occurred when uploading
        console.log("In createpost-------------------->");
        console.log(err);
      }else{
        res.json({msg: "working"})
      };
    });
  },

  index(req, res){
    models.Thread.findAll({
      order: [[ 'createdAt', 'DESC']]
    })
      .then((threads) => {
        res.render('threads', {
          threads: threads,
          //all enum values
          difficulties: models.Thread.rawAttributes.difficulty.values,
          purposes: models.Thread.rawAttributes.purpose.values
        });
      });
  },



  // Allows user to create a thread
  create(req, res){
    models.Thread.create({
      slug: getSlug(req.body.title.toLowerCase()),
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      purpose: req.body.purpose
    }).then((thread) => {
      res.redirect('/thread');
    }).catch((err) => {
      if(err){
        console.log(err);
      }
      res.render('threads/index')
    });
  },


  //Displays individual thread
  display(req, res){
    models.Thread.findOne({
      where: {
        id: req.params.id
      }
    }).then((thread) => {
       models.Post.findAll({
        where: {
          ThreadId: req.params.id
        }
      }).then((posts) => {
        res.render('threads/single', { thread, posts})
      })
    }).catch((err) => {
      if (err) {
        // An error occurred when uploading
        console.log(err);
      }
      res.redirect('/thread')
    })

  },

  //Allows user to post a response to the thread
  // newResponse(req, res){
  //     models.Post.create({
  //       UserId: req.user.id,
  //       ThreadId: req.params.id,
  //       body: req.body.info
  //     }).then((post) => {
  //       res.redirect(`/thread/${post.ThreadId}`)
  //     }).catch(() => {
  //       res.json({
  //         msg: "no"
  //       })
  //     })
  // },
  


  // Allows user to edit thread, iff thread belongs to user
  edit(req, res){
    res.render('/threads/update')
    // models.Thread.update({
    //   title: req.body.title,
    //   desription: req.body.description
    // },
    // {
    //   where: {
    //    slug: req.params.slug
    //   }
    // }).then(() => {
    //   res.render('threads/update')
    // }).catch(() => {
    //   res.redirect('/thread')
    // });
    
  },

  // editThread(req, res){

  //   res.render('/threads/update/')
  // }

  // Allows user to delete thread, iff thread belongs to user
  remove(req, res){
  }

};
