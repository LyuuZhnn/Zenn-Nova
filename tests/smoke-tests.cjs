/* Dependency-free smoke tests for ZENN NOVA modules and core engineering calculations.
 * Run with: node tests/smoke-tests.cjs
 */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const memory = new Map([['zenn-tjkt:theme', '"light"']]);
const localStorage = {
  getItem(key) { return memory.has(key) ? memory.get(key) : null; },
  setItem(key, value) { memory.set(key, String(value)); },
  removeItem(key) { memory.delete(key); },
  key(index) { return [...memory.keys()][index] ?? null; },
  get length() { return memory.size; },
};
const document = {
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getElementById() { return null; },
  addEventListener() {},
  createElement() { return { style: {}, remove() {}, click() {}, setAttribute() {}, appendChild() {}, select() {} }; },
  documentElement: { dataset: { theme: 'dark' }, setAttribute() {} },
};
const window = { addEventListener() {}, innerWidth: 1440, location: { hash: '' }, confirm() { return true; } };
const context = vm.createContext({
  window, document, localStorage, console, Date, Math, Number, String, Array, Object, JSON, Intl,
  RegExp, Error, Set, Map, Promise, Blob, URL, XMLSerializer: function () {},
  navigator: { clipboard: { writeText: async () => {} } }, setTimeout, clearTimeout,
});
function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

