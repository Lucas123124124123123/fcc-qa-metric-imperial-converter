'use strict';

const store = require('../models/store.js');

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const issues = store.find(project, req.query);
      return res.json(issues);
    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const issue = store.create(project, req.body);
      return res.json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
      const { _id, ...fields } = req.body;

      if (!_id) return res.json({ error: 'missing _id' });

      const updates = {};
      Object.keys(fields).forEach(key => {
        if (fields[key] !== '' && fields[key] !== undefined) {
          updates[key] = fields[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      const updated = store.update(project, _id, updates);
      if (!updated) return res.json({ error: 'could not update', _id });

      return res.json({ result: 'successfully updated', _id });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;

      if (!_id) return res.json({ error: 'missing _id' });

      const removed = store.remove(project, _id);
      if (!removed) return res.json({ error: 'could not delete', _id });

      return res.json({ result: 'successfully deleted', _id });
    });
};
