const PREFIX = "__njt_";
const storagePolyfill = {
  async get(key, shared) {
    const fullKey = PREFIX + (shared ? "shared:" : "private:") + key;
    const val = localStorage.getItem(fullKey);
    if (val === null) throw new Error("Key not found: " + key);
    return { key, value: val, shared: !!shared };
  },
  async set(key, value, shared) {
    const fullKey = PREFIX + (shared ? "shared:" : "private:") + key;
    localStorage.setItem(fullKey, value);
    return { key, value, shared: !!shared };
  },
  async delete(key, shared) {
    const fullKey = PREFIX + (shared ? "shared:" : "private:") + key;
    localStorage.removeItem(fullKey);
    return { key, deleted: true, shared: !!shared };
  },
  async list(prefix, shared) {
    const scope = PREFIX + (shared ? "shared:" : "private:");
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey.startsWith(scope)) {
        const shortKey = fullKey.slice(scope.length);
        if (!prefix || shortKey.startsWith(prefix)) keys.push(shortKey);
      }
    }
    return { keys, prefix: prefix || undefined, shared: !!shared };
  },
};
if (!window.storage) window.storage = storagePolyfill;
export default storagePolyfill;
