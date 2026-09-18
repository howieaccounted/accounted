'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PreviousStatementsWorkspace } from '@/components/statements/PreviousStatementsWorkspace'
import { useCompanyOptional } from '@/contexts/CompanyContext'

export default function StatementsPage() {
  const company = useCompanyOptional()?.company ?? null
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams ? searchParams.toString() : ''
    router.replace(qs ? `/network/statements?${qs}` : '/network/statements')
  }, [router, searchParams])

  return (
    <Suspense fallback={null}>
      <PreviousStatementsWorkspace initialCompanyId={company?.id} />
    </Suspense>
  )
}
