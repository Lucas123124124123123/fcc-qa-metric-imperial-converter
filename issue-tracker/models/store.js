
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '..', 'data', 'issues.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

module.exports = {
  create(project, fields) {
    const db = load();
    const now = new Date().toISOString();

    const issue = {
      _id: newId(),
      issue_title: fields.issue_title,
      issue_text: fields.issue_text,
      created_by: fields.created_by,
      assigned_to: fields.assigned_to || '',
      status_text: fields.status_text || '',
      created_on: now,
      updated_on: now,
      open: true
    };

    if (!db[project]) db[project] = [];
    db[project].push(issue);
    save(db);
    return issue;
  },

  find(project, filters = {}) {
    const db = load();
    const issues = db[project] || [];

    return issues.filter(issue =>
      Object.keys(filters).every(key => {
        let expected = filters[key];
        if (key === 'open') expected = expected === 'true' || expected === true;
        return String(issue[key]) === String(expected);
      })
    );
  },

  update(project, id, fields) {
    const db = load();
    const issues = db[project] || [];
    const issue = issues.find(i => i._id === id);
    if (!issue) return null;

    Object.keys(fields).forEach(key => {
      if (key === 'open') {
        issue.open = !(fields.open === 'true' || fields.open === true);
      } else {
        issue[key] = fields[key];
      }
    });
    issue.updated_on = new Date().toISOString();

    save(db);
    return issue;
  },

  remove(project, id) {
    const db = load();
    const issues = db[project] || [];
    const index = issues.findIndex(i => i._id === id);
    if (index === -1) return false;

    issues.splice(index, 1);
    save(db);
    return true;
  }
};
