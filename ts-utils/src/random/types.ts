export type Quartet<A, B = A, C = B, D = C> = [A, B, C, D];
export type NumberGenerator = () => number;
export type PRNGInitializer = (seed: string) => NumberGenerator;