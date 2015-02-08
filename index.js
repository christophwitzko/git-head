'use strict'

var fs = require('fs')
var path = require('path')

var gitHashRe = /^[0-9a-f]{40}$/
var refsRe = /^ref: (.*)$/

module.exports = function (root, cb) {
  if (typeof root === 'function') {
    cb = root
    root = '.git'
  }

  function readText (file, icb) {
    fs.readFile(path.join(root, file), 'utf-8', function (err, data) {
      if (err) return cb(err)
      data = data.trim()
      if (gitHashRe.test(data)) return cb(null, data)
      icb(data)
    })
  }

  readText('HEAD', function (data) {
    var ref = refsRe.exec(data)
    if (!ref || !ref.length) return cb(new Error('invalid ref'))
    readText(ref[1], function (data) {
      cb(new Error('invalid hash'))
    })
  })
}
