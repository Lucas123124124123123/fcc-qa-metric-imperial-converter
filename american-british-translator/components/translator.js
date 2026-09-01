const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

function reverseDict(dict) {
  return Object.entries(dict).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const HIGHLIGHT_OPEN = '<span class="highlight">';
const HIGHLIGHT_CLOSE = '</span>';

class Translator {
  getDictionary(locale) {
    if (locale === 'american-to-british') {
      return {
        ...americanOnly,
        ...americanToBritishSpelling,
        ...americanToBritishTitles
      };
    }
    return {
      ...britishOnly,
      ...reverseDict(americanToBritishSpelling),
      ...reverseDict(americanToBritishTitles)
    };
  }

  getTimePattern(locale) {
    return locale === 'american-to-british'
      ? /\d{1,2}:\d{2}/
      : /\d{1,2}\.\d{2}/;
  }

  convertTime(time, locale) {
    return locale === 'american-to-british'
      ? time.replace(':', '.')
      : time.replace('.', ':');
  }

  matchCase(original, translated) {
    if (original[0] === original[0].toUpperCase()) {
      return translated[0].toUpperCase() + translated.slice(1);
    }
    return translated;
  }

  translate(text, locale, highlight = true) {
    const dictionary = this.getDictionary(locale);

    const keys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    const alternatives = [
      this.getTimePattern(locale).source,
      ...keys.map(escapeRegExp)
    ];

    const pattern = new RegExp(
      '(?<![a-zA-Z])(?:' + alternatives.join('|') + ')(?![a-zA-Z])',
      'gi'
    );

    let changed = false;

    const translated = text.replace(pattern, match => {
      changed = true;

      let replacement;
      if (this.getTimePattern(locale).test(match)) {
        replacement = this.convertTime(match, locale);
      } else {
        replacement = this.matchCase(match, dictionary[match.toLowerCase()]);
      }

      return highlight
        ? HIGHLIGHT_OPEN + replacement + HIGHLIGHT_CLOSE
        : replacement;
    });

    if (!changed) return null;
    return translated;
  }
}

module.exports = Translator;
