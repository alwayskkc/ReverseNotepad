import { describe, expect, it } from 'vitest';
import { pushLineToTop, readTextFile, serializeText, textStats } from './logic.js';

describe('reverse stack behavior', () => {
  it('moves a completed bottom line to the top', () => {
    expect(pushLineToTop('older\nnewest', 12)).toEqual({ text: 'newest\nolder', cursor: 0 });
  });
  it('keeps a top entry at the top and opens a fresh line', () => {
    expect(pushLineToTop('new thought\nold thought', 11).text).toBe('new thought\nold thought');
  });
  it('reports document statistics', () => {
    expect(textStats('hello world\nagain')).toEqual({ lines: 2, words: 3, characters: 17 });
  });
});

describe('text files', () => {
  it('serializes UTF-8 text', async () => expect(await serializeText('café').text()).toBe('café'));
  it('loads a text file', async () => expect(await readTextFile(new File(['note'], 'note.txt', { type: 'text/plain' }))).toBe('note'));
  it('rejects unsupported files', async () => expect(readTextFile(new File(['x'], 'x.png', { type: 'image/png' }))).rejects.toThrow());
});
