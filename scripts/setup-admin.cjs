const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { emitKeypressEvents } = require('node:readline');
const { hash } = require('bcryptjs');

function setValue(text, key, value) {
  const pattern = new RegExp('^[ \\t]*' + key + '[ \\t]*=.*$', 'gm');
  return pattern.test(text) ? text.replace(pattern, () => `${key}=${value}`) : text.replace(/\s*$/, '') + `\n${key}=${value}\n`;
}
function readPassword(label, input = process.stdin, output = process.stdout) {
  return new Promise((resolve, reject) => {
    const characters = [];
    const wasRaw = !!input.isRaw;
    output.write(label);
    emitKeypressEvents(input);
    function finish(error) {
      input.removeListener('keypress', onKey);
      input.removeListener('end', onEnd);
      input.setRawMode(wasRaw);
      input.pause();
      output.write('\n');
      if (error) reject(error); else resolve(characters.join(''));
    }
    function onEnd() { finish(new Error('Input closed. No settings were changed.')); }
    function onKey(value, key = {}) {
      if (key.ctrl && key.name === 'c') return finish(new Error('Cancelled. No settings were changed.'));
      if (key.name === 'return' || key.name === 'enter') return finish();
      if (key.name === 'backspace' || key.name === 'delete') {
        if (characters.length) { characters.pop(); output.write('\b \b'); }
        return;
      }
      if (key.ctrl || key.meta || (value || '').startsWith('\x1b')) return;
      const added = Array.from(value || '').filter(character => !/[\x00-\x1f\x7f]/.test(character));
      characters.push(...added);
      output.write('*'.repeat(added.length));
    }
    input.on('keypress', onKey);
    input.once('end', onEnd);
    input.setRawMode(true);
    input.resume();
  });
}
async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Run npm run admin:setup in your own interactive terminal.');
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local is missing. Restore your existing settings first.');
  const original = fs.readFileSync(envPath, 'utf8');
  require('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
  if (process.env.ADMIN_EMAIL || process.env.ADMIN_PASSWORD_HASH) throw new Error('Admin settings already exist; they have not been overwritten.');
  if (!process.env.NEXTAUTH_SECRET) throw new Error('Configure NEXTAUTH_SECRET first.');
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  try {
    const fallback = process.env.EMAIL_REPLY_TO || '';
    const email = ((await prompt.question(`Admin email${fallback ? ` [${fallback}]` : ''}: `)).trim() || fallback).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid admin email.');
    prompt.close();
    const password = await readPassword('Choose an admin password (12+ characters; * hides each character): ');
    if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) throw new Error('Use at least 12 characters and no more than 72 UTF-8 bytes.');
    const repeated = await readPassword('Repeat the password (* hides each character): ');
    if (password !== repeated) throw new Error('Passwords did not match. No file was changed.');
    const passwordHash = await hash(password, 12);
    // Next dotenv-expand needs escaped dollar signs in bcrypt hashes.
    const escapedHash = passwordHash.replace(/\$/g, '\\$');
    const updated = setValue(setValue(original, 'ADMIN_EMAIL', email), 'ADMIN_PASSWORD_HASH', escapedHash);
    if (fs.readFileSync(envPath, 'utf8') !== original) throw new Error('.env.local changed while you were typing. Retry; no settings were overwritten.');
    const backup = `${envPath}.before-admin-${Date.now()}`;
    fs.copyFileSync(envPath, backup, fs.constants.COPYFILE_EXCL);
    const temporary = `${envPath}.admin-setup.tmp`;
    fs.writeFileSync(temporary, updated, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, envPath);
    console.log(`Admin configured for ${email}. Existing LINE, email and Stripe settings were preserved.`);
    console.log('An ignored .env.local backup was saved. Restart the dev server and reopen the review link from LINE.');
  } finally { prompt.close(); }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { setValue, readPassword };
