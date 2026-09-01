'use strict';

const store = require('../models/store.js');

module.exports = function (app) {
  app
    .route('/api/books')

    .get(function (req, res) {
      return res.json(store.list());
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) return res.send('missing required field title');

      const book = store.create(title);
      return res.json({ _id: book._id, title: book.title });
    })

    .delete(function (req, res) {
      store.removeAll();
      return res.send('complete delete successful');
    });

  app
    .route('/api/books/:id')

    .get(function (req, res) {
      let bookid = req.params.id;
      const book = store.findById(bookid);
      if (!book) return res.send('no book exists');

      return res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.send('missing required field comment');

      const book = store.addComment(bookid, comment);
      if (!book) return res.send('no book exists');

      return res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      const removed = store.remove(bookid);
      if (!removed) return res.send('no book exists');

      return res.send('delete successful');
    });
};
