# ssb-keys-mnemonic

Module that converts from/to SSB keys and [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) mnemonic codes.

```
npm install --save ssb-keys-mnemonic
```

## Usage

### keysToWords(keys: object): string

```js
const mnemonic = require('ssb-keys-mnemonic')

const keys = {
  curve: 'ed25519',
  public: '1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519',
  private: 'GO0Lv5BvcuuJJdHrokHoo0PmCDC/XjO/SZ6H+ddq4UvWd/VPW1RJrjd1aCUIfPIojFXrWMb8R54vVerU2TwjdQ==.ed25519',
  id: '@1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519'
}

const words = mnemonic.keysToWords(keys)

console.log(words)
/*

'body hair useful camp warm into cause riot two bamboo kick educate dinosaur advice seed type crisp where guilt avocado output rely lunch goddess'

*/
```

### wordsToKeys(words: string): object

```js
const mnemonic = require('ssb-keys-mnemonic')

const words = 'body hair useful camp warm into cause riot two bamboo kick educate dinosaur advice seed type crisp where guilt avocado output rely lunch goddess'

const keys = mnemonic.wordsToKeys(words)

console.log(keys)
/*

{ curve: 'ed25519',
  public: '1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519',
  private: 'GO0Lv5BvcuuJJdHrokHoo0PmCDC/XjO/SZ6H+ddq4UvWd/VPW1RJrjd1aCUIfPIojFXrWMb8R54vVerU2TwjdQ==.ed25519',
  id: '@1nf1T1tUSa43dWglCHzyKIxV61jG/EeeL1Xq1Nk8I3U=.ed25519' }

*/
```

## License

MIT
