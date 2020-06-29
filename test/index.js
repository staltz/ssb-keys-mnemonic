const tape = require('tape');
const Mnemonic = require('../lib');
const Keys = require('ssb-keys');

tape('keys => toWords => fromWords => keys', (t) => {
  const inputKeys = Keys.generate();
  console.log('inputKeys', inputKeys, '\n');
  const words = Mnemonic.keysToWords(inputKeys);
  console.log(words, '\n');
  const outputKeys = Mnemonic.wordsToKeys(words);
  console.log('outputKeys', outputKeys, '\n');

  t.equals(inputKeys.curve, 'ed25519', 'input keys is ed25199');
  t.equals(outputKeys.curve, 'ed25519', 'output keys is ed25519');

  t.equals(outputKeys.id, inputKeys.id, 'id is the same as before');
  t.equals(outputKeys.public, inputKeys.public, 'public is the same');
  t.equals(outputKeys.private, inputKeys.private, 'private is the same');

  t.end();
});

tape('supports old mode with 48 words', (t) => {
  const words =
    'body hair useful camp warm into cause riot two bamboo kick educate ' +
    'dinosaur advice seed type crisp where guilt avocado output rely lunch ' +
    'goddess stool sausage fatigue repeat duty strike tape public celery ' +
    'dumb develop extra shed volcano glide test elegant vapor step stick ' +
    'eternal own miss pottery';

  const keys = Mnemonic.wordsToKeys(words);

  t.equals(keys.curve, 'ed25519', 'keys is ed25519');
  t.equals(
    keys.private,
    'GO0Lv5BvcuuJJdHrokHoo0PmCDC/XjO/SZ6H+ddq4UvWd/VPW1RJrjd1aCUIfPIojFXrWMb8R54vVerU2TwjdQ==.ed25519',
    'private is correct',
  );
  t.equals(
    keys.public,
    '1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519',
    'public is correct',
  );
  t.equals(
    keys.id,
    '@1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519',
    'id is correct',
  );
  t.end();
});

tape('handles error cases', (t) => {
  const tooFewWords =
    'whip stage topple design unique anxiety lizard check drive oxygen lazy ' +
    'nut lesson fatigue clean fee furnace lady paddle forest axis mercy';

  t.throws(
    () => Mnemonic.wordsToKeys(tooFewWords),
    /^Error: there should be 24 words$/,
    'detects too few words',
  );

  const tooManyWords =
    'whip stage topple design unique anxiety lizard check drive oxygen lazy ' +
    'nut lesson fatigue clean fee furnace lady paddle forest axis mercy ' +
    'game unusual pool sleep satoshi action hip issue distance fiber neither ' +
    'neutral owner lady mind fish vibrant kiwi melody initial must argue ' +
    'entire defy voyage cart donkey involve fragile crush affair cook aware ' +
    'embrace slot farm firm';

  t.throws(
    () => Mnemonic.wordsToKeys(tooManyWords),
    /^Error: there should be 24 words$/,
    'detects too many words',
  );

  const firstPartBroken =
    'yellow BAD swap suffer BAD slim lawsuit BAD letter BAD cinnamon ' +
    'maze rare BAD convince BAD trial now BAD guitar praise cake ' +
    'game unusual pool sleep satoshi action hip issue distance fiber neither ' +
    'entire defy voyage cart donkey involve fragile crush affair cook aware ' +
    'embrace slot farm firm';

  t.throws(
    () => Mnemonic.wordsToKeys(firstPartBroken),
    /^Error: invalid words$/,
    'detects first bad input',
  );

  t.end();
});
