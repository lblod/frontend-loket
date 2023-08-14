export default function range(a, b = NaN) {
  const validationError = new Error(
    'Range helper function only takes one or two positive integers.'
  );
  if (typeof a !== 'number') throw validationError;
  if (typeof b !== 'number') throw validationError;
  if (a < 0) throw validationError;
  if (b < 0) throw validationError;
  if (!Number.isInteger(a)) throw validationError;
  if (!Number.isNaN(b) && !Number.isInteger(b)) throw validationError;

  const [start, end] = Number.isNaN(b) ? [0, a] : [a, b];
  let result = new Array(end - start);
  for (let i = 0; i < end - start; i++) {
    result[i] = i;
  }
  return result;
}
