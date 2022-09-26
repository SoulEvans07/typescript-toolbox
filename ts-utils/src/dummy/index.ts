export function add(a: number, b: number): number {
  if (isNaN(a) || isNaN(b)) throw new NotNumberError();
  return a + b;
}

export class NotNumberError extends Error {
  name = NotNumberError.name;
}
