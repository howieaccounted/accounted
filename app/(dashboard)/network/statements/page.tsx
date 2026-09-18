'use client'

import { Suspense } from 'react'
import { PreviousStatementsWorkspace } from '@/components/statements/PreviousStatementsWorkspace'
import { useCompanyOptional } from '@/contexts/CompanyContext'

export default function PreviousStatementsPage() {
  const company = useCompanyOptional()?.company ?? null

  return (
    <Suspense fallback={null}>
      <PreviousStatementsWorkspace initialCompanyId={company?.id} />
    </Suspense>
  )
}
