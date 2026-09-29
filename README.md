# ReverseNotepad

A browser-based text editor inspired by Windows Notepad, with one important twist: pressing **Enter** creates a fresh Line 1 and pushes the current entry down. New thoughts are always typed at the top while older ones move down.

## Prerequisites

- **Node.js** `20.19+` or `22.12+` (Vite 7 will not officially support older 22.x builds such as 22.11)
- **npm** (included with Node.js)

Check versions:

```bash
node -v
npm -v
```

Install or upgrade Node from [https://nodejs.org](https://nodejs.org) if needed.

## Run locally

Clone this repository, then run commands from the **repository root** (the folder that contains `package.json`):

```bash
git clone https://github.com/alwayskkc/ReverseNotepad.git
cd ReverseNotepad
npm install
npm run dev
```

Leave that terminal open. Vite prints a local URL (usually `http://localhost:5173/`). Open it in a browser.

`npm install` uses `package-lock.json` so everyone gets the same dependency versions. `node_modules` is generated locally and is not committed.

Notes autosave in the browser's `localStorage`.

### Other scripts

```bash
npm test          # run unit tests
npm run build     # production build into dist/
```

### Common setup issues

- **`ENOENT` / could not read `package.json`** — you are not in the repo root. `cd` into the cloned `ReverseNotepad` folder (the one that contains `package.json`) and retry.
- **`ERR_CONNECTION_REFUSED` on port 5173** — the Vite process is not running. Start it with `npm run dev` and keep that terminal open.
- **`EBADENGINE` / Vite requires Node 20.19+ or 22.12+** — upgrade Node, then run `npm install` again.

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
