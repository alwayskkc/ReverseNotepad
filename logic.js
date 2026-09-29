export function pushLineToTop(text, selectionStart, selectionEnd = selectionStart) {
  const start = Math.min(selectionStart, selectionEnd);
  const end = Math.max(selectionStart, selectionEnd);
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = text.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = text.length;
  const entry = text.slice(lineStart, start) + text.slice(end, lineEnd);
  const before = text.slice(0, lineStart);
  const after = text.slice(lineEnd + (lineEnd < text.length ? 1 : 0));
  const remaining = `${before}${after}`.replace(/^\n|\n$/g, '');
  return { text: `${entry}\n${remaining}`, cursor: 0 };
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
