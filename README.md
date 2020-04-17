# git-head

[![CI](https://github.com/christophwitzko/git-head/workflows/CI/badge.svg?branch=master)](https://github.com/christophwitzko/git-head/actions?query=workflow%3ACI+branch%3Amaster)

## Install

    $ npm install -g git-head

## Example

```javascript
var gitHead = require('git-head')

gitHead('/path/to/.git', function (err, hash) {
  if (err) return console.log(err)
  console.log('HEAD:', hash)
})
```

## Licence

The [MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright © 2015 [Christoph Witzko](https://twitter.com/christophwitzko)
