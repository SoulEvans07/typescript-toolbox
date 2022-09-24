import 'reflect-metadata';

const keys = {
  retries: 'retries',
} as const;

export function retries(count: number) {
  return Reflect.metadata(keys.retries, count);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getRetries(target: Object, propertyKey: string): number | undefined {
  return Reflect.getMetadata(keys.retries, target, propertyKey);
}
