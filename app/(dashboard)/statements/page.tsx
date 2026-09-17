'use client'

import { Suspense } from 'react'
import { StatementWorkspace } from '@/components/statements/StatementWorkspace'
import { useCompanyOptional } from '@/contexts/CompanyContext'

export default function StatementsPage() {
  const company = useCompanyOptional()?.company ?? null

  return (
    <Suspense fallback={null}>
      <StatementWorkspace initialCompanyId={company?.id} />
    </Suspense>
  )
}
