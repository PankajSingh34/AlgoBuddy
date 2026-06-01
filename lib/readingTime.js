export function calculateReadingTime(text) {
  const words = text.match(/\b\w+\b/g) || [];
  return Math.ceil(words.length / 200);
}
