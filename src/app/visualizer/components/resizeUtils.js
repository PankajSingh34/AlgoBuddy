export function createDebouncedResizeHandler(callback, delay = 120) {
  let timeoutId = null;

  const handler = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      callback();
    }, delay);
  };

  handler.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return handler;
}
