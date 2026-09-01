const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

const A2B = 'american-to-british';
const B2A = 'british-to-american';

const semTags = texto => texto.replace(/<\/?span[^>]*>/g, '');

suite('Unit Tests', () => {
  suite('Americano para britanico', () => {
    test('1. Mangoes are my favorite fruit.', () => {
      assert.equal(
        semTags(translator.translate('Mangoes are my favorite fruit.', A2B)),
        'Mangoes are my favourite fruit.'
      );
    });

    test('2. I ate yogurt for breakfast.', () => {
      assert.equal(
        semTags(translator.translate('I ate yogurt for breakfast.', A2B)),
        'I ate yoghurt for breakfast.'
      );
    });

    test("3. We had a party at my friend's condo.", () => {
      assert.equal(
        semTags(translator.translate("We had a party at my friend's condo.", A2B)),
        "We had a party at my friend's flat."
      );
    });

    test('4. Can you toss this in the trashcan for me?', () => {
      assert.equal(
        semTags(
          translator.translate('Can you toss this in the trashcan for me?', A2B)
        ),
        'Can you toss this in the bin for me?'
      );
    });

    test('5. The parking lot was full.', () => {
      assert.equal(
        semTags(translator.translate('The parking lot was full.', A2B)),
        'The car park was full.'
      );
    });

    test('6. Like a high tech Rube Goldberg machine.', () => {
      assert.equal(
        semTags(
          translator.translate('Like a high tech Rube Goldberg machine.', A2B)
        ),
        'Like a high tech Heath Robinson device.'
      );
    });

    test('7. To play hooky means to skip class or work.', () => {
      assert.equal(
        semTags(
          translator.translate('To play hooky means to skip class or work.', A2B)
        ),
        'To bunk off means to skip class or work.'
      );
    });

    test('8. No Mr. Bond, I expect you to die.', () => {
      assert.equal(
        semTags(translator.translate('No Mr. Bond, I expect you to die.', A2B)),
        'No Mr Bond, I expect you to die.'
      );
    });

    test('9. Dr. Grosh will see you now.', () => {
      assert.equal(
        semTags(translator.translate('Dr. Grosh will see you now.', A2B)),
        'Dr Grosh will see you now.'
      );
    });

    test('10. Lunch is at 12:15 today.', () => {
      assert.equal(
        semTags(translator.translate('Lunch is at 12:15 today.', A2B)),
        'Lunch is at 12.15 today.'
      );
    });
  });

  suite('Britanico para americano', () => {
    test('11. We watched the footie match for a while.', () => {
      assert.equal(
        semTags(
          translator.translate('We watched the footie match for a while.', B2A)
        ),
        'We watched the soccer match for a while.'
      );
    });

    test('12. Paracetamol takes up to an hour to work.', () => {
      assert.equal(
        semTags(
          translator.translate('Paracetamol takes up to an hour to work.', B2A)
        ),
        'Tylenol takes up to an hour to work.'
      );
    });

    test('13. First, caramelise the onions.', () => {
      assert.equal(
        semTags(translator.translate('First, caramelise the onions.', B2A)),
        'First, caramelize the onions.'
      );
    });

    test('14. I spent the bank holiday at the funfair.', () => {
      assert.equal(
        semTags(
          translator.translate('I spent the bank holiday at the funfair.', B2A)
        ),
        'I spent the public holiday at the carnival.'
      );
    });

    test('15. I had a bicky then went to the chippy.', () => {
      assert.equal(
        semTags(
          translator.translate('I had a bicky then went to the chippy.', B2A)
        ),
        'I had a cookie then went to the fish-and-chip shop.'
      );
    });

    test("16. I've just got bits and bobs in my bum bag.", () => {
      assert.equal(
        semTags(
          translator.translate("I've just got bits and bobs in my bum bag.", B2A)
        ),
        "I've just got odds and ends in my fanny pack."
      );
    });

    test('17. The car boot sale at Boxted Airfield was called off.', () => {
      assert.equal(
        semTags(
          translator.translate(
            'The car boot sale at Boxted Airfield was called off.',
            B2A
          )
        ),
        'The swap meet at Boxted Airfield was called off.'
      );
    });

    test('18. Have you met Mrs Kalyani?', () => {
      assert.equal(
        semTags(translator.translate('Have you met Mrs Kalyani?', B2A)),
        'Have you met Mrs. Kalyani?'
      );
    });

    test("19. Prof Joyner of King's College, London.", () => {
      assert.equal(
        semTags(translator.translate("Prof Joyner of King's College, London.", B2A)),
        "Prof. Joyner of King's College, London."
      );
    });

    test('20. Tea time is usually around 4 or 4.30.', () => {
      assert.equal(
        semTags(translator.translate('Tea time is usually around 4 or 4.30.', B2A)),
        'Tea time is usually around 4 or 4:30.'
      );
    });
  });

  suite('Destaque da traducao', () => {
    test('21. destaque em Mangoes are my favorite fruit.', () => {
      assert.equal(
        translator.translate('Mangoes are my favorite fruit.', A2B),
        'Mangoes are my <span class="highlight">favourite</span> fruit.'
      );
    });

    test('22. destaque em I ate yogurt for breakfast.', () => {
      assert.equal(
        translator.translate('I ate yogurt for breakfast.', A2B),
        'I ate <span class="highlight">yoghurt</span> for breakfast.'
      );
    });

    test('23. destaque em We watched the footie match for a while.', () => {
      assert.equal(
        translator.translate('We watched the footie match for a while.', B2A),
        'We watched the <span class="highlight">soccer</span> match for a while.'
      );
    });

    test('24. destaque em Paracetamol takes up to an hour to work.', () => {
      assert.equal(
        translator.translate('Paracetamol takes up to an hour to work.', B2A),
        '<span class="highlight">Tylenol</span> takes up to an hour to work.'
      );
    });
  });
});
