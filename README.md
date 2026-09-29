# ReverseNotepad

A browser-based text editor inspired by Windows Notepad, with one important twist: pressing **Enter** commits the current entry to the top of the note. New thoughts stay at line 1 while older ones move down.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite. Notes autosave in the browser's `localStorage`.

## Tests

```bash
npm test
```

## Features

- Reverse-chronological, stack-based line entry
- New, open, save, save as, and print
- Undo/redo, clipboard actions, search and replace, and F5 time/date insertion
- Word wrap, font controls, zoom, status bar, and light/dark themes
- Local autosave and UTF-8 text-file import/export
