'use client'

import { StatementWorkspace } from '@/components/statements/StatementWorkspace'
import { useCompanyOptional } from '@/contexts/CompanyContext'

export default function StatementsPage() {
  const company = useCompanyOptional()?.company ?? null

  return <StatementWorkspace initialCompanyId={company?.id} />
}
