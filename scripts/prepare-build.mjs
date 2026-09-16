#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// On Vercel build containers, restoring an oversized Turbopack cache (>1GB)
// causes Turbopack's native Rust graph indexer to bloat resident memory,
// causing a SIGKILL / Out of Memory during "Collecting page data using 1 worker".
// Purging the restored turbopack cache before build bounds total container RAM
// safely below the 8GB limit and prevents OOM kills.
if (process.env.VERCEL) {
  const cachePath = join(process.cwd(), '.next', 'cache', 'turbopack')
  if (existsSync(cachePath)) {
    console.log('[prepare-build] Clearing restored Turbopack cache to prevent container OOM...')
    try {
      rmSync(cachePath, { recursive: true, force: true })
      console.log('[prepare-build] Cleared .next/cache/turbopack successfully.')
    } catch (err) {
      console.warn('[prepare-build] Failed to clear turbopack cache:', err)
    }
  }
}
