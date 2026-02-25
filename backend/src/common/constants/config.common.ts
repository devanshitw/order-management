export const CONFIG = new Proxy(
  {},
  {
    get(_, key: string) {
      const val = process.env[key];

      if (['PORT', 'DB_PORT', 'BCRYPT_SALT_ROUNDS'].includes(key)) {
        return val ? Number(val) : undefined;
      }

      if (!val) {
        console.warn(`[CONFIG] ${key} is undefined!`);
      }

      return val;
    },
  },
) as Record<string, any>;
