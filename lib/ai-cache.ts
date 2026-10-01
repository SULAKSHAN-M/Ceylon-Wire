import { mkdir, readFile, rename, writeFile, readdir, stat, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

// Put this directory on a persistent volume in production. No API keys are stored.
const directory = () => resolve(/* turbopackIgnore: true */ process.env.AI_CACHE_DIR || '.data/ai-cache');
function file(key: string) {
  if (!/^[a-z0-9-]+$/.test(key)) throw new Error('Invalid cache key');
  return join(directory(), `${key}.json`);
}
export async function readAICache<T>(key: string): Promise<T | null> {
  try {
    const record = JSON.parse(await readFile(file(key), 'utf8'));
    return record.expires > Date.now() ? record.value as T : null;
  } catch { return null; }
}
let warned = false;
let lastCleanup = 0;
async function cleanCache(): Promise<void> {
  if (Date.now() - lastCleanup < 3600000) return;
  lastCleanup = Date.now();
  const names = (await readdir(directory())).filter(name => name.endsWith('.json'));
  const records = await Promise.all(names.map(async name => ({ name, modified: (await stat(join(directory(), name))).mtimeMs })));
  records.sort((a, b) => b.modified - a.modified);
  await Promise.all(records.filter((r, i) => i >= 3000 || r.modified < Date.now() - 30 * 86400000).map(r => unlink(join(directory(), r.name)).catch(() => {})));
}
export async function writeAICache(key: string, value: unknown): Promise<void> {
  try {
    await mkdir(directory(), { recursive: true });
    const target = file(key);
    const temporary = `${target}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify({ expires: Date.now() + 30 * 86400000, value }), { mode: 0o600 });
    await rename(temporary, target);
    await cleanCache().catch(() => {});
  } catch {
    if (!warned) console.warn('[ai-cache] Persistent storage unavailable; using in-memory caching. Set AI_CACHE_DIR to a writable persistent volume.');
    warned = true;
  }
}
