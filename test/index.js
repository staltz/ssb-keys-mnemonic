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
