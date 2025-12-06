type EnvVarKey = string;

function getEnvValue(name: EnvVarKey): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export function createEnvRecord<T extends readonly string[]>(
  keys: T
): Record<T[number], string> {
  const cache: Partial<Record<T[number], string>> = {};

  return new Proxy({} as Record<T[number], string>, {
    get(_target, prop: string) {
      if (!keys.includes(prop as T[number])) {
        return undefined;
      }
      if (!(prop in cache)) {
        cache[prop as T[number]] = getEnvValue(prop);
      }
      return cache[prop as T[number]];
    },
  });
}
