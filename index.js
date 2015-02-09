'use strict'

var fs = require('fs')
var path = require('path')

var gitHashRe = /^[0-9a-f]{40}$/
var prefRe = /^([0-9a-f]{40}) (.*)$/
var refsRe = /^ref: (.*)$/

module.exports = function (root, cb) {
  if (typeof root === 'function') {
    cb = root
    root = '.git'
  }

  if (typeof cb !== 'function') throw new Error('no callback provided')

  function readText (file, icb) {
    fs.readFile(path.join(root, file), 'utf-8', function (error, data) {
      if (error) return icb(error)
      icb(null, data.trim())
    })
  }

  readText('HEAD', function (err, data) {
    if (err) return cb('invalid head')
    if (gitHashRe.test(data)) return cb(null, data)
    var ref = refsRe.exec(data)
    if (!ref || !ref.length) return cb('invalid ref')
    readText(ref[1], function (err, data) {
      if (!err) {
        if (gitHashRe.test(data)) return cb(null, data)
        return cb('invalid hash')
      }
      readText('packed-refs', function (err, data) {
        if (err) return cb('invalid git repository')
        var found = data.split('\n').some(function (line) {
          var pref = prefRe.exec(line)
          if (pref && pref.length > 2 && pref[2] === ref[1]) {
            cb(null, pref[1])
            return true
          }
        })
        if (!found) cb('invaild ref')
      })
    })
  })
}
