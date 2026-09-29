export function pushLineToTop(text) {
  // Enter always creates a fresh Line 1. The previous contents are preserved
  // verbatim and become older entries below it, regardless of cursor position.
  return { text: `\n${text}`, cursor: 0 };
}

export function textStats(text) {
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const lines = text ? text.split('\n').length : 0;
  return { lines, words, characters: text.length };
}

export function serializeText(text) {
  return new Blob([text], { type: 'text/plain;charset=utf-8' });
}

export async function readTextFile(file) {
  if (!file || (file.type && file.type !== 'text/plain' && !file.name?.toLowerCase().endsWith('.txt'))) throw new Error('Please choose a plain text file.');
  return file.text();
}
