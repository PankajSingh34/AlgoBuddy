const DEV = process.env.NODE_ENV !== "production";

export const debug = {
  log: (...args) => {
    if (DEV) console.log("[DEBUG]", ...args);
  },
  warn: (...args) => {
    if (DEV) console.warn("[DEBUG]", ...args);
  },
  error: (...args) => {
    if (DEV) console.error("[DEBUG]", ...args);
  },
  group: (label) => {
    if (DEV) console.group(`[DEBUG] ${label}`);
  },
  groupEnd: () => {
    if (DEV) console.groupEnd();
  },
  time: (label) => {
    if (DEV) console.time(`[DEBUG] ${label}`);
  },
  timeEnd: (label) => {
    if (DEV) console.timeEnd(`[DEBUG] ${label}`);
  },
  table: (data) => {
    if (DEV) console.table(data);
  },
  dir: (obj) => {
    if (DEV) console.dir(obj);
  },
};

export function measureRender(name) {
  return function (target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
      if (!DEV) return original.apply(this, args);
      const start = performance.now();
      const result = original.apply(this, args);
      const end = performance.now();
      debug.log(`${name}.${propertyKey} took ${(end - start).toFixed(2)}ms`);
      return result;
    };
    return descriptor;
  };
}

export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      debug.log(`Cache hit for ${fn.name}(${key})`);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    debug.log(`Cache miss for ${fn.name}(${key})`);
    return result;
  };
}

export function getComponentName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function whyDidYouUpdate(componentName, prevProps, nextProps) {
  if (!DEV) return;
  const changes = [];
  const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
  for (const key of allKeys) {
    if (prevProps[key] !== nextProps[key]) {
      changes.push({ key, from: prevProps[key], to: nextProps[key] });
    }
  }
  if (changes.length > 0) {
    debug.group(`${componentName} re-rendered`);
    changes.forEach(({ key, from, to }) => {
      debug.log(`  ${key}:`, from, "→", to);
    });
    debug.groupEnd();
  }
}

export function createLogger(prefix) {
  return {
    log: (...args) => debug.log(`[${prefix}]`, ...args),
    warn: (...args) => debug.warn(`[${prefix}]`, ...args),
    error: (...args) => debug.error(`[${prefix}]`, ...args),
  };
}