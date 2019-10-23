const tape = require('tape');
const Mnemonic = require('../lib');
const Keys = require('ssb-keys');

tape('keys => toWords => fromWords => keys', t => {
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

tape('handles error cases', t => {
  const tooFewWords =
    'whip stage topple design unique anxiety lizard check drive oxygen lazy ' +
    'nut lesson fatigue clean fee furnace lady paddle forest axis mercy ' +
    'month dish column champion cram';

  t.throws(
    () => Mnemonic.wordsToKeys(tooFewWords),
    /^Error: there should be 48 words$/,
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
    /^Error: there should be 48 words$/,
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
    /^Error: invalid words part 1$/,
    'detects first part broken',
  );

  const secondPartBroken =
    'guitar chunk mosquito caution gravity kitten gown warm want shiver ' +
    'neutral owner lady mind fish vibrant kiwi melody initial must argue ' +
    'hover human detail student ordinary erode BAD wish siege put dial rail ' +
    'liquid picture BAD destroy BAD gasp weird prison have BAD endorse ' +
    'reward else essay BAD';

  t.throws(
    () => Mnemonic.wordsToKeys(secondPartBroken),
    /^Error: invalid words part 2$/,
    'detects second part broken',
  );

  t.end();
});
