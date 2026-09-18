'use client'

import { Suspense } from 'react'
import { NetworkTransactionsWorkspace } from '@/components/statements/NetworkTransactionsWorkspace'
import { useCompanyOptional } from '@/contexts/CompanyContext'

export default function NetworkTransactionsPage() {
  const company = useCompanyOptional()?.company ?? null

  return (
    <Suspense fallback={null}>
      <NetworkTransactionsWorkspace initialCompanyId={company?.id} />
    </Suspense>
  )
}