// Static deployment and identity checks.
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(indexHtml.includes('<title>ZENN NOVA — Premium TJKT Digital Toolkit</title>'), 'ZENN NOVA document title');
assert(indexHtml.includes('<strong>ZENN <b>NOVA</b></strong>'), 'ZENN NOVA sidebar wordmark');
assert(!/ZENN\s+TJKT/i.test(indexHtml), 'no old visible brand in index');
const localAssetRefs = [...indexHtml.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"]+)"/g)].map(m => m[1]);
assert(localAssetRefs.length >= 15, 'local CSS/JS/favicon assets are referenced');
for (const asset of localAssetRefs) assert(fs.existsSync(path.join(root, asset)), `local asset exists: ${asset}`);
assert(indexHtml.includes('css/brand-polish.css'), 'visual polish stylesheet loaded');
function equal(actual, expected, message) {
  assert(JSON.stringify(actual) === JSON.stringify(expected),
    `${message}; received ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
}

[
  'js/storage.js', 'js/theme.js', 'js/navigation.js', 'js/search.js', 'js/calculators.js',
  'js/network-tools.js', 'js/references.js', 'js/terminal.js', 'js/topology.js',
  'js/fiber.js', 'js/quiz.js', 'js/reports.js',
].forEach(load);
// Browsers expose window properties as global bindings; mirror that binding behavior in this VM harness.
for (const name of ['Zenn','ZennTheme','ZennNav','ZennSearch','ZennCalculators','ZennNetworkTools','ZennRefs','ZennTerminal','ZennTopology','ZennFiber','ZennQuiz','ZennReports']) context[name] = window[name];
load('js/app.js');
context.ZennApp = window.ZennApp;

// LocalStorage migration: preserve old browser preferences and never delete old data.
equal(window.Zenn.store.get('theme'), 'light', 'legacy theme preference migration');
assert(memory.has('zenn-tjkt:theme') && memory.has('zenn-nova:theme'), 'legacy key kept and copied');
assert(window.Zenn.store.set('testValue', { ok: true }), 'store write');
equal(window.Zenn.store.get('testValue'), { ok: true }, 'store read/write');

const calc = window.ZennCalculators;
let r = calc.subnet('192.168.10.25', 24);
equal([r.network, r.broadcast, r.mask, r.wildcard, r.first, r.last, r.total, r.usable],
  ['192.168.10.0', '192.168.10.255', '255.255.255.0', '0.0.0.255', '192.168.10.1', '192.168.10.254', 256, 254], 'IPv4 /24');
r = calc.subnet('10.0.0.10', 31);
equal([r.network, r.broadcast, r.first, r.last, r.total, r.usable],
  ['10.0.0.10', '10.0.0.11', '10.0.0.10', '10.0.0.11', 2, 2], 'IPv4 /31');
r = calc.subnet('10.0.0.8', 32);
equal([r.network, r.broadcast, r.first, r.last, r.total, r.usable],
  ['10.0.0.8', '10.0.0.8', '10.0.0.8', '10.0.0.8', 1, 1], 'IPv4 /32');
r = calc.subnet('192.0.2.1', 0);
equal([r.network, r.broadcast, r.total, r.usable],
  ['0.0.0.0', '255.255.255.255', 4294967296, 4294967294], 'IPv4 /0');
equal(calc.prefixFromMask('255.255.254.0'), 23, 'subnet mask prefix');
let threw = false;
try { calc.prefixFromMask('255.0.255.0'); } catch { threw = true; }
assert(threw, 'reject non-contiguous subnet mask');

const vlsm = calc.allocateVlsm('192.168.10.0', 24, 'Class A: 60\nClass B: 25\n12\n6');
equal(vlsm.map(x => [x.label, x.network, x.prefix]), [
  ['Class A', '192.168.10.0', 26], ['Class B', '192.168.10.64', 27],
  ['Subnet 3', '192.168.10.96', 28], ['Subnet 4', '192.168.10.112', 29],
], 'VLSM allocation');
for (let i = 0; i < vlsm.length; i++) for (let j = i + 1; j < vlsm.length; j++) {
  assert(calc.ipv4ToInt(vlsm[i].broadcast) < calc.ipv4ToInt(vlsm[j].network) ||
    calc.ipv4ToInt(vlsm[j].broadcast) < calc.ipv4ToInt(vlsm[i].network), 'VLSM non-overlap');
}
threw = false;
try { calc.allocateVlsm('192.168.1.0', 30, '2\n2'); } catch { threw = true; }
assert(threw, 'VLSM rejects insufficient capacity');

// Safe math parser: correct basics and reject zero division or executable code.
equal(calc.safeMath('(12+8)*3'), 60, 'math grouping');
equal(calc.safeMath('sqrt(81)+2^3'), 17, 'math square root and exponent');
threw = false;
try { calc.safeMath('1/0'); } catch { threw = true; }
assert(threw, 'math division by zero');
threw = false;
try { calc.safeMath('globalThis.alert(1)'); } catch { threw = true; }
assert(threw, 'math parser allowlist');

// Render every app route without a browser DOM; catches render-time JS errors and blank templates.
const routes = ['overview', 'dashboard', 'calculators', 'network-tools', 'cisco', 'linux', 'cloud',
  'mikrotik', 'topology', 'fiber', 'learning', 'practice', 'reports', 'notes', 'about'];
for (const route of routes) {
  const html = window.ZennApp.renderPage(route);
  assert(typeof html === 'string' && html.length > 250, `render route: ${route}`);
  assert(!html.includes('undefined'), `no undefined content in route: ${route}`);
  if (route === 'linux') { assert(html.includes('id="terminalForm"') && html.includes('id="refGrid"'), 'Linux route includes simulator and reference library'); }
}
assert(calc.all().length >= 4, 'calculator catalog');
assert(window.ZennNetworkTools.all().length >= 4, 'network tools catalog');
const terminal = window.ZennTerminal;
equal(terminal.execute('pwd'), '/home/hanif', 'terminal virtual pwd');
equal(terminal.execute('mkdir labs'), '', 'terminal virtual mkdir');
equal(terminal.execute('touch labs/notes.txt'), '', 'terminal virtual touch');
equal(terminal.execute('echo saved locally > labs/notes.txt'), '', 'terminal virtual echo redirect');
equal(terminal.execute('cat labs/notes.txt'), 'saved locally', 'terminal virtual cat');
equal(terminal.execute('cd labs'), '', 'terminal virtual cd');
equal(terminal.execute('ls'), 'notes.txt', 'terminal virtual ls');
assert(terminal.execute('unknown-command').includes('tidak dikenal'), 'terminal rejects unsupported command');
const icon = window.Zenn.icon('network');
assert(icon.includes('class="icon"') && icon.includes('stroke="currentColor"') && icon.includes('fill="none"'), 'SVG icons inherit contextual color');

console.log(`PASS: ${routes.length} route templates, local assets/identity, storage migration, subnet /0-/32 edge cases, mask validation, VLSM allocation/capacity, safe-math validation, terminal virtual filesystem commands, catalogs, SVG icon inheritance.`);
