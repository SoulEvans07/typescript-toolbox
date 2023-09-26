type PFunc<In, Out> = (val: In) => Out;

function next<In, PrevOut>(fn: PFunc<In, PrevOut>, input: In) {
  return {
    pipe: <NextOut>(nextFn: PFunc<PrevOut, NextOut>) => next(nextFn, fn(input)),
    out: () => fn(input),
  };
}

export function to<In>(val: In) {
  return {
    pipe: <Out>(fn: PFunc<In, Out>) => next(fn, val),
  };
}

const output = to(1)
  .pipe(x => x * 10)
  .pipe(x => Array(x).fill(null).join(`${x}`))
  .pipe(x => x.length)
  .out();

console.log(output);

const magic = to({ x: 10, type: 'foo' })
  .pipe(obj => obj.x)
  .pipe(x => x.toFixed(10))
  .pipe(Object.values)
  .out();
console.log(magic);
