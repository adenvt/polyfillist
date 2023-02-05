# polyfillist

> Get list of required polyfill.io features based on browserslist

[![CI](https://github.com/adenvt/polyfillist/actions/workflows/ci.yml/badge.svg)](https://github.com/adenvt/polyfillist/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/adenvt/polyfillist/branch/main/graph/badge.svg?token=mlZkwtROwa)](https://codecov.io/gh/adenvt/polyfillist)

## Usage

### CLI Usage

Return list of required polyfill.io features

```bash
npx polyfillist
```

Generate url of polyfill.io bundle

```bash
npx polyfillist --url
```

More command, see `npx polyfillist --help`

### Programmatic Usage

```ts
import polyfillist from 'polyfillist'

const features = await polyfillist()

console.log(features)
/* [
  'AbortController',
  'ArrayBuffer.isView',
  'Blob',
  'CharacterData.prototype.after',
  'CharacterData.prototype.before',
  'CharacterData.prototype.replaceWith',
  ...
] */
```
## Contribution

- Clone this repository
- Play [this song](https://youtu.be/PDJLvF1dUek) in background (very important)
- Run deps using `yarn install`
- Write your additional feature
- Don't forget to write the test
- Open PR

## License

This project publish under MIT LIcense, see [LICENSE](/LICENSE) for more details.
