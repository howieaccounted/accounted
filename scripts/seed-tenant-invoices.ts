import { createClient } from '@supabase/supabase-js'
import { config as dotenv } from 'dotenv'
import { resolve } from 'node:path'
import {
  TENANT_A_COMPANY_ID,
  TENANT_B_COMPANY_ID,
} from '../lib/company/active-company'
import {
  TENANT_A_USER_ID,
  TENANT_B_USER_ID,
  TENANT_B_CUSTOMER_ID,
  TENANT_A_SUPPLIER_ID,
  TENANT_A_INVOICES,
  TENANT_B_SUPPLIER_INVOICES,
} from '../lib/invoices/tenant-invoices'

dotenv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

async function seed() {
  console.log('Seeding tenant invoices and supplier invoices...')

  // 1. Ensure Auth Users
  const { data: usersData } = await sb.auth.admin.listUsers()
  const users = usersData?.users || []

  let userA = users.find((u) => u.id === TENANT_A_USER_ID || u.email?.includes('companya'))
  if (!userA) {
    const { data, error } = await sb.auth.admin.createUser({
      id: TENANT_A_USER_ID,
      email: 'companya3@riminton.com',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { name: 'Howie Riminton (Company A)' },
    })
    if (error) console.log('Create userA error:', error.message)
    userA = data?.user || undefined
  }

  let userB = users.find((u) => u.id === TENANT_B_USER_ID || u.email?.includes('companyb'))
  if (!userB) {
    const { data, error } = await sb.auth.admin.createUser({
      id: TENANT_B_USER_ID,
      email: 'companyb@riminton.com',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { name: 'Johan Lindqvist (Company B)' },
    })
    if (error) console.log('Create userB error:', error.message)
    userB = data?.user || undefined
  }

  const userAId = userA?.id || TENANT_A_USER_ID
  const userBId = userB?.id || TENANT_B_USER_ID

  // 2. Ensure Companies
  const { error: compAError } = await sb.from('companies').upsert({
    id: TENANT_A_COMPANY_ID,
    name: 'Riminton AB (Company A)',
    org_number: '556000-0001',
    entity_type: 'aktiebolag',
    created_by: userAId,
  })
  if (compAError) console.log('Company A upsert error:', compAError.message)

  const { error: compBError } = await sb.from('companies').upsert({
    id: TENANT_B_COMPANY_ID,
    name: 'Nordic Logistics AB (Tenant B)',
    org_number: '556123-4567',
    entity_type: 'aktiebolag',
    created_by: userBId,
  })
  if (compBError) console.log('Company B upsert error:', compBError.message)

  // 3. Ensure Company Settings
  await sb.from('company_settings').upsert([
    {
      company_id: TENANT_A_COMPANY_ID,
      company_name: 'Riminton AB (Company A)',
      entity_type: 'aktiebolag',
      onboarding_complete: true,
      onboarding_step: 4,
      vat_registered: true,
      accounting_method: 'accrual',
      moms_period: 'monthly',
    },
    {
      company_id: TENANT_B_COMPANY_ID,
      company_name: 'Nordic Logistics AB (Tenant B)',
      entity_type: 'aktiebolag',
      onboarding_complete: true,
      onboarding_step: 4,
      vat_registered: true,
      accounting_method: 'accrual',
      moms_period: 'monthly',
    },
  ])

  // 4. Ensure Customers for Company A
  for (const inv of TENANT_A_INVOICES) {
    if (inv.customer) {
      const { error: custErr } = await sb.from('customers').upsert({
        id: inv.customer.id,
        company_id: TENANT_A_COMPANY_ID,
        user_id: userAId,
        name: inv.customer.name,
        org_number: inv.customer.org_number,
        email: inv.customer.email,
        city: inv.customer.city,
      })
      if (custErr) console.log('Customer error:', custErr.message)
    }
  }

  // 5. Ensure Supplier for Company B
  const { error: suppErr } = await sb.from('suppliers').upsert({
    id: TENANT_A_SUPPLIER_ID,
    company_id: TENANT_B_COMPANY_ID,
    user_id: userBId,
    name: 'Riminton AB (Company A)',
    org_number: '556000-0001',
    email: 'faktura@riminton.com',
    bankgiro: '5555-1234',
    supplier_type: 'swedish_business',
  })
  if (suppErr) console.log('Supplier error:', suppErr.message)

  // 6. Upsert the 10 Customer Invoices for Company A
  for (const inv of TENANT_A_INVOICES) {
    const { items, customer, ...invData } = inv
    const { error: invErr } = await sb.from('invoices').upsert({
      ...invData,
      user_id: userAId,
    })
    if (invErr) {
      console.log(`Invoice ${inv.invoice_number} error:`, invErr.message)
    } else if (items) {
      for (const itm of items) {
        const { error: itmErr } = await sb.from('invoice_items').upsert(itm)
        if (itmErr) console.log('Invoice item error:', itmErr.message)
      }
    }
  }
  console.log(`Upserted ${TENANT_A_INVOICES.length} customer invoices for Company A.`)

  // 7. Upsert the 2 Supplier Invoices for Company B
  for (const sinv of TENANT_B_SUPPLIER_INVOICES) {
    const { items, supplier, ...sinvData } = sinv
    const { error: sinvErr } = await sb.from('supplier_invoices').upsert({
      ...sinvData,
      user_id: userBId,
    })
    if (sinvErr) {
      console.log(`Supplier invoice ${sinv.supplier_invoice_number} error:`, sinvErr.message)
    } else if (items) {
      for (const itm of items) {
        const { error: itmErr } = await sb.from('supplier_invoice_items').upsert(itm)
        if (itmErr) console.log('Supplier item error:', itmErr.message)
      }
    }
  }
  console.log(`Upserted ${TENANT_B_SUPPLIER_INVOICES.length} supplier invoices for Company B.`)

  console.log('Seeding complete successfully!')
}

seed().catch(console.error)
