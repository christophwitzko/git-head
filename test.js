'use strict'

var exec = require('child_process').exec

var test = require('tape')

var gitHead = require('./')

var lastHash = ''

function checkout (ref, cb) {
  exec('git checkout ' + ref, function () {
    if (typeof cb === 'function') cb()
  })
}

test('get-head ref', function (t) {
  t.plan(3)
  checkout('master', function () {
    exec('git rev-parse HEAD', function (err, stdout, stderr) {
      t.error(err, 'git error')
      gitHead(function (err, hash) {
        t.error(err, 'error')
        t.equal(hash, stdout.trim(), 'hash')
        lastHash = hash
      })
    })
  })
})

test('get-head hash', function (t) {
  t.plan(2)
  checkout(lastHash, function () {
    gitHead(function (err, hash) {
      t.error(err, 'error')
      t.equal(hash, lastHash, 'hash')
      checkout('master')
    })
  })
})

test('get-head after garbage collection', function (t) {
  t.plan(2)
  exec('git gc', function () {
    gitHead(function (err, hash) {
      t.error(err, 'error')
      t.equal(hash, lastHash, 'hash')
    })
  })
})
