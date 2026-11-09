const DIGITS = /^[0-9]+$/;

/**
 * Strips hyphens and spaces from an ISBN string. We keep this separate from
 * validation so callers can normalise first and then decide what to do with
 * the result. Only ASCII hyphen-minus and space are removed; anything else is
 * left in place so validation can reject it.
 */
export function normalise(isbn) {
  if (typeof isbn !== 'string') {
    throw new TypeError('ISBN must be a string');
  }
  return isbn.replace(/[\s-]/g, '');
}

/**
 * Computes the check digit for an ISBN-10 body (the first 9 digits).
 * Returns the check digit as a string: '0'-'9' or 'X' for 10.
 * The body must be exactly 9 digits; we do not guess or pad.
 */
export function isbn10CheckDigit(body) {
  if (typeof body !== 'string' || !/^[0-9]{9}$/.test(body)) {
    throw new Error('ISBN-10 body must be exactly 9 digits');
  }
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(body[i]) * (10 - i);
  }
  const remainder = (11 - (sum % 11)) % 11;
  return remainder === 10 ? 'X' : String(remainder);
}

/**
 * Computes the check digit for an ISBN-13 body (the first 12 digits).
 * Returns a single digit as a string.
 * The alternating 1/3 weighting is fixed by the standard, so we hard-code it.
 */
export function isbn13CheckDigit(body) {
  if (typeof body !== 'string' || !/^[0-9]{12}$/.test(body)) {
    throw new Error('ISBN-13 body must be exactly 12 digits');
  }
  let sum = 0;
  for (let i = 0; i < 12; i += 1) {
    const digit = Number(body[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  return String((10 - (sum % 10)) % 10);
}

/**
 * Validates a complete ISBN-10 string. The input may contain hyphens and
 * spaces; they are removed before checking. The check digit may be 'X' or 'x'.
 * Returns true for a valid ISBN-10, false otherwise. Never throws for a
 * malformed string; only throws if the argument is not a string.
 */
export function isValidIsbn10(isbn) {
  if (typeof isbn !== 'string') {
    throw new TypeError('ISBN must be a string');
  }
  const compact = normalise(isbn);
  if (!/^[0-9]{9}[0-9Xx]$/.test(compact)) {
    return false;
  }
  const body = compact.slice(0, 9);
  const check = compact[9].toUpperCase();
  return isbn10CheckDigit(body) === check;
}

/**
 * Validates a complete ISBN-13 string. The input may contain hyphens and
 * spaces; they are removed before checking. Returns true for a valid ISBN-13,
 * false otherwise. Never throws for a malformed string; only throws if the
 * argument is not a string.
 */
export function isValidIsbn13(isbn) {
  if (typeof isbn !== 'string') {
    throw new TypeError('ISBN must be a string');
  }
  const compact = normalise(isbn);
  if (!/^[0-9]{13}$/.test(compact)) {
    return false;
  }
  const body = compact.slice(0, 12);
  const check = compact[12];
  return isbn13CheckDigit(body) === check;
}

/**
 * Validates either an ISBN-10 or an ISBN-13. This is the common entry point
 * when the caller does not know which format to expect. We deliberately do not
 * convert between formats; that is a separate concern and would make the
 * return value ambiguous.
 */
export function isValidIsbn(isbn) {
  if (typeof isbn !== 'string') {
    throw new TypeError('ISBN must be a string');
  }
  const compact = normalise(isbn);
  if (compact.length === 10) {
    return isValidIsbn10(compact);
  }
  if (compact.length === 13) {
    return isValidIsbn13(compact);
  }
  return false;
}
