#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// On Vercel build containers, restoring an oversized Next/Turbopack cache (>1GB)
// or stale type validators from previous builds causes container OOM and stale
// route errors during "Collecting page data using 1 worker".
// Purging the restored .next directory ensures a clean, bounded build safely
// below the container RAM limit.
if (process.env.VERCEL) {
  const nextDir = join(process.cwd(), '.next')
  if (existsSync(nextDir)) {
    console.log('[prepare-build] Clearing restored .next directory to prevent container OOM...')
    try {
      rmSync(nextDir, { recursive: true, force: true })
      console.log('[prepare-build] Cleared .next successfully.')
    } catch (err) {
      console.warn('[prepare-build] Failed to clear .next:', err)
    }
  }

  // Prune non-production directories and build artifacts from Vercel container
  // to prevent filesystem bloat and memory pressure during tracing and page collection.
  const prunePaths = [
    'dev_docs',
    'tests',
    'supabase/migrations',
    'tsconfig.tsbuildinfo',
    '.claude',
    '.agents',
    '.compliance-reports',
  ]
  for (const relPath of prunePaths) {
    const target = join(process.cwd(), relPath)
    if (existsSync(target)) {
      try {
        rmSync(target, { recursive: true, force: true })
        console.log(`[prepare-build] Pruned non-runtime path: ${relPath}`)
      } catch (err) {
        console.warn(`[prepare-build] Failed to prune ${relPath}:`, err)
      }
    }
  }
}
