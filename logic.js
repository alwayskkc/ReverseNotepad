export function pushLineToTop(text) {
  return { text: `\n${text}`, cursor: 0 };
}

export function getLineContext(text, cursor) {
  const position = Math.max(0, Math.min(cursor, text.length));
  const lineStart = text.lastIndexOf('\n', position - 1) + 1;
  const nextNewline = text.indexOf('\n', position);
  const lineEnd = nextNewline === -1 ? text.length : nextNewline;
  const lineIndex = text.slice(0, lineStart).split('\n').length - 1;

  return { lineIndex, lineStart, lineEnd };
}

export function moveCurrentLineToTop(text, cursor) {
  const { lineIndex, lineStart, lineEnd } = getLineContext(text, cursor);

  // The current line is already at the top.
  if (lineIndex === 0) return { text, cursor: Math.max(0, Math.min(cursor, lineEnd)) };

  const line = text.slice(lineStart, lineEnd);
  const before = text.slice(0, lineStart);
  const after = text.slice(lineEnd);

  // lineStart is immediately after the separator before this line. Remove
  // that separator along with the line, then prepend the line to the document.
  const remaining = before.slice(0, -1) + after;
  return { text: `${line}\n${remaining}`, cursor: Math.min(cursor - lineStart, line.length) };
}

export function shouldPushLineToTop(text, selectionStart, selectionEnd = selectionStart) {
  if (selectionStart !== selectionEnd) return false;

  const { lineIndex, lineEnd } = getLineContext(text, selectionStart);
  return lineIndex === 0 && selectionStart === lineEnd;
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
