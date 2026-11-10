# ts-isbn-check-digit

Validates and computes check digits for ISBN-10 and ISBN-13 identifiers.

```js
import {
  isValidIsbn,
  isValidIsbn10,
  isValidIsbn13,
  isbn10CheckDigit,
  isbn13CheckDigit,
  normalise,
} from './src/index.js';

isValidIsbn('0-306-40615-2'); // true
isValidIsbn('978-0-306-40615-7'); // true
isValidIsbn10('080442957X'); // true
isValidIsbn13('9780306406158'); // false

isbn10CheckDigit('030640615'); // '2'
isbn10CheckDigit('080442957'); // 'X'
isbn13CheckDigit('978030640615'); // '7'

normalise('0 306 40615 2'); // '0306406152'
```

## Why this exists

ISBN check digits are easy to get subtly wrong. The ISBN-10 algorithm weights
the first nine digits by 10 down to 2 and takes the remainder mod 11, which can
produce 10 — represented as `X`. The ISBN-13 algorithm alternates weights of 1
and 3 and takes the remainder mod 10. Both are small, but they are different
enough that a single generic "checksum" helper tends to blur them together.

This library keeps the two algorithms separate and exposes the check-digit
computation as well as the validation, so callers can generate a check digit
for a body they already have without constructing a full string first.

The trade-off: validation never silently converts between formats. An ISBN-10
is not accepted as an ISBN-13, and vice versa. Conversion requires knowing the
prefix to prepend and is a different operation; folding it into validation
would make the boolean return value carry hidden work.

## The awkward edge

The `X` check digit is valid only for ISBN-10, and only in the final position.
`isValidIsbn10('080442957x')` returns `true` because the standard treats the
check digit case-insensitively, but `isValidIsbn13('978030640615X')` returns
`false` because ISBN-13 check digits are always decimal. The functions never
throw on a malformed string — they return `false` — but they do throw a
`TypeError` if you pass something that is not a string at all, because that is
a programming error rather than a bad identifier.

Hyphens and spaces are stripped before checking, so `'0-306-40615-2'` and
`'0 306 40615 2'` are both accepted. No other characters are removed.
