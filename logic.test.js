import { describe, expect, it } from 'vitest';
import { getLineContext, pushLineToTop, readTextFile, serializeText, shouldPushLineToTop, textStats } from './logic.js';

describe('reverse stack behavior', () => {
  it('creates an empty first line and pushes the current entry down', () => {
    expect(pushLineToTop('newest')).toEqual({ text: '\nnewest', cursor: 0 });
  });
  it('preserves the entire existing stack in its original order', () => {
    expect(pushLineToTop('new thought\nold thought')).toEqual({ text: '\nnew thought\nold thought', cursor: 0 });
  });
  it('also creates a new first line for an empty document', () => {
    expect(pushLineToTop('')).toEqual({ text: '\n', cursor: 0 });
  });
  it('detects the current zero-based line index', () => {
    expect(getLineContext('top\nmiddle\nbottom', 7)).toEqual({ lineIndex: 1, lineStart: 4, lineEnd: 10 });
  });
  it('uses stack behavior only at the end of Line 1', () => {
    expect(shouldPushLineToTop('newest\nolder', 6)).toBe(true);
    expect(shouldPushLineToTop('newest\nolder', 3)).toBe(false);
  });
  it('uses normal inline splitting on every lower line', () => {
    expect(shouldPushLineToTop('newest\nolder', 12)).toBe(false);
    expect(shouldPushLineToTop('newest\nolder', 9)).toBe(false);
  });
  it('uses normal replacement behavior when text is selected', () => {
    expect(shouldPushLineToTop('newest\nolder', 2, 6)).toBe(false);
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
