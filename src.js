import { pushLineToTop, readTextFile, serializeText, textStats } from './logic.js';

const $ = (selector) => document.querySelector(selector);
const editor = $('#editor');
const fileInput = $('#file-input');
const settings = JSON.parse(localStorage.getItem('reverseNotepad.settings') || '{}');
let fileName = 'ReverseNote.txt';
let zoom = settings.zoom || 100;
let saveTimer;

editor.value = localStorage.getItem('reverseNotepad.content') || '';
document.body.dataset.theme = settings.theme || 'light';
$('#word-wrap').checked = settings.wrap ?? true;
$('#status-toggle').checked = settings.status ?? true;
$('#font-family').value = settings.font || 'Consolas';
$('#font-size').value = String(settings.size || 16);

function applySettings() {
  editor.classList.toggle('no-wrap', !$('#word-wrap').checked);
  editor.style.fontFamily = $('#font-family').value;
  editor.style.fontSize = `${Number($('#font-size').value) * zoom / 100}px`;
  $('#status-bar').hidden = !$('#status-toggle').checked;
  $('#zoom-level').textContent = `${zoom}%`;
  localStorage.setItem('reverseNotepad.settings', JSON.stringify({ theme: document.body.dataset.theme, wrap: $('#word-wrap').checked, status: $('#status-toggle').checked, font: $('#font-family').value, size: Number($('#font-size').value), zoom }));
}

function updateStatus() {
  const stats = textStats(editor.value);
  const before = editor.value.slice(0, editor.selectionStart);
  const line = before.split('\n').length;
  const col = before.length - before.lastIndexOf('\n');
  $('#line-position').textContent = `Ln ${line}, Col ${col}`;
  $('#line-count').textContent = `${stats.lines} ${stats.lines === 1 ? 'line' : 'lines'}`;
  $('#word-count').textContent = `${stats.words} ${stats.words === 1 ? 'word' : 'words'}`;
  $('#char-count').textContent = `${stats.characters} characters`;
}

function autosave() {
  $('#dirty-mark').classList.add('visible');
  $('#save-state').textContent = 'Saving…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('reverseNotepad.content', editor.value);
    $('#dirty-mark').classList.remove('visible');
    $('#save-state').textContent = 'Saved locally';
  }, 350);
  updateStatus();
}

function download() {
  const url = URL.createObjectURL(serializeText(editor.value));
  const link = Object.assign(document.createElement('a'), { href: url, download: fileName });
  link.click(); URL.revokeObjectURL(url);
  $('#save-state').textContent = `Downloaded ${fileName}`;
}

function closeMenus() { document.querySelectorAll('.menu.open').forEach((menu) => { menu.classList.remove('open'); menu.querySelector('.menu-trigger').setAttribute('aria-expanded', 'false'); }); }

async function editCommand(command) {
  editor.focus();
  if (command === 'paste') {
    try { document.execCommand('insertText', false, await navigator.clipboard.readText()); } catch { document.execCommand('paste'); }
  } else document.execCommand(command);
  autosave();
}

const actions = {
  new: () => { if (!editor.value || confirm('Clear this note and start a new one?')) { editor.value = ''; fileName = 'ReverseNote.txt'; autosave(); editor.focus(); } },
  open: () => fileInput.click(), save: download,
  'save-as': () => { const name = prompt('File name', fileName); if (name) { fileName = name.endsWith('.txt') ? name : `${name}.txt`; download(); } },
  print: () => window.print(), undo: () => editCommand('undo'), redo: () => editCommand('redo'), cut: () => editCommand('cut'), copy: () => editCommand('copy'), paste: () => editCommand('paste'), delete: () => editCommand('delete'),
  find: () => { $('#find-dialog').showModal(); $('#find-input').focus(); },
  'select-all': () => { editor.select(); editor.focus(); },
  date: () => { editor.setRangeText(new Date().toLocaleString(), editor.selectionStart, editor.selectionEnd, 'end'); autosave(); },
  'zoom-in': () => { zoom = Math.min(200, zoom + 10); applySettings(); }, 'zoom-out': () => { zoom = Math.max(50, zoom - 10); applySettings(); }, 'zoom-reset': () => { zoom = 100; applySettings(); }
};

document.querySelectorAll('.menu-trigger').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const menu = button.parentElement; const opening = !menu.classList.contains('open'); closeMenus(); menu.classList.toggle('open', opening); button.setAttribute('aria-expanded', String(opening)); }));
document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => { actions[button.dataset.action]?.(); closeMenus(); }));
document.addEventListener('click', closeMenus);

editor.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const result = pushLineToTop(editor.value);
    editor.value = result.text;
    editor.setSelectionRange(result.cursor, result.cursor);
    autosave();
  }
});
editor.addEventListener('input', autosave);
editor.addEventListener('keyup', updateStatus);
editor.addEventListener('click', updateStatus);
fileInput.addEventListener('change', async () => { try { editor.value = await readTextFile(fileInput.files[0]); fileName = fileInput.files[0].name; autosave(); } catch (error) { alert(error.message); } finally { fileInput.value = ''; } });

['word-wrap', 'status-toggle', 'font-family', 'font-size'].forEach((id) => $(`#${id}`).addEventListener('change', applySettings));
$('#theme-toggle').addEventListener('click', () => { document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark'; applySettings(); });

function findNext() {
  const query = $('#find-input').value; if (!query) return;
  const source = $('#match-case').checked ? editor.value : editor.value.toLowerCase();
  const needle = $('#match-case').checked ? query : query.toLowerCase();
  const reverse = $('#reverse-search').checked;
  let index = reverse ? source.lastIndexOf(needle, Math.max(0, editor.selectionStart - 1)) : source.indexOf(needle, editor.selectionEnd);
  if (index < 0) index = reverse ? source.lastIndexOf(needle) : source.indexOf(needle);
  if (index < 0) { $('#find-message').textContent = 'No matches found.'; return; }
  editor.setSelectionRange(index, index + query.length); $('#find-message').textContent = ''; editor.focus();
}
$('#find-next').addEventListener('click', findNext);
$('#replace-one').addEventListener('click', () => { if (editor.selectionStart === editor.selectionEnd) findNext(); else { editor.setRangeText($('#replace-input').value, editor.selectionStart, editor.selectionEnd, 'select'); autosave(); findNext(); } });
$('#replace-all').addEventListener('click', () => { const query = $('#find-input').value; if (!query) return; const flags = $('#match-case').checked ? 'g' : 'gi'; const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const matches = editor.value.match(new RegExp(escaped, flags)) || []; editor.value = editor.value.replace(new RegExp(escaped, flags), () => $('#replace-input').value); $('#find-message').textContent = `Replaced ${matches.length} match${matches.length === 1 ? '' : 'es'}.`; autosave(); });

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (event.key === 'F5') { event.preventDefault(); actions.date(); }
  if (event.ctrlKey && ['n','o','s','p','h'].includes(key)) { event.preventDefault(); ({ n: actions.new, o: actions.open, s: actions.save, p: actions.print, h: actions.find })[key](); }
  if (event.ctrlKey && ['+','=','-','0'].includes(event.key)) { event.preventDefault(); (event.key === '-' ? actions['zoom-out'] : event.key === '0' ? actions['zoom-reset'] : actions['zoom-in'])(); }
});

applySettings(); updateStatus();
