/**
 * Script d'initialisation : pousse data/config.json vers Vercel KV.
 * À exécuter une seule fois après la mise en place de Vercel KV :
 *   npx tsx scripts/init-kv.ts
 */

import { kv } from '@vercel/kv'
import { readFileSync } from 'fs'
import { join } from 'path'

const CONFIG_PATH = join(process.cwd(), 'data', 'config.json')
const CONFIG_KEY = 'site-config'

async function main() {
  const raw = readFileSync(CONFIG_PATH, 'utf-8')
  const config = JSON.parse(raw)
  await kv.set(CONFIG_KEY, config)
  console.log('Config pushed to KV successfully.')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
