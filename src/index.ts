import bip39 = require('bip39');
import {Keys} from './types';

export function keysToWords(keys: Keys): string {
  if (keys.curve !== 'ed25519') throw new Error('only ed25519 is supported');
  if (!keys.public) throw new Error('keys object is missing .public field');
  if (!keys.private) throw new Error('keys object is missing .private field');

  const pub = Buffer.from(keys.public.replace(/\.ed25519$/, ''), 'base64');
  const priv = Buffer.from(keys.private.replace(/\.ed25519$/, ''), 'base64');
  if (pub.length !== 32) throw new Error('public should be exactly 32 bytes');
  if (priv.length !== 64) throw new Error('private should be exactly 64 bytes');
  if (pub.compare(priv, 32, 64, 0, 32) !== 0) {
    throw new Error('public ed2519 key must be embedded within private key');
  }

  const part1 = priv.slice(0, 32);
  const part2 = priv.slice(32, 64);
  const words1 = bip39.entropyToMnemonic(part1);
  const words2 = bip39.entropyToMnemonic(part2);
  const words = words1 + ' ' + words2;
  return words;
}

export function wordsToKeys(words: string): Keys {
  const wordArr = words.trim().split(/\s+/g);
  const amount = wordArr.length;
  if (amount < 48) throw new Error('there should be 48 words');

  const words1 = wordArr.slice(0, 24).join(' ');
  const words2 = wordArr.slice(24, 48).join(' ');
  if (!bip39.validateMnemonic(words1)) throw new Error('invalid words part 1');
  if (!bip39.validateMnemonic(words2)) throw new Error('invalid words part 2');

  const part1 = Buffer.from(bip39.mnemonicToEntropy(words1), 'hex');
  const part2 = Buffer.from(bip39.mnemonicToEntropy(words2), 'hex');
  const priv = Buffer.concat([part1, part2]);
  const pub = part2;
  const _public = pub.toString('base64') + '.ed25519';
  const _private = priv.toString('base64') + '.ed25519';
  const keys: Keys = {
    curve: 'ed25519',
    public: _public,
    private: _private,
    id: '@' + _public,
  };
  return keys;
}
