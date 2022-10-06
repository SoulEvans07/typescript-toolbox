const defaultCompareOptions: CompareOptions = {
  numeric: true,
  sensitivity: 'case',
  caseFirst: 'upper',
};

export function naturalCompare(a: unknown, b: unknown, options: CompareOptions = defaultCompareOptions) {
  if ((a === undefined && b === undefined) || (a === null && b === null)) {
    return 0;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  const aString = a === undefined || a === null ? '' : a.toString();
  const bString = b === undefined || b === null ? '' : b.toString();

  return aString.localeCompare(bString, undefined, options);
}
