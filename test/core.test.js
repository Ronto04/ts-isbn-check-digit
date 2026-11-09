import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalise,
  isbn10CheckDigit,
  isbn13CheckDigit,
  isValidIsbn10,
  isValidIsbn13,
  isValidIsbn,
} from '../src/index.js';

test('normalise removes hyphens and spaces', () => {
  assert.equal(normalise('0-306-40615-2'), '0306406152');
  assert.equal(normalise(' 0 306 40615 2 '), '0306406152');
  assert.equal(normalise('978-0-306-40615-7'), '9780306406157');
});

test('normalise rejects non-strings', () => {
  assert.throws(() => normalise(123), TypeError);
  assert.throws(() => normalise(null), TypeError);
});

test('isbn10CheckDigit computes known values', () => {
  assert.equal(isbn10CheckDigit('030640615'), '2');
  assert.equal(isbn10CheckDigit('080442957'), 'X');
  assert.equal(isbn10CheckDigit('013110362'), '8');
});

test('isbn10CheckDigit rejects bad bodies', () => {
  assert.throws(() => isbn10CheckDigit('03064061'), Error);
  assert.throws(() => isbn10CheckDigit('0306406152'), Error);
  assert.throws(() => isbn10CheckDigit('03064061X'), Error);
});

test('isbn13CheckDigit computes known values', () => {
  assert.equal(isbn13CheckDigit('978030640615'), '7');
  assert.equal(isbn13CheckDigit('978013110362'), '7');
  assert.equal(isbn13CheckDigit('978080442957'), '3');
});

test('isbn13CheckDigit rejects bad bodies', () => {
  assert.throws(() => isbn13CheckDigit('97803064061'), Error);
  assert.throws(() => isbn13CheckDigit('9780306406157'), Error);
  assert.throws(() => isbn13CheckDigit('97803064061X'), Error);
});

test('isValidIsbn10 accepts valid ISBN-10 with and without separators', () => {
  assert.equal(isValidIsbn10('0306406152'), true);
  assert.equal(isValidIsbn10('0-306-40615-2'), true);
  assert.equal(isValidIsbn10('0 306 40615 2'), true);
  assert.equal(isValidIsbn10('080442957X'), true);
  assert.equal(isValidIsbn10('080442957x'), true);
});

test('isValidIsbn10 rejects invalid ISBN-10', () => {
  assert.equal(isValidIsbn10('0306406153'), false);
  assert.equal(isValidIsbn10('030640615'), false);
  assert.equal(isValidIsbn10('03064061520'), false);
  assert.equal(isValidIsbn10('030640615Y'), false);
  assert.equal(isValidIsbn10(''), false);
});

test('isValidIsbn10 rejects non-string without throwing for malformed strings', () => {
  assert.throws(() => isValidIsbn10(123), TypeError);
});

test('isValidIsbn13 accepts valid ISBN-13 with and without separators', () => {
  assert.equal(isValidIsbn13('9780306406157'), true);
  assert.equal(isValidIsbn13('978-0-306-40615-7'), true);
  assert.equal(isValidIsbn13('978 0 306 40615 7'), true);
});

test('isValidIsbn13 rejects invalid ISBN-13', () => {
  assert.equal(isValidIsbn13('9780306406158'), false);
  assert.equal(isValidIsbn13('978030640615'), false);
  assert.equal(isValidIsbn13('97803064061570'), false);
  assert.equal(isValidIsbn13('978030640615X'), false);
  assert.equal(isValidIsbn13(''), false);
});

test('isValidIsbn13 rejects non-string', () => {
  assert.throws(() => isValidIsbn13(null), TypeError);
});

test('isValidIsbn dispatches on compact length', () => {
  assert.equal(isValidIsbn('0306406152'), true);
  assert.equal(isValidIsbn('9780306406157'), true);
  assert.equal(isValidIsbn('0306406153'), false);
  assert.equal(isValidIsbn('9780306406158'), false);
  assert.equal(isValidIsbn('123'), false);
  assert.equal(isValidIsbn(''), false);
});

test('isValidIsbn rejects non-string', () => {
  assert.throws(() => isValidIsbn(42), TypeError);
});
