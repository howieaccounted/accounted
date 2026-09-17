import { Suspense } from 'react'
import { StatementWorkspace } from '@/components/statements/StatementWorkspace'
import { getDashboardCompanyId } from '../request-context'

export const dynamic = 'force-dynamic'

export default async function StatementsPage() {
  const companyId = await getDashboardCompanyId()

  return (
    <Suspense fallback={null}>
      <StatementWorkspace initialCompanyId={companyId} />
    </Suspense>
  )
}
