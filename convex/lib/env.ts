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
  return Object.fromEntries(
    keys.map((key) => [key, getEnvValue(key)])
  ) as Record<T[number], string>;
}
