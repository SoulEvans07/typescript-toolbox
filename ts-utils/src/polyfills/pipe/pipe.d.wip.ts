// declare namespace pipe {
//   type PFunc<In, Out> = (val: In) => Out;

//   declare function next<In, PrevOut>(fn: pipe.PFunc<In, PrevOut>, input: In) {
//     return {
//       pipe: <NextOut>(nextFn: pipe.PFunc<PrevOut, NextOut>) => next(nextFn, fn(input)),
//       out: () => fn(input),
//     };
//   };

//   declare function to<In>(val: In) {
//     return {
//       pipe: <Out>(fn: pipe.PFunc<In, Out>) => pipe.next(fn, val),
//     };
//   };
// }

// // eslint-disable-next-line prefer-const
// declare let to = pipe.to;
