import bip39 = require('bip39');
import {Keys} from './types';
const chloride = require('chloride');

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

  const seed = priv.slice(0, 32);
  const words = bip39.entropyToMnemonic(seed);
  return words;
}

export function wordsToKeys(words: string): Keys {
  const wordArr = words.trim().split(/\s+/g);
  const amount = wordArr.length;
  if (amount < 24 || amount > 48) throw new Error('there should be 24 words');

  const fixedWords = wordArr.slice(0, 24).join(' ');
  if (!bip39.validateMnemonic(fixedWords)) throw new Error('invalid words');

  const seed = Buffer.from(bip39.mnemonicToEntropy(fixedWords), 'hex');
  const {publicKey, secretKey} = chloride.crypto_sign_seed_keypair(seed);
  const _public = publicKey.toString('base64') + '.ed25519';
  const _private = secretKey.toString('base64') + '.ed25519';
  const keys: Keys = {
    curve: 'ed25519',
    public: _public,
    private: _private,
    id: '@' + _public,
  };
  return keys;
}
