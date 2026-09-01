
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '..', 'data', 'books.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function save(books) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(books, null, 2));
}

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

module.exports = {
  create(title) {
    const books = load();
    const book = { _id: newId(), title, comments: [] };
    books.push(book);
    save(books);
    return book;
  },

  list() {
    return load().map(book => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length
    }));
  },

  findById(id) {
    return load().find(book => book._id === id) || null;
  },

  addComment(id, comment) {
    const books = load();
    const book = books.find(b => b._id === id);
    if (!book) return null;

    book.comments.push(comment);
    save(books);
    return book;
  },

  remove(id) {
    const books = load();
    const index = books.findIndex(book => book._id === id);
    if (index === -1) return false;

    books.splice(index, 1);
    save(books);
    return true;
  },

  removeAll() {
    save([]);
    return true;
  }
};
