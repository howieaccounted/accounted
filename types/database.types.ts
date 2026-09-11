export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      account_dimension_rules: {
        Row: {
          account_number: string
          company_id: string
          created_at: string
          dimension_id: string
          id: string
          is_active: boolean
          rule_type: string
          updated_at: string
          value_id: string | null
        }
        Insert: {
          account_number: string
          company_id: string
          created_at?: string
          dimension_id: string
          id?: string
          is_active?: boolean
          rule_type: string
          updated_at?: string
          value_id?: string | null
        }
        Update: {
          account_number?: string
          company_id?: string
          created_at?: string
          dimension_id?: string
          id?: string
          is_active?: boolean
          rule_type?: string
          updated_at?: string
          value_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_dimension_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_dimension_rules_dimension_id_company_id_fkey"
            columns: ["dimension_id", "company_id"]
            isOneToOne: false
            referencedRelation: "dimensions"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "account_dimension_rules_value_id_fkey"
            columns: ["value_id"]
            isOneToOne: false
            referencedRelation: "dimension_values"
            referencedColumns: ["id"]
          },
        ]
      }
      account_reconciliation_attachments: {
        Row: {
          account_key: string
          company_id: string
          created_at: string
          file_name: string
          id: string
          mime_type: string
          note: string | null
          removed_at: string | null
          removed_by: string | null
          removed_reason: string | null
          sha256: string
          size_bytes: number
          storage_bucket: string
          storage_path: string
          through_date: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          account_key: string
          company_id: string
          created_at?: string
          file_name: string
          id?: string
          mime_type: string
          note?: string | null
          removed_at?: string | null
          removed_by?: string | null
          removed_reason?: string | null
          sha256: string
          size_bytes: number
          storage_bucket: string
          storage_path: string
          through_date: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          account_key?: string
          company_id?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string
          note?: string | null
          removed_at?: string | null
          removed_by?: string | null
          removed_reason?: string | null
          sha256?: string
          size_bytes?: number
          storage_bucket?: string
          storage_path?: string
          through_date?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_reconciliation_attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      account_reconciliations: {
        Row: {
          account_key: string
          company_id: string
          created_at: string
          external_balance: number | null
          id: string
          ledger_balance: number | null
          note: string | null
          reopen_reason: string | null
          reopened_at: string | null
          reopened_by: string | null
          signed_at: string
          signed_by: string
          through_date: string
          unexplained_difference: number | null
        }
        Insert: {
          account_key: string
          company_id: string
          created_at?: string
          external_balance?: number | null
          id?: string
          ledger_balance?: number | null
          note?: string | null
          reopen_reason?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          signed_at?: string
          signed_by: string
          through_date: string
          unexplained_difference?: number | null
        }
        Update: {
          account_key?: string
          company_id?: string
          created_at?: string
          external_balance?: number | null
          id?: string
          ledger_balance?: number | null
          note?: string | null
          reopen_reason?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          signed_at?: string
          signed_by?: string
          through_date?: string
          unexplained_difference?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "account_reconciliations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      accrual_schedule_installments: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          id: string
          journal_entry_id: string | null
          last_error: string | null
          period_month: string
          posted_at: string | null
          schedule_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          id?: string
          journal_entry_id?: string | null
          last_error?: string | null
          period_month: string
          posted_at?: string | null
          schedule_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          id?: string
          journal_entry_id?: string | null
          last_error?: string | null
          period_month?: string
          posted_at?: string | null
          schedule_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accrual_schedule_installments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedule_installments_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedule_installments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "accrual_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      accrual_schedules: {
        Row: {
          balance_account: string
          company_id: string
          created_at: string
          description: string | null
          dimensions: Json
          direction: string
          id: string
          invoice_id: string | null
          invoice_item_id: string | null
          months: number
          origin_journal_entry_id: string | null
          period_end: string
          period_start: string
          posting_floor_date: string
          status: string
          supplier_invoice_id: string | null
          supplier_invoice_item_id: string | null
          target_account: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_account: string
          company_id: string
          created_at?: string
          description?: string | null
          dimensions?: Json
          direction: string
          id?: string
          invoice_id?: string | null
          invoice_item_id?: string | null
          months: number
          origin_journal_entry_id?: string | null
          period_end: string
          period_start: string
          posting_floor_date?: string
          status?: string
          supplier_invoice_id?: string | null
          supplier_invoice_item_id?: string | null
          target_account: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_account?: string
          company_id?: string
          created_at?: string
          description?: string | null
          dimensions?: Json
          direction?: string
          id?: string
          invoice_id?: string | null
          invoice_item_id?: string | null
          months?: number
          origin_journal_entry_id?: string | null
          period_end?: string
          period_start?: string
          posting_floor_date?: string
          status?: string
          supplier_invoice_id?: string | null
          supplier_invoice_item_id?: string | null
          target_account?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accrual_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedules_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedules_invoice_item_id_fkey"
            columns: ["invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedules_origin_journal_entry_id_fkey"
            columns: ["origin_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedules_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accrual_schedules_supplier_invoice_item_id_fkey"
            columns: ["supplier_invoice_item_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoice_items"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_atom_registry: {
        Row: {
          body: string | null
          body_path: string
          created_at: string
          description: string
          estimated_tokens: number
          id: string
          is_active: boolean
          mcp_exposed: boolean
          parent_atom_id: string | null
          schema_version: number
          sni_prefixes: string[]
          tier: string
          title: string
          trigger_signals: Json
          updated_at: string
          version: number
        }
        Insert: {
          body?: string | null
          body_path: string
          created_at?: string
          description: string
          estimated_tokens?: number
          id: string
          is_active?: boolean
          mcp_exposed?: boolean
          parent_atom_id?: string | null
          schema_version?: number
          sni_prefixes?: string[]
          tier: string
          title: string
          trigger_signals?: Json
          updated_at?: string
          version?: number
        }
        Update: {
          body?: string | null
          body_path?: string
          created_at?: string
          description?: string
          estimated_tokens?: number
          id?: string
          is_active?: boolean
          mcp_exposed?: boolean
          parent_atom_id?: string | null
          schema_version?: number
          sni_prefixes?: string[]
          tier?: string
          title?: string
          trigger_signals?: Json
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_atom_registry_parent_atom_id_fkey"
            columns: ["parent_atom_id"]
            isOneToOne: false
            referencedRelation: "agent_atom_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_conversations: {
        Row: {
          archived: boolean
          company_id: string
          context_ref: string | null
          created_at: string
          id: string
          intent_id: string
          last_message_at: string | null
          last_message_preview: string | null
          pinned: boolean
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          company_id: string
          context_ref?: string | null
          created_at?: string
          id?: string
          intent_id: string
          last_message_at?: string | null
          last_message_preview?: string | null
          pinned?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          company_id?: string
          context_ref?: string | null
          created_at?: string
          id?: string
          intent_id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          pinned?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memory: {
        Row: {
          company_id: string
          content: string
          created_at: string
          created_by_user_id: string | null
          id: string
          is_active: boolean
          is_pinned: boolean
          kind: string
          last_accessed_at: string | null
          relevance_score: number
          source: string
          source_ref: string | null
          superseded_by: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          kind: string
          last_accessed_at?: string | null
          relevance_score?: number
          source: string
          source_ref?: string | null
          superseded_by?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          created_by_user_id?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          kind?: string
          last_accessed_at?: string | null
          relevance_score?: number
          source?: string
          source_ref?: string | null
          superseded_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_memory_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "agent_memory"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          content: Json
          conversation_id: string
          created_at: string
          hidden: boolean
          id: string
          role: string
          tool_use_id: string | null
        }
        Insert: {
          content: Json
          conversation_id: string
          created_at?: string
          hidden?: boolean
          id?: string
          role: string
          tool_use_id?: string | null
        }
        Update: {
          content?: Json
          conversation_id?: string
          created_at?: string
          hidden?: boolean
          id?: string
          role?: string
          tool_use_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_profiles: {
        Row: {
          avatar_id: string | null
          company_id: string
          composed_at: string
          composer_model: string | null
          composer_version: number
          created_at: string
          display_name: string | null
          field_overrides: Json
          horizontal_atoms: string[]
          id: string
          intake_completed_at: string | null
          modifier_atoms: string[]
          profile_summary: string | null
          source_signals: Json
          trust_per_tool: Json
          updated_at: string
          verification_questions: string[] | null
          verified_at: string | null
          verified_by_user_id: string | null
          vertical_atoms: string[]
        }
        Insert: {
          avatar_id?: string | null
          company_id: string
          composed_at?: string
          composer_model?: string | null
          composer_version?: number
          created_at?: string
          display_name?: string | null
          field_overrides?: Json
          horizontal_atoms?: string[]
          id?: string
          intake_completed_at?: string | null
          modifier_atoms?: string[]
          profile_summary?: string | null
          source_signals?: Json
          trust_per_tool?: Json
          updated_at?: string
          verification_questions?: string[] | null
          verified_at?: string | null
          verified_by_user_id?: string | null
          vertical_atoms?: string[]
        }
        Update: {
          avatar_id?: string | null
          company_id?: string
          composed_at?: string
          composer_model?: string | null
          composer_version?: number
          created_at?: string
          display_name?: string | null
          field_overrides?: Json
          horizontal_atoms?: string[]
          id?: string
          intake_completed_at?: string | null
          modifier_atoms?: string[]
          profile_summary?: string | null
          source_signals?: Json
          trust_per_tool?: Json
          updated_at?: string
          verification_questions?: string[] | null
          verified_at?: string | null
          verified_by_user_id?: string | null
          vertical_atoms?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_rate_counters: {
        Row: {
          count: number
          updated_at: string
          user_id: string
          window_key: string
          window_kind: string
        }
        Insert: {
          count?: number
          updated_at?: string
          user_id: string
          window_key: string
          window_kind: string
        }
        Update: {
          count?: number
          updated_at?: string
          user_id?: string
          window_key?: string
          window_kind?: string
        }
        Relationships: []
      }
      agi_declarations: {
        Row: {
          company_id: string
          corrects_agi_id: string | null
          created_at: string
          employee_count: number
          id: string
          individuppgifter: Json
          is_correction: boolean
          kvittensnummer: string | null
          period_month: number
          period_year: number
          response_data: Json | null
          salary_run_id: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          tax_paid_at: string | null
          tax_payment_file_format: string | null
          tax_payment_file_generated_at: string | null
          tax_payment_journal_entry_id: string | null
          total_avgifter: number
          total_avgifter_basis: number
          total_gross: number
          total_tax: number
          updated_at: string
          user_id: string
          xml_content: string
        }
        Insert: {
          company_id: string
          corrects_agi_id?: string | null
          created_at?: string
          employee_count?: number
          id?: string
          individuppgifter: Json
          is_correction?: boolean
          kvittensnummer?: string | null
          period_month: number
          period_year: number
          response_data?: Json | null
          salary_run_id?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          tax_paid_at?: string | null
          tax_payment_file_format?: string | null
          tax_payment_file_generated_at?: string | null
          tax_payment_journal_entry_id?: string | null
          total_avgifter?: number
          total_avgifter_basis?: number
          total_gross?: number
          total_tax?: number
          updated_at?: string
          user_id: string
          xml_content: string
        }
        Update: {
          company_id?: string
          corrects_agi_id?: string | null
          created_at?: string
          employee_count?: number
          id?: string
          individuppgifter?: Json
          is_correction?: boolean
          kvittensnummer?: string | null
          period_month?: number
          period_year?: number
          response_data?: Json | null
          salary_run_id?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          tax_paid_at?: string | null
          tax_payment_file_format?: string | null
          tax_payment_file_generated_at?: string | null
          tax_payment_journal_entry_id?: string | null
          total_avgifter?: number
          total_avgifter_basis?: number
          total_gross?: number
          total_tax?: number
          updated_at?: string
          user_id?: string
          xml_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "agi_declarations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agi_declarations_corrects_agi_id_fkey"
            columns: ["corrects_agi_id"]
            isOneToOne: false
            referencedRelation: "agi_declarations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agi_declarations_salary_run_id_fkey"
            columns: ["salary_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agi_declarations_tax_payment_journal_entry_id_fkey"
            columns: ["tax_payment_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_report_profiles: {
        Row: {
          auditor_report_included: boolean
          auditor_report_required: boolean | null
          building_revenue_share_pct: number | null
          company_id: string
          created_at: string
          dividend_prudence_confirmed: boolean | null
          fiscal_period_id: string
          has_convertible_debt: boolean | null
          has_crypto_assets: boolean | null
          has_foreign_branch: boolean | null
          has_material_deferred_tax: boolean | null
          has_share_based_payments: boolean | null
          id: string
          is_in_liquidation: boolean | null
          is_parent_company: boolean | null
          is_public_limited_company: boolean | null
          k2_assessment_confirmed_at: string | null
          narrative_confirmed_at: string | null
          parent_group_size: string | null
          prepares_consolidated_accounts: boolean | null
          reporting_currency: string
          securities_traded_on_regulated_market: boolean | null
          signer_roster_confirmed_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auditor_report_included?: boolean
          auditor_report_required?: boolean | null
          building_revenue_share_pct?: number | null
          company_id: string
          created_at?: string
          dividend_prudence_confirmed?: boolean | null
          fiscal_period_id: string
          has_convertible_debt?: boolean | null
          has_crypto_assets?: boolean | null
          has_foreign_branch?: boolean | null
          has_material_deferred_tax?: boolean | null
          has_share_based_payments?: boolean | null
          id?: string
          is_in_liquidation?: boolean | null
          is_parent_company?: boolean | null
          is_public_limited_company?: boolean | null
          k2_assessment_confirmed_at?: string | null
          narrative_confirmed_at?: string | null
          parent_group_size?: string | null
          prepares_consolidated_accounts?: boolean | null
          reporting_currency?: string
          securities_traded_on_regulated_market?: boolean | null
          signer_roster_confirmed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auditor_report_included?: boolean
          auditor_report_required?: boolean | null
          building_revenue_share_pct?: number | null
          company_id?: string
          created_at?: string
          dividend_prudence_confirmed?: boolean | null
          fiscal_period_id?: string
          has_convertible_debt?: boolean | null
          has_crypto_assets?: boolean | null
          has_foreign_branch?: boolean | null
          has_material_deferred_tax?: boolean | null
          has_share_based_payments?: boolean | null
          id?: string
          is_in_liquidation?: boolean | null
          is_parent_company?: boolean | null
          is_public_limited_company?: boolean | null
          k2_assessment_confirmed_at?: string | null
          narrative_confirmed_at?: string | null
          parent_group_size?: string | null
          prepares_consolidated_accounts?: boolean | null
          reporting_currency?: string
          securities_traded_on_regulated_market?: boolean | null
          signer_roster_confirmed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annual_report_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_report_profiles_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_report_validation_runs: {
        Row: {
          artifact_hash: string | null
          company_id: string
          created_at: string
          fiscal_period_id: string
          id: string
          issues: Json
          status: string
          user_id: string | null
          validation_layer: string
          validator_version: string | null
          version_id: string
        }
        Insert: {
          artifact_hash?: string | null
          company_id: string
          created_at?: string
          fiscal_period_id: string
          id?: string
          issues?: Json
          status: string
          user_id?: string | null
          validation_layer: string
          validator_version?: string | null
          version_id: string
        }
        Update: {
          artifact_hash?: string | null
          company_id?: string
          created_at?: string
          fiscal_period_id?: string
          id?: string
          issues?: Json
          status?: string
          user_id?: string | null
          validation_layer?: string
          validator_version?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "annual_report_validation_runs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_report_validation_runs_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_report_validation_runs_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "annual_report_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_report_versions: {
        Row: {
          company_id: string
          content_hash: string
          created_at: string
          entry_point: string | null
          finalized_at: string | null
          finalized_by: string | null
          fiscal_period_id: string
          framework: string
          id: string
          ixbrl_data: Json | null
          report_data: Json
          schema_version: string
          status: string
          supersedes_version_id: string | null
          taxonomy_version: string | null
          user_id: string | null
          validation_summary: Json
          version_number: number
        }
        Insert: {
          company_id: string
          content_hash: string
          created_at?: string
          entry_point?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          fiscal_period_id: string
          framework: string
          id?: string
          ixbrl_data?: Json | null
          report_data: Json
          schema_version: string
          status?: string
          supersedes_version_id?: string | null
          taxonomy_version?: string | null
          user_id?: string | null
          validation_summary?: Json
          version_number: number
        }
        Update: {
          company_id?: string
          content_hash?: string
          created_at?: string
          entry_point?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          fiscal_period_id?: string
          framework?: string
          id?: string
          ixbrl_data?: Json | null
          report_data?: Json
          schema_version?: string
          status?: string
          supersedes_version_id?: string | null
          taxonomy_version?: string | null
          user_id?: string | null
          validation_summary?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "annual_report_versions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_report_versions_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_report_versions_supersedes_version_id_fkey"
            columns: ["supersedes_version_id"]
            isOneToOne: false
            referencedRelation: "annual_report_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          mode: string
          name: string
          previous_key_expires_at: string | null
          previous_key_hash: string | null
          previous_refresh_expires_at: string | null
          previous_refresh_token_hash: string | null
          rate_limit_rpm: number
          rate_limit_window_start: string | null
          refresh_token_hash: string | null
          request_count: number
          revoked_at: string | null
          scopes: string[] | null
          sod_acknowledged_at: string | null
          sod_acknowledged_by: string | null
          unattended_commit_limit: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          mode?: string
          name?: string
          previous_key_expires_at?: string | null
          previous_key_hash?: string | null
          previous_refresh_expires_at?: string | null
          previous_refresh_token_hash?: string | null
          rate_limit_rpm?: number
          rate_limit_window_start?: string | null
          refresh_token_hash?: string | null
          request_count?: number
          revoked_at?: string | null
          scopes?: string[] | null
          sod_acknowledged_at?: string | null
          sod_acknowledged_by?: string | null
          unattended_commit_limit?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          mode?: string
          name?: string
          previous_key_expires_at?: string | null
          previous_key_hash?: string | null
          previous_refresh_expires_at?: string | null
          previous_refresh_token_hash?: string | null
          rate_limit_rpm?: number
          rate_limit_window_start?: string | null
          refresh_token_hash?: string | null
          request_count?: number
          revoked_at?: string | null
          scopes?: string[] | null
          sod_acknowledged_at?: string | null
          sod_acknowledged_by?: string | null
          unattended_commit_limit?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      app_releases: {
        Row: {
          first_seen_at: string
          source: string
          version: string
        }
        Insert: {
          first_seen_at?: string
          source?: string
          version: string
        }
        Update: {
          first_seen_at?: string
          source?: string
          version?: string
        }
        Relationships: []
      }
      arsredovisning_narratives: {
        Row: {
          agm_date: string | null
          agm_disposition_decision: string | null
          agm_disposition_outcome: string | null
          company_id: string
          contingent_liabilities: string | null
          contingent_liabilities_confirmed: boolean
          created_at: string
          description: string | null
          fiscal_period_id: string
          id: string
          important_events: string | null
          long_term_debt_over_five_years: number | null
          long_term_debt_over_five_years_confirmed: boolean
          medelantal_anstallda_override: number | null
          parent_company_city: string | null
          parent_company_confirmed: boolean
          parent_company_name: string | null
          parent_company_org_number: string | null
          proposed_dividend: number | null
          resultatdisposition: string | null
          securities_pledged: string | null
          securities_pledged_confirmed: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agm_date?: string | null
          agm_disposition_decision?: string | null
          agm_disposition_outcome?: string | null
          company_id: string
          contingent_liabilities?: string | null
          contingent_liabilities_confirmed?: boolean
          created_at?: string
          description?: string | null
          fiscal_period_id: string
          id?: string
          important_events?: string | null
          long_term_debt_over_five_years?: number | null
          long_term_debt_over_five_years_confirmed?: boolean
          medelantal_anstallda_override?: number | null
          parent_company_city?: string | null
          parent_company_confirmed?: boolean
          parent_company_name?: string | null
          parent_company_org_number?: string | null
          proposed_dividend?: number | null
          resultatdisposition?: string | null
          securities_pledged?: string | null
          securities_pledged_confirmed?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agm_date?: string | null
          agm_disposition_decision?: string | null
          agm_disposition_outcome?: string | null
          company_id?: string
          contingent_liabilities?: string | null
          contingent_liabilities_confirmed?: boolean
          created_at?: string
          description?: string | null
          fiscal_period_id?: string
          id?: string
          important_events?: string | null
          long_term_debt_over_five_years?: number | null
          long_term_debt_over_five_years_confirmed?: boolean
          medelantal_anstallda_override?: number | null
          parent_company_city?: string | null
          parent_company_confirmed?: boolean
          parent_company_name?: string | null
          parent_company_org_number?: string | null
          proposed_dividend?: number | null
          resultatdisposition?: string | null
          securities_pledged?: string | null
          securities_pledged_confirmed?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arsredovisning_narratives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_narratives_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      arsredovisning_signature_requests: {
        Row: {
          annual_report_version_id: string | null
          bankid_signature_data: Json | null
          company_id: string
          created_at: string
          evidence_recorded_at: string | null
          evidence_recorded_by: string | null
          evidence_reference: string | null
          fiscal_period_id: string
          id: string
          role: string
          signed_at: string | null
          signer_name: string
          signer_personnummer_encrypted: string | null
          signer_personnummer_hash: string | null
          signing_method: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          annual_report_version_id?: string | null
          bankid_signature_data?: Json | null
          company_id: string
          created_at?: string
          evidence_recorded_at?: string | null
          evidence_recorded_by?: string | null
          evidence_reference?: string | null
          fiscal_period_id: string
          id?: string
          role: string
          signed_at?: string | null
          signer_name: string
          signer_personnummer_encrypted?: string | null
          signer_personnummer_hash?: string | null
          signing_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          annual_report_version_id?: string | null
          bankid_signature_data?: Json | null
          company_id?: string
          created_at?: string
          evidence_recorded_at?: string | null
          evidence_recorded_by?: string | null
          evidence_reference?: string | null
          fiscal_period_id?: string
          id?: string
          role?: string
          signed_at?: string | null
          signer_name?: string
          signer_personnummer_encrypted?: string | null
          signer_personnummer_hash?: string | null
          signing_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arsredovisning_signature_requests_annual_report_version_id_fkey"
            columns: ["annual_report_version_id"]
            isOneToOne: false
            referencedRelation: "annual_report_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_signature_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_signature_requests_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      arsredovisning_submissions: {
        Row: {
          annual_report_version_id: string | null
          archive_status: string
          avsandare_pnr_hash: string | null
          bolagsverket_url: string | null
          company_id: string
          created_at: string
          dokument_id: string | null
          entry_point: string
          environment: string
          error_message: string | null
          external_receipt: Json | null
          fiscal_period_id: string
          handling_typ: string
          id: string
          idnummer: string | null
          kontrollera_utfall: Json | null
          kontrollsumma: string | null
          registered_at: string | null
          request_key: string | null
          sha256_checksumma: string | null
          status: string
          taxonomy_version: string
          undertecknare_epost: string | null
          undertecknare_namn: string | null
          undertecknare_pnr_hash: string | null
          updated_at: string
          upload_started_at: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_report_version_id?: string | null
          archive_status?: string
          avsandare_pnr_hash?: string | null
          bolagsverket_url?: string | null
          company_id: string
          created_at?: string
          dokument_id?: string | null
          entry_point: string
          environment?: string
          error_message?: string | null
          external_receipt?: Json | null
          fiscal_period_id: string
          handling_typ?: string
          id?: string
          idnummer?: string | null
          kontrollera_utfall?: Json | null
          kontrollsumma?: string | null
          registered_at?: string | null
          request_key?: string | null
          sha256_checksumma?: string | null
          status?: string
          taxonomy_version: string
          undertecknare_epost?: string | null
          undertecknare_namn?: string | null
          undertecknare_pnr_hash?: string | null
          updated_at?: string
          upload_started_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_report_version_id?: string | null
          archive_status?: string
          avsandare_pnr_hash?: string | null
          bolagsverket_url?: string | null
          company_id?: string
          created_at?: string
          dokument_id?: string | null
          entry_point?: string
          environment?: string
          error_message?: string | null
          external_receipt?: Json | null
          fiscal_period_id?: string
          handling_typ?: string
          id?: string
          idnummer?: string | null
          kontrollera_utfall?: Json | null
          kontrollsumma?: string | null
          registered_at?: string | null
          request_key?: string | null
          sha256_checksumma?: string | null
          status?: string
          taxonomy_version?: string
          undertecknare_epost?: string | null
          undertecknare_namn?: string | null
          undertecknare_pnr_hash?: string | null
          updated_at?: string
          upload_started_at?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arsredovisning_submissions_annual_report_version_id_fkey"
            columns: ["annual_report_version_id"]
            isOneToOne: false
            referencedRelation: "annual_report_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_submissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_submissions_dokument_id_fkey"
            columns: ["dokument_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arsredovisning_submissions_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          active: boolean
          article_number: string | null
          company_id: string
          cost_price: number | null
          created_at: string
          currency: string
          ean: string | null
          housework_type: string | null
          id: string
          name: string
          name_en: string | null
          notes: string | null
          price_excl_vat: number
          revenue_account: string | null
          type: string
          unit: string
          updated_at: string
          user_id: string
          vat_rate: number
        }
        Insert: {
          active?: boolean
          article_number?: string | null
          company_id: string
          cost_price?: number | null
          created_at?: string
          currency?: string
          ean?: string | null
          housework_type?: string | null
          id?: string
          name: string
          name_en?: string | null
          notes?: string | null
          price_excl_vat?: number
          revenue_account?: string | null
          type?: string
          unit?: string
          updated_at?: string
          user_id: string
          vat_rate?: number
        }
        Update: {
          active?: boolean
          article_number?: string | null
          company_id?: string
          cost_price?: number | null
          created_at?: string
          currency?: string
          ean?: string | null
          housework_type?: string | null
          id?: string
          name?: string
          name_en?: string | null
          notes?: string | null
          price_excl_vat?: number
          revenue_account?: string | null
          type?: string
          unit?: string
          updated_at?: string
          user_id?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      assets: {
        Row: {
          acquisition_cost: number
          acquisition_date: string
          bas_accumulated_account: string
          bas_asset_account: string
          bas_expense_account: string
          category: string
          company_id: string
          created_at: string
          depreciation_method: string
          disposal_journal_entry_id: string | null
          disposal_type: string | null
          disposed_at: string | null
          disposed_proceeds: number | null
          disposed_proceeds_vat: number
          disposed_vat_treatment: string | null
          id: string
          jamkning_amount: number
          jamkning_direction: string | null
          jamkning_new_deduction_percent: number | null
          jamkning_original_deduction_percent: number | null
          jamkning_original_input_vat: number | null
          jamkning_remaining_months: number | null
          jamkning_remaining_years: number | null
          jamkning_total_months: number | null
          jamkning_total_years: number | null
          k3_components: Json | null
          name: string
          notes: string | null
          restvarde_target: number | null
          salvage_value: number
          updated_at: string
          useful_life_months: number
          user_id: string
        }
        Insert: {
          acquisition_cost: number
          acquisition_date: string
          bas_accumulated_account: string
          bas_asset_account: string
          bas_expense_account: string
          category: string
          company_id: string
          created_at?: string
          depreciation_method?: string
          disposal_journal_entry_id?: string | null
          disposal_type?: string | null
          disposed_at?: string | null
          disposed_proceeds?: number | null
          disposed_proceeds_vat?: number
          disposed_vat_treatment?: string | null
          id?: string
          jamkning_amount?: number
          jamkning_direction?: string | null
          jamkning_new_deduction_percent?: number | null
          jamkning_original_deduction_percent?: number | null
          jamkning_original_input_vat?: number | null
          jamkning_remaining_months?: number | null
          jamkning_remaining_years?: number | null
          jamkning_total_months?: number | null
          jamkning_total_years?: number | null
          k3_components?: Json | null
          name: string
          notes?: string | null
          restvarde_target?: number | null
          salvage_value?: number
          updated_at?: string
          useful_life_months: number
          user_id: string
        }
        Update: {
          acquisition_cost?: number
          acquisition_date?: string
          bas_accumulated_account?: string
          bas_asset_account?: string
          bas_expense_account?: string
          category?: string
          company_id?: string
          created_at?: string
          depreciation_method?: string
          disposal_journal_entry_id?: string | null
          disposal_type?: string | null
          disposed_at?: string | null
          disposed_proceeds?: number | null
          disposed_proceeds_vat?: number
          disposed_vat_treatment?: string | null
          id?: string
          jamkning_amount?: number
          jamkning_direction?: string | null
          jamkning_new_deduction_percent?: number | null
          jamkning_original_deduction_percent?: number | null
          jamkning_original_input_vat?: number | null
          jamkning_remaining_months?: number | null
          jamkning_remaining_years?: number | null
          jamkning_total_months?: number | null
          jamkning_total_years?: number | null
          k3_components?: Json | null
          name?: string
          notes?: string | null
          restvarde_target?: number | null
          salvage_value?: number
          updated_at?: string
          useful_life_months?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_disposal_journal_entry_id_fkey"
            columns: ["disposal_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_label: string | null
          actor_type: string | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          new_state: Json | null
          old_state: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_label?: string | null
          actor_type?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          new_state?: Json | null
          old_state?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_label?: string | null
          actor_type?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          new_state?: Json | null
          old_state?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_connections: {
        Row: {
          accounts_data: Json | null
          authorization_id: string | null
          bank_name: string | null
          company_id: string
          consent_expires: string | null
          created_at: string
          error_message: string | null
          id: string
          initial_sync_completed_at: string | null
          initial_sync_lookback_days: number | null
          initial_sync_requested_from: string | null
          initial_sync_returned_max_date: string | null
          initial_sync_returned_min_date: string | null
          last_expiry_notification_at: string | null
          last_sie_sweep: Json | null
          last_synced_at: string | null
          oauth_origin: string | null
          oauth_state: string | null
          provider: string
          psu_type: string | null
          session_id: string | null
          status: string | null
          superseded_at: string | null
          superseded_by: string | null
          sync_lease_until: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accounts_data?: Json | null
          authorization_id?: string | null
          bank_name?: string | null
          company_id: string
          consent_expires?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          initial_sync_completed_at?: string | null
          initial_sync_lookback_days?: number | null
          initial_sync_requested_from?: string | null
          initial_sync_returned_max_date?: string | null
          initial_sync_returned_min_date?: string | null
          last_expiry_notification_at?: string | null
          last_sie_sweep?: Json | null
          last_synced_at?: string | null
          oauth_origin?: string | null
          oauth_state?: string | null
          provider?: string
          psu_type?: string | null
          session_id?: string | null
          status?: string | null
          superseded_at?: string | null
          superseded_by?: string | null
          sync_lease_until?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accounts_data?: Json | null
          authorization_id?: string | null
          bank_name?: string | null
          company_id?: string
          consent_expires?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          initial_sync_completed_at?: string | null
          initial_sync_lookback_days?: number | null
          initial_sync_requested_from?: string | null
          initial_sync_returned_max_date?: string | null
          initial_sync_returned_min_date?: string | null
          last_expiry_notification_at?: string | null
          last_sie_sweep?: Json | null
          last_synced_at?: string | null
          oauth_origin?: string | null
          oauth_state?: string | null
          provider?: string
          psu_type?: string | null
          session_id?: string | null
          status?: string | null
          superseded_at?: string | null
          superseded_by?: string | null
          sync_lease_until?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_connections_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "bank_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_file_imports: {
        Row: {
          company_id: string
          created_at: string
          date_from: string | null
          date_to: string | null
          duplicate_count: number
          error_message: string | null
          file_format: string
          file_hash: string
          filename: string
          id: string
          imported_count: number
          matched_count: number
          sie_sweep: Json | null
          status: string
          transaction_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duplicate_count?: number
          error_message?: string | null
          file_format: string
          file_hash: string
          filename: string
          id?: string
          imported_count?: number
          matched_count?: number
          sie_sweep?: Json | null
          status?: string
          transaction_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duplicate_count?: number
          error_message?: string | null
          file_format?: string
          file_hash?: string
          filename?: string
          id?: string
          imported_count?: number
          matched_count?: number
          sie_sweep?: Json | null
          status?: string
          transaction_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_file_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bankid_consumed_sessions: {
        Row: {
          consumed_at: string
          session_id: string
        }
        Insert: {
          consumed_at?: string
          session_id: string
        }
        Update: {
          consumed_at?: string
          session_id?: string
        }
        Relationships: []
      }
      bankid_enrichment: {
        Row: {
          company_roles: Json
          created_at: string
          enriched_at_utc: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_roles?: Json
          created_at?: string
          enriched_at_utc?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_roles?: Json
          created_at?: string
          enriched_at_utc?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bankid_identities: {
        Row: {
          created_at: string
          email_verified_at: string | null
          given_name: string | null
          id: string
          linked_at: string
          personal_number_enc: string
          personal_number_hash: string
          surname: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_verified_at?: string | null
          given_name?: string | null
          id?: string
          linked_at?: string
          personal_number_enc: string
          personal_number_hash: string
          surname?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_verified_at?: string | null
          given_name?: string | null
          id?: string
          linked_at?: string
          personal_number_enc?: string
          personal_number_hash?: string
          surname?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bokslut_checklist_items: {
        Row: {
          company_id: string
          created_at: string
          done_at: string | null
          done_by: string | null
          fiscal_period_id: string
          item_key: string
          note: string | null
          state: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          company_id: string
          created_at?: string
          done_at?: string | null
          done_by?: string | null
          fiscal_period_id: string
          item_key: string
          note?: string | null
          state: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          company_id?: string
          created_at?: string
          done_at?: string | null
          done_by?: string | null
          fiscal_period_id?: string
          item_key?: string
          note?: string | null
          state?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "bokslut_checklist_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bokslut_checklist_items_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      bolagsverket_avtal_acceptances: {
        Row: {
          accepted_at: string
          avtalstext_andrad: string
          company_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string
          avtalstext_andrad: string
          company_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string
          avtalstext_andrad?: string
          company_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bolagsverket_avtal_acceptances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bolagsverket_subscriptions: {
        Row: {
          auth_secret: string
          company_id: string
          created_at: string
          environment: string
          expires_at: string
          id: string
          orgnr: string
          subscribed_at: string
          updated_at: string
          url: string
          user_id: string | null
        }
        Insert: {
          auth_secret: string
          company_id: string
          created_at?: string
          environment?: string
          expires_at: string
          id?: string
          orgnr: string
          subscribed_at?: string
          updated_at?: string
          url: string
          user_id?: string | null
        }
        Update: {
          auth_secret?: string
          company_id?: string
          created_at?: string
          environment?: string
          expires_at?: string
          id?: string
          orgnr?: string
          subscribed_at?: string
          updated_at?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bolagsverket_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_template_embeddings: {
        Row: {
          created_at: string
          embedding: string
          embedding_text: string
          id: string
          model: string
          schema_version: string
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          embedding: string
          embedding_text: string
          id?: string
          model: string
          schema_version: string
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          embedding?: string
          embedding_text?: string
          id?: string
          model?: string
          schema_version?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_template_hidden: {
        Row: {
          company_id: string
          created_at: string
          hidden_by: string | null
          id: string
          template_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          hidden_by?: string | null
          id?: string
          template_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          hidden_by?: string | null
          id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_template_hidden_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_template_hidden_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "booking_template_library"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_template_library: {
        Row: {
          category: string
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string
          entity_type: string
          id: string
          is_active: boolean
          is_system: boolean
          lines: Json
          name: string
          pack_slug: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          entity_type?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          lines?: Json
          name: string
          pack_slug?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          entity_type?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          lines?: Json
          name?: string
          pack_slug?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_template_library_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_template_library_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_template_usage: {
        Row: {
          company_id: string
          created_at: string
          id: string
          last_used_at: string
          template_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          last_used_at?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          last_used_at?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_template_usage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_template_usage_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "booking_template_library"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_signup_allowlist: {
        Row: {
          brand_id: string
          created_at: string
          created_by: string | null
          email: string
          id: string
          note: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          note?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_signup_allowlist_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          app_name: string
          auth_email_from: string | null
          brand_color: string
          chrome_color: string | null
          created_at: string
          domain: string
          favicon_url: string | null
          font_key: string
          id: string
          logo_url: string | null
          resend_domain_id: string | null
          sender_domain: string | null
          sender_domain_status: string
          signup_mode: string
          support_email: string
          team_id: string
          updated_at: string
        }
        Insert: {
          app_name: string
          auth_email_from?: string | null
          brand_color: string
          chrome_color?: string | null
          created_at?: string
          domain: string
          favicon_url?: string | null
          font_key?: string
          id?: string
          logo_url?: string | null
          resend_domain_id?: string | null
          sender_domain?: string | null
          sender_domain_status?: string
          signup_mode?: string
          support_email: string
          team_id: string
          updated_at?: string
        }
        Update: {
          app_name?: string
          auth_email_from?: string | null
          brand_color?: string
          chrome_color?: string | null
          created_at?: string
          domain?: string
          favicon_url?: string | null
          font_key?: string
          id?: string
          logo_url?: string | null
          resend_domain_id?: string | null
          sender_domain?: string | null
          sender_domain_status?: string
          signup_mode?: string
          support_email?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: true
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_feeds: {
        Row: {
          access_count: number | null
          company_id: string
          created_at: string
          expires_at: string | null
          feed_token: string
          id: string
          include_invoices: boolean | null
          include_tax_deadlines: boolean | null
          is_active: boolean | null
          last_accessed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number | null
          company_id: string
          created_at?: string
          expires_at?: string | null
          feed_token?: string
          id?: string
          include_invoices?: boolean | null
          include_tax_deadlines?: boolean | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number | null
          company_id?: string
          created_at?: string
          expires_at?: string | null
          feed_token?: string
          id?: string
          include_invoices?: boolean | null
          include_tax_deadlines?: boolean | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_feeds_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      capability_grants: {
        Row: {
          capability_key: string
          company_id: string | null
          created_at: string
          expires_at: string | null
          granted_at: string
          id: string
          metadata: Json
          source: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          capability_key: string
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          metadata?: Json
          source: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          capability_key?: string
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          metadata?: Json
          source?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capability_grants_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capability_grants_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_accounts: {
        Row: {
          account_number: string | null
          available_balance: number | null
          balance: number | null
          balance_updated_at: string | null
          bank_code: string | null
          bank_connection_id: string | null
          bank_name: string | null
          bankgiro: string | null
          bban: string | null
          bic: string | null
          clearing_number: string | null
          company_id: string
          created_at: string
          currency: string
          enabled: boolean
          external_uid: string | null
          foreign_account_number: string | null
          iban: string | null
          id: string
          invoice_payee: boolean
          is_primary: boolean
          ledger_account: string
          name: string | null
          payee_iban: string | null
          plusgiro: string | null
          source: string
          swish: string | null
          updated_at: string
          voucher_series: string | null
        }
        Insert: {
          account_number?: string | null
          available_balance?: number | null
          balance?: number | null
          balance_updated_at?: string | null
          bank_code?: string | null
          bank_connection_id?: string | null
          bank_name?: string | null
          bankgiro?: string | null
          bban?: string | null
          bic?: string | null
          clearing_number?: string | null
          company_id: string
          created_at?: string
          currency: string
          enabled?: boolean
          external_uid?: string | null
          foreign_account_number?: string | null
          iban?: string | null
          id?: string
          invoice_payee?: boolean
          is_primary?: boolean
          ledger_account: string
          name?: string | null
          payee_iban?: string | null
          plusgiro?: string | null
          source?: string
          swish?: string | null
          updated_at?: string
          voucher_series?: string | null
        }
        Update: {
          account_number?: string | null
          available_balance?: number | null
          balance?: number | null
          balance_updated_at?: string | null
          bank_code?: string | null
          bank_connection_id?: string | null
          bank_name?: string | null
          bankgiro?: string | null
          bban?: string | null
          bic?: string | null
          clearing_number?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          enabled?: boolean
          external_uid?: string | null
          foreign_account_number?: string | null
          iban?: string | null
          id?: string
          invoice_payee?: boolean
          is_primary?: boolean
          ledger_account?: string
          name?: string | null
          payee_iban?: string | null
          plusgiro?: string | null
          source?: string
          swish?: string | null
          updated_at?: string
          voucher_series?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_accounts_bank_connection_id_fkey"
            columns: ["bank_connection_id"]
            isOneToOne: false
            referencedRelation: "bank_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categorization_templates: {
        Row: {
          category: string | null
          company_id: string
          confidence: number
          corrections: number
          counterparty_aliases: string[]
          counterparty_name: string
          created_at: string
          credit_account: string
          debit_account: string
          default_dimensions: Json
          id: string
          is_active: boolean
          last_seen_date: string | null
          line_pattern: Json | null
          mode: string
          occurrence_count: number
          paused_at: string | null
          source: string
          updated_at: string
          user_id: string | null
          vat_account: string | null
          vat_treatment: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          confidence?: number
          corrections?: number
          counterparty_aliases?: string[]
          counterparty_name: string
          created_at?: string
          credit_account: string
          debit_account: string
          default_dimensions?: Json
          id?: string
          is_active?: boolean
          last_seen_date?: string | null
          line_pattern?: Json | null
          mode?: string
          occurrence_count?: number
          paused_at?: string | null
          source?: string
          updated_at?: string
          user_id?: string | null
          vat_account?: string | null
          vat_treatment?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          confidence?: number
          corrections?: number
          counterparty_aliases?: string[]
          counterparty_name?: string
          created_at?: string
          credit_account?: string
          debit_account?: string
          default_dimensions?: Json
          id?: string
          is_active?: boolean
          last_seen_date?: string | null
          line_pattern?: Json | null
          mode?: string
          occurrence_count?: number
          paused_at?: string | null
          source?: string
          updated_at?: string
          user_id?: string | null
          vat_account?: string | null
          vat_treatment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorization_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categorize_calibration_samples: {
        Row: {
          agreement: number | null
          amount: number | null
          booked_account: string
          company_id: string
          confidence: number
          created_at: string
          id: string
          model_confidence: string | null
          proposed_account: string | null
          source: string | null
          was_correct: boolean
        }
        Insert: {
          agreement?: number | null
          amount?: number | null
          booked_account: string
          company_id: string
          confidence: number
          created_at?: string
          id?: string
          model_confidence?: string | null
          proposed_account?: string | null
          source?: string | null
          was_correct: boolean
        }
        Update: {
          agreement?: number | null
          amount?: number | null
          booked_account?: string
          company_id?: string
          confidence?: number
          created_at?: string
          id?: string
          model_confidence?: string | null
          proposed_account?: string | null
          source?: string | null
          was_correct?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "categorize_calibration_samples_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          account_class: number
          account_group: string | null
          account_name: string
          account_number: string
          account_type: string
          company_id: string
          created_at: string
          default_vat_code: string | null
          default_vat_rate: number | null
          default_vat_treatment: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_account: boolean | null
          k2_excluded: boolean | null
          normal_balance: string
          plan_type: string | null
          sort_order: number | null
          sru_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_class: number
          account_group?: string | null
          account_name: string
          account_number: string
          account_type: string
          company_id: string
          created_at?: string
          default_vat_code?: string | null
          default_vat_rate?: number | null
          default_vat_treatment?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_account?: boolean | null
          k2_excluded?: boolean | null
          normal_balance: string
          plan_type?: string | null
          sort_order?: number | null
          sru_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_class?: number
          account_group?: string | null
          account_name?: string
          account_number?: string
          account_type?: string
          company_id?: string
          created_at?: string
          default_vat_code?: string | null
          default_vat_rate?: number | null
          default_vat_treatment?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_account?: boolean | null
          k2_excluded?: boolean | null
          normal_balance?: string
          plan_type?: string | null
          sort_order?: number | null
          sru_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          artifact: Json | null
          company_id: string
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          sources: Json | null
          user_id: string
        }
        Insert: {
          artifact?: Json | null
          company_id: string
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          sources?: Json | null
          user_id: string
        }
        Update: {
          artifact?: Json | null
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          sources?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          company_id: string
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          accounting_framework: string
          archived_at: string | null
          archived_by: string | null
          created_at: string
          created_by: string
          entity_type: string
          id: string
          name: string
          org_number: string | null
          team_id: string | null
          tic_snapshot: Json | null
          tic_snapshot_fetched_at: string | null
          updated_at: string
        }
        Insert: {
          accounting_framework?: string
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          created_by: string
          entity_type: string
          id?: string
          name: string
          org_number?: string | null
          team_id?: string | null
          tic_snapshot?: Json | null
          tic_snapshot_fetched_at?: string | null
          updated_at?: string
        }
        Update: {
          accounting_framework?: string
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          created_by?: string
          entity_type?: string
          id?: string
          name?: string
          org_number?: string | null
          team_id?: string | null
          tic_snapshot?: Json | null
          tic_snapshot_fetched_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      company_capability_config: {
        Row: {
          capability_key: string
          company_id: string
          created_at: string
          enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          capability_key: string
          company_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          capability_key?: string
          company_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_capability_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_inbound_domains: {
        Row: {
          company_id: string
          created_at: string
          dns_records: Json | null
          domain: string
          id: string
          last_checked_at: string | null
          resend_domain_id: string | null
          status: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          dns_records?: Json | null
          domain: string
          id?: string
          last_checked_at?: string | null
          resend_domain_id?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          dns_records?: Json | null
          domain?: string
          id?: string
          last_checked_at?: string | null
          resend_domain_id?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_inbound_domains_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_inboxes: {
        Row: {
          company_id: string
          created_at: string
          deprecated_at: string | null
          id: string
          local_part: string
          slug_seed: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          deprecated_at?: string | null
          id?: string
          local_part: string
          slug_seed: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          deprecated_at?: string | null
          id?: string
          local_part?: string
          slug_seed?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_inboxes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_invitations: {
        Row: {
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: string
          status: string
          token_hash: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          role?: string
          status?: string
          token_hash: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: string
          status?: string
          token_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string
          role: string
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          source?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: string
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_migration_resets: {
        Row: {
          actor_id: string | null
          confirmation_snapshot: Json
          created_at: string
          id: string
          reason: string
          replacement_company_id: string
          source_company_id: string
          source_counts: Json
        }
        Insert: {
          actor_id?: string | null
          confirmation_snapshot: Json
          created_at?: string
          id?: string
          reason: string
          replacement_company_id: string
          source_company_id: string
          source_counts: Json
        }
        Update: {
          actor_id?: string | null
          confirmation_snapshot?: Json
          created_at?: string
          id?: string
          reason?: string
          replacement_company_id?: string
          source_company_id?: string
          source_counts?: Json
        }
        Relationships: [
          {
            foreignKeyName: "company_migration_resets_replacement_company_id_fkey"
            columns: ["replacement_company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_migration_resets_source_company_id_fkey"
            columns: ["source_company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_sending_domains: {
        Row: {
          company_id: string
          created_at: string
          dns_records: Json | null
          domain: string
          enabled: boolean
          id: string
          last_checked_at: string | null
          resend_domain_id: string | null
          sender_local_part: string
          sender_name: string | null
          status: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          dns_records?: Json | null
          domain: string
          enabled?: boolean
          id?: string
          last_checked_at?: string | null
          resend_domain_id?: string | null
          sender_local_part?: string
          sender_name?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          dns_records?: Json | null
          domain?: string
          enabled?: boolean
          id?: string
          last_checked_at?: string | null
          resend_domain_id?: string | null
          sender_local_part?: string
          sender_name?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_sending_domains_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          account_number: string | null
          accounting_method: string
          address_line1: string | null
          address_line2: string | null
          aktiekapital: number | null
          antal_aktier: number | null
          auto_lock_period_days: number | null
          bank_name: string | null
          bankgiro: string | null
          bic: string | null
          bookkeeping_locked_through: string | null
          city: string | null
          clearing_number: string | null
          company_id: string
          company_name: string | null
          country: string | null
          created_at: string
          data_analysis_opt_in: boolean
          default_our_reference: string | null
          default_voucher_series: string
          default_voucher_series_per_source_type: Json
          defer_invoice_booking: boolean
          dimensions_enabled: boolean
          email: string | null
          employer_registered: boolean | null
          employer_seasonal: boolean
          entity_type: string | null
          f_skatt: boolean | null
          fiscal_year_start_month: number | null
          fyllnadsinbetalning_enabled: boolean
          iban: string | null
          id: string
          initial_setup_completed_at: string | null
          initial_setup_dismissed_at: string | null
          initial_setup_path: string | null
          intrastat_enabled: boolean
          invoice_accent_color: string
          invoice_company_name_position: string
          invoice_credit_terms_text: string | null
          invoice_custom_font_name: string | null
          invoice_custom_font_path: string | null
          invoice_default_days: number | null
          invoice_default_notes: string | null
          invoice_email_bcc_addresses: string[] | null
          invoice_email_cc_addresses: string[] | null
          invoice_email_texts: Json | null
          invoice_font_family: string
          invoice_footer_text: string | null
          invoice_header_text: string | null
          invoice_late_fee_text: string | null
          invoice_payment_accounts: Json
          invoice_payment_links_enabled: boolean
          invoice_prefix: string | null
          invoice_primary_color: string
          invoice_show_bankgiro: boolean | null
          invoice_show_company_name: boolean | null
          invoice_show_logo: boolean | null
          invoice_show_ocr: boolean | null
          invoice_show_plusgiro: boolean | null
          invoice_show_swish: boolean | null
          ioss_enabled: boolean
          is_sandbox: boolean
          kontrolluppgifter_enabled: boolean
          last_supplier_payment_account: string | null
          logo_url: string | null
          mileage_enabled: boolean
          moms_period: string | null
          next_arrival_number: number
          next_article_number: number
          next_delivery_note_number: number | null
          next_invoice_number: number | null
          next_quote_number: number
          next_sales_order_number: number
          onboarding_complete: boolean | null
          onboarding_step: number
          ore_rounding: boolean | null
          org_number: string | null
          oss_enabled: boolean
          pays_salaries: boolean
          periodisk_sammanstallning_enabled: boolean
          periodisk_sammanstallning_filing_method: string
          periodisk_sammanstallning_period: string
          phone: string | null
          plusgiro: string | null
          postal_code: string | null
          preferred_payment_format: string
          preliminary_tax_monthly: number | null
          punktskatt_enabled: boolean
          reminder_days_level_1: number
          reminder_days_level_2: number
          reminder_days_level_3: number
          reminder_fee_amount: number
          reminder_fee_enabled: boolean
          reminder_interest_rate_override: number | null
          reminder_text_overrides: Json | null
          rot_rut_enabled: boolean
          salary_default_bank: string | null
          salary_net_rounding: boolean
          salary_pay_day: number
          salary_vacation_year_basis: string
          sales_orders_enabled: boolean
          schablon_mileage_rate: number | null
          sector_slug: string | null
          send_invoice_reminders: boolean | null
          swish: string | null
          tax_contact_email: string | null
          tax_contact_name: string | null
          tax_contact_phone: string | null
          tax_turnover_over_40m: boolean
          updated_at: string
          user_id: string | null
          vat_filing_method: string
          vat_has_eu_trade: boolean
          vat_number: string | null
          vat_registered: boolean | null
          vat_taxable_base_over_40m: boolean
          voucher_series_labels: Json
          website: string | null
        }
        Insert: {
          account_number?: string | null
          accounting_method?: string
          address_line1?: string | null
          address_line2?: string | null
          aktiekapital?: number | null
          antal_aktier?: number | null
          auto_lock_period_days?: number | null
          bank_name?: string | null
          bankgiro?: string | null
          bic?: string | null
          bookkeeping_locked_through?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id: string
          company_name?: string | null
          country?: string | null
          created_at?: string
          data_analysis_opt_in?: boolean
          default_our_reference?: string | null
          default_voucher_series?: string
          default_voucher_series_per_source_type?: Json
          defer_invoice_booking?: boolean
          dimensions_enabled?: boolean
          email?: string | null
          employer_registered?: boolean | null
          employer_seasonal?: boolean
          entity_type?: string | null
          f_skatt?: boolean | null
          fiscal_year_start_month?: number | null
          fyllnadsinbetalning_enabled?: boolean
          iban?: string | null
          id?: string
          initial_setup_completed_at?: string | null
          initial_setup_dismissed_at?: string | null
          initial_setup_path?: string | null
          intrastat_enabled?: boolean
          invoice_accent_color?: string
          invoice_company_name_position?: string
          invoice_credit_terms_text?: string | null
          invoice_custom_font_name?: string | null
          invoice_custom_font_path?: string | null
          invoice_default_days?: number | null
          invoice_default_notes?: string | null
          invoice_email_bcc_addresses?: string[] | null
          invoice_email_cc_addresses?: string[] | null
          invoice_email_texts?: Json | null
          invoice_font_family?: string
          invoice_footer_text?: string | null
          invoice_header_text?: string | null
          invoice_late_fee_text?: string | null
          invoice_payment_accounts?: Json
          invoice_payment_links_enabled?: boolean
          invoice_prefix?: string | null
          invoice_primary_color?: string
          invoice_show_bankgiro?: boolean | null
          invoice_show_company_name?: boolean | null
          invoice_show_logo?: boolean | null
          invoice_show_ocr?: boolean | null
          invoice_show_plusgiro?: boolean | null
          invoice_show_swish?: boolean | null
          ioss_enabled?: boolean
          is_sandbox?: boolean
          kontrolluppgifter_enabled?: boolean
          last_supplier_payment_account?: string | null
          logo_url?: string | null
          mileage_enabled?: boolean
          moms_period?: string | null
          next_arrival_number?: number
          next_article_number?: number
          next_delivery_note_number?: number | null
          next_invoice_number?: number | null
          next_quote_number?: number
          next_sales_order_number?: number
          onboarding_complete?: boolean | null
          onboarding_step?: number
          ore_rounding?: boolean | null
          org_number?: string | null
          oss_enabled?: boolean
          pays_salaries?: boolean
          periodisk_sammanstallning_enabled?: boolean
          periodisk_sammanstallning_filing_method?: string
          periodisk_sammanstallning_period?: string
          phone?: string | null
          plusgiro?: string | null
          postal_code?: string | null
          preferred_payment_format?: string
          preliminary_tax_monthly?: number | null
          punktskatt_enabled?: boolean
          reminder_days_level_1?: number
          reminder_days_level_2?: number
          reminder_days_level_3?: number
          reminder_fee_amount?: number
          reminder_fee_enabled?: boolean
          reminder_interest_rate_override?: number | null
          reminder_text_overrides?: Json | null
          rot_rut_enabled?: boolean
          salary_default_bank?: string | null
          salary_net_rounding?: boolean
          salary_pay_day?: number
          salary_vacation_year_basis?: string
          sales_orders_enabled?: boolean
          schablon_mileage_rate?: number | null
          sector_slug?: string | null
          send_invoice_reminders?: boolean | null
          swish?: string | null
          tax_contact_email?: string | null
          tax_contact_name?: string | null
          tax_contact_phone?: string | null
          tax_turnover_over_40m?: boolean
          updated_at?: string
          user_id?: string | null
          vat_filing_method?: string
          vat_has_eu_trade?: boolean
          vat_number?: string | null
          vat_registered?: boolean | null
          vat_taxable_base_over_40m?: boolean
          voucher_series_labels?: Json
          website?: string | null
        }
        Update: {
          account_number?: string | null
          accounting_method?: string
          address_line1?: string | null
          address_line2?: string | null
          aktiekapital?: number | null
          antal_aktier?: number | null
          auto_lock_period_days?: number | null
          bank_name?: string | null
          bankgiro?: string | null
          bic?: string | null
          bookkeeping_locked_through?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id?: string
          company_name?: string | null
          country?: string | null
          created_at?: string
          data_analysis_opt_in?: boolean
          default_our_reference?: string | null
          default_voucher_series?: string
          default_voucher_series_per_source_type?: Json
          defer_invoice_booking?: boolean
          dimensions_enabled?: boolean
          email?: string | null
          employer_registered?: boolean | null
          employer_seasonal?: boolean
          entity_type?: string | null
          f_skatt?: boolean | null
          fiscal_year_start_month?: number | null
          fyllnadsinbetalning_enabled?: boolean
          iban?: string | null
          id?: string
          initial_setup_completed_at?: string | null
          initial_setup_dismissed_at?: string | null
          initial_setup_path?: string | null
          intrastat_enabled?: boolean
          invoice_accent_color?: string
          invoice_company_name_position?: string
          invoice_credit_terms_text?: string | null
          invoice_custom_font_name?: string | null
          invoice_custom_font_path?: string | null
          invoice_default_days?: number | null
          invoice_default_notes?: string | null
          invoice_email_bcc_addresses?: string[] | null
          invoice_email_cc_addresses?: string[] | null
          invoice_email_texts?: Json | null
          invoice_font_family?: string
          invoice_footer_text?: string | null
          invoice_header_text?: string | null
          invoice_late_fee_text?: string | null
          invoice_payment_accounts?: Json
          invoice_payment_links_enabled?: boolean
          invoice_prefix?: string | null
          invoice_primary_color?: string
          invoice_show_bankgiro?: boolean | null
          invoice_show_company_name?: boolean | null
          invoice_show_logo?: boolean | null
          invoice_show_ocr?: boolean | null
          invoice_show_plusgiro?: boolean | null
          invoice_show_swish?: boolean | null
          ioss_enabled?: boolean
          is_sandbox?: boolean
          kontrolluppgifter_enabled?: boolean
          last_supplier_payment_account?: string | null
          logo_url?: string | null
          mileage_enabled?: boolean
          moms_period?: string | null
          next_arrival_number?: number
          next_article_number?: number
          next_delivery_note_number?: number | null
          next_invoice_number?: number | null
          next_quote_number?: number
          next_sales_order_number?: number
          onboarding_complete?: boolean | null
          onboarding_step?: number
          ore_rounding?: boolean | null
          org_number?: string | null
          oss_enabled?: boolean
          pays_salaries?: boolean
          periodisk_sammanstallning_enabled?: boolean
          periodisk_sammanstallning_filing_method?: string
          periodisk_sammanstallning_period?: string
          phone?: string | null
          plusgiro?: string | null
          postal_code?: string | null
          preferred_payment_format?: string
          preliminary_tax_monthly?: number | null
          punktskatt_enabled?: boolean
          reminder_days_level_1?: number
          reminder_days_level_2?: number
          reminder_days_level_3?: number
          reminder_fee_amount?: number
          reminder_fee_enabled?: boolean
          reminder_interest_rate_override?: number | null
          reminder_text_overrides?: Json | null
          rot_rut_enabled?: boolean
          salary_default_bank?: string | null
          salary_net_rounding?: boolean
          salary_pay_day?: number
          salary_vacation_year_basis?: string
          sales_orders_enabled?: boolean
          schablon_mileage_rate?: number | null
          sector_slug?: string | null
          send_invoice_reminders?: boolean | null
          swish?: string | null
          tax_contact_email?: string | null
          tax_contact_name?: string | null
          tax_contact_phone?: string | null
          tax_turnover_over_40m?: boolean
          updated_at?: string
          user_id?: string | null
          vat_filing_method?: string
          vat_has_eu_trade?: boolean
          vat_number?: string | null
          vat_registered?: boolean | null
          vat_taxable_base_over_40m?: boolean
          voucher_series_labels?: Json
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_subscriptions: {
        Row: {
          company_id: string
          created_at: string
          current_period_end: string | null
          id: string
          plan: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_connections: {
        Row: {
          account_uids: string[]
          activated_at: string | null
          company_ref: string
          connector_key_id: string
          created_at: string
          handle_hash: string | null
          id: string
          last_used_at: string | null
          pending_state: string | null
          provider: string | null
          refresh_hash: string | null
          revoked_at: string | null
          service: string
          status: string
        }
        Insert: {
          account_uids?: string[]
          activated_at?: string | null
          company_ref: string
          connector_key_id: string
          created_at?: string
          handle_hash?: string | null
          id?: string
          last_used_at?: string | null
          pending_state?: string | null
          provider?: string | null
          refresh_hash?: string | null
          revoked_at?: string | null
          service: string
          status?: string
        }
        Update: {
          account_uids?: string[]
          activated_at?: string | null
          company_ref?: string
          connector_key_id?: string
          created_at?: string
          handle_hash?: string | null
          id?: string
          last_used_at?: string | null
          pending_state?: string | null
          provider?: string | null
          refresh_hash?: string | null
          revoked_at?: string | null
          service?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connector_connections_connector_key_id_fkey"
            columns: ["connector_key_id"]
            isOneToOne: false
            referencedRelation: "connector_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_keys: {
        Row: {
          active_company_count: number
          created_at: string
          current_period_end: string | null
          id: string
          instance_url: string | null
          key_hash: string
          key_prefix: string
          last_seen_at: string | null
          last_synced_at: string | null
          licensee_name: string | null
          limits: Json
          notes: string | null
          org_number: string
          peppol_participants: string[]
          rate_limit_rpm: number
          rate_limit_window_start: string | null
          request_count: number
          revoked_at: string | null
          scopes: string[]
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          active_company_count?: number
          created_at?: string
          current_period_end?: string | null
          id?: string
          instance_url?: string | null
          key_hash: string
          key_prefix: string
          last_seen_at?: string | null
          last_synced_at?: string | null
          licensee_name?: string | null
          limits?: Json
          notes?: string | null
          org_number: string
          peppol_participants?: string[]
          rate_limit_rpm?: number
          rate_limit_window_start?: string | null
          request_count?: number
          revoked_at?: string | null
          scopes?: string[]
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          active_company_count?: number
          created_at?: string
          current_period_end?: string | null
          id?: string
          instance_url?: string | null
          key_hash?: string
          key_prefix?: string
          last_seen_at?: string | null
          last_synced_at?: string | null
          licensee_name?: string | null
          limits?: Json
          notes?: string | null
          org_number?: string
          peppol_participants?: string[]
          rate_limit_rpm?: number
          rate_limit_window_start?: string | null
          request_count?: number
          revoked_at?: string | null
          scopes?: string[]
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      connector_peppol_submissions: {
        Row: {
          company_ref: string
          connector_key_id: string
          created_at: string
          id: string
          idempotency_key: string | null
          provider: string
          provider_submission_id: string
        }
        Insert: {
          company_ref: string
          connector_key_id: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          provider?: string
          provider_submission_id: string
        }
        Update: {
          company_ref?: string
          connector_key_id?: string
          created_at?: string
          id?: string
          idempotency_key?: string | null
          provider?: string
          provider_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connector_peppol_submissions_connector_key_id_fkey"
            columns: ["connector_key_id"]
            isOneToOne: false
            referencedRelation: "connector_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      connector_upstream_counters: {
        Row: {
          count: number
          service: string
          updated_at: string
          window_key: string
          window_kind: string
        }
        Insert: {
          count?: number
          service: string
          updated_at?: string
          window_key: string
          window_kind: string
        }
        Update: {
          count?: number
          service?: string
          updated_at?: string
          window_key?: string
          window_kind?: string
        }
        Relationships: []
      }
      connector_usage_events: {
        Row: {
          connector_key_id: string
          endpoint: string | null
          id: string
          metadata: Json
          occurred_at: string
          service: string
          status_code: number | null
        }
        Insert: {
          connector_key_id: string
          endpoint?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          service: string
          status_code?: number | null
        }
        Update: {
          connector_key_id?: string
          endpoint?: string | null
          id?: string
          metadata?: Json
          occurred_at?: string
          service?: string
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "connector_usage_events_connector_key_id_fkey"
            columns: ["connector_key_id"]
            isOneToOne: false
            referencedRelation: "connector_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          code: string
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      counterparty_aliases: {
        Row: {
          alias_key: string
          band: string
          company_id: string
          confidence: number
          country: string | null
          created_at: string
          display_name: string | null
          human_outcome: string | null
          id: string
          kind: string
          model: string | null
          outcome_at: string | null
          party_id: string | null
          rail: string | null
          sample_text: string
          source: string
          superseded_at: string | null
          updated_at: string
          user_id: string | null
          verified: boolean
          what: string | null
        }
        Insert: {
          alias_key: string
          band: string
          company_id: string
          confidence: number
          country?: string | null
          created_at?: string
          display_name?: string | null
          human_outcome?: string | null
          id?: string
          kind: string
          model?: string | null
          outcome_at?: string | null
          party_id?: string | null
          rail?: string | null
          sample_text: string
          source: string
          superseded_at?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          what?: string | null
        }
        Update: {
          alias_key?: string
          band?: string
          company_id?: string
          confidence?: number
          country?: string | null
          created_at?: string
          display_name?: string | null
          human_outcome?: string | null
          id?: string
          kind?: string
          model?: string | null
          outcome_at?: string | null
          party_id?: string | null
          rail?: string | null
          sample_text?: string
          source?: string
          superseded_at?: string | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean
          what?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counterparty_aliases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counterparty_aliases_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      counterparty_directory: {
        Row: {
          company_count: number
          confidence: number
          country: string | null
          created_at: string
          directory_key: string
          display_name: string
          id: string
          kind: string
          logo_domain: string | null
          rail: string | null
          source: string
          updated_at: string
          what: string | null
        }
        Insert: {
          company_count?: number
          confidence?: number
          country?: string | null
          created_at?: string
          directory_key: string
          display_name: string
          id?: string
          kind: string
          logo_domain?: string | null
          rail?: string | null
          source: string
          updated_at?: string
          what?: string | null
        }
        Update: {
          company_count?: number
          confidence?: number
          country?: string | null
          created_at?: string
          directory_key?: string
          display_name?: string
          id?: string
          kind?: string
          logo_domain?: string | null
          rail?: string | null
          source?: string
          updated_at?: string
          what?: string | null
        }
        Relationships: []
      }
      currencies: {
        Row: {
          active: boolean
          code: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          code: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          code?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      customers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          archived_at: string | null
          city: string | null
          company_id: string
          contact_person: string | null
          country: string | null
          country_raw: string | null
          created_at: string
          customer_number: string | null
          customer_type: string
          default_payment_terms: number | null
          email: string | null
          id: string
          invoice_email_bcc_addresses: string[] | null
          invoice_email_cc_addresses: string[] | null
          is_international: boolean | null
          language: string
          name: string
          notes: string | null
          org_number: string | null
          party_id: string | null
          personal_number: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
          user_id: string
          vat_number: string | null
          vat_number_validated: boolean
          vat_number_validated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          city?: string | null
          company_id: string
          contact_person?: string | null
          country?: string | null
          country_raw?: string | null
          created_at?: string
          customer_number?: string | null
          customer_type?: string
          default_payment_terms?: number | null
          email?: string | null
          id?: string
          invoice_email_bcc_addresses?: string[] | null
          invoice_email_cc_addresses?: string[] | null
          is_international?: boolean | null
          language?: string
          name: string
          notes?: string | null
          org_number?: string | null
          party_id?: string | null
          personal_number?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id: string
          vat_number?: string | null
          vat_number_validated?: boolean
          vat_number_validated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          city?: string | null
          company_id?: string
          contact_person?: string | null
          country?: string | null
          country_raw?: string | null
          created_at?: string
          customer_number?: string | null
          customer_type?: string
          default_payment_terms?: number | null
          email?: string | null
          id?: string
          invoice_email_bcc_addresses?: string[] | null
          invoice_email_cc_addresses?: string[] | null
          is_international?: boolean | null
          language?: string
          name?: string
          notes?: string | null
          org_number?: string | null
          party_id?: string | null
          personal_number?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_id?: string
          vat_number?: string | null
          vat_number_validated?: boolean
          vat_number_validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_party_same_company"
            columns: ["party_id", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      deadlines: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          customer_id: string | null
          deadline_type: string | null
          dismissed_at: string | null
          due_date: string
          due_time: string | null
          id: string
          is_auto_generated: boolean | null
          is_completed: boolean | null
          linked_report_period: Json | null
          linked_report_type: string | null
          notes: string | null
          priority: string | null
          reminder_offsets: number[] | null
          source: string | null
          status: string | null
          status_changed_at: string | null
          tax_assessment_notice_id: string | null
          tax_deadline_type: string | null
          tax_period: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          deadline_type?: string | null
          dismissed_at?: string | null
          due_date: string
          due_time?: string | null
          id?: string
          is_auto_generated?: boolean | null
          is_completed?: boolean | null
          linked_report_period?: Json | null
          linked_report_type?: string | null
          notes?: string | null
          priority?: string | null
          reminder_offsets?: number[] | null
          source?: string | null
          status?: string | null
          status_changed_at?: string | null
          tax_assessment_notice_id?: string | null
          tax_deadline_type?: string | null
          tax_period?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          deadline_type?: string | null
          dismissed_at?: string | null
          due_date?: string
          due_time?: string | null
          id?: string
          is_auto_generated?: boolean | null
          is_completed?: boolean | null
          linked_report_period?: Json | null
          linked_report_type?: string | null
          notes?: string | null
          priority?: string | null
          reminder_offsets?: number[] | null
          source?: string | null
          status?: string | null
          status_changed_at?: string | null
          tax_assessment_notice_id?: string | null
          tax_deadline_type?: string | null
          tax_period?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadlines_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadlines_tax_assessment_notice_company_fkey"
            columns: ["tax_assessment_notice_id", "company_id"]
            isOneToOne: false
            referencedRelation: "tax_assessment_notices"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      depreciation_schedules: {
        Row: {
          asset_id: string
          company_id: string
          created_at: string
          fiscal_period_id: string
          id: string
          journal_entry_id: string | null
          planned_depreciation: number
          posted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_id: string
          company_id: string
          created_at?: string
          fiscal_period_id: string
          id?: string
          journal_entry_id?: string | null
          planned_depreciation: number
          posted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_id?: string
          company_id?: string
          created_at?: string
          fiscal_period_id?: string
          id?: string
          journal_entry_id?: string | null
          planned_depreciation?: number
          posted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "depreciation_schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depreciation_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depreciation_schedules_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depreciation_schedules_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      dimension_retag_log: {
        Row: {
          actor: string | null
          company_id: string
          created_at: string
          id: string
          journal_entry_id: string
          line_id: string
          new_dimensions: Json
          old_dimensions: Json
          reason: string
        }
        Insert: {
          actor?: string | null
          company_id: string
          created_at?: string
          id?: string
          journal_entry_id: string
          line_id: string
          new_dimensions: Json
          old_dimensions: Json
          reason: string
        }
        Update: {
          actor?: string | null
          company_id?: string
          created_at?: string
          id?: string
          journal_entry_id?: string
          line_id?: string
          new_dimensions?: Json
          old_dimensions?: Json
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "dimension_retag_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dimension_values: {
        Row: {
          attributes: Json
          code: string
          company_id: string
          created_at: string
          created_by_import_id: string | null
          dimension_id: string
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          parent_value_id: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          attributes?: Json
          code: string
          company_id: string
          created_at?: string
          created_by_import_id?: string | null
          dimension_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_value_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          attributes?: Json
          code?: string
          company_id?: string
          created_at?: string
          created_by_import_id?: string | null
          dimension_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_value_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dimension_values_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dimension_values_created_by_import_id_fkey"
            columns: ["created_by_import_id"]
            isOneToOne: false
            referencedRelation: "sie_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dimension_values_dimension_id_company_id_fkey"
            columns: ["dimension_id", "company_id"]
            isOneToOne: false
            referencedRelation: "dimensions"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "dimension_values_parent_value_id_fkey"
            columns: ["parent_value_id"]
            isOneToOne: false
            referencedRelation: "dimension_values"
            referencedColumns: ["id"]
          },
        ]
      }
      dimensions: {
        Row: {
          company_id: string
          created_at: string
          created_by_import_id: string | null
          firm_id: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          parent_sie_dim_no: number | null
          resets_annually: boolean
          sie_dim_no: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by_import_id?: string | null
          firm_id?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          parent_sie_dim_no?: number | null
          resets_annually?: boolean
          sie_dim_no: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by_import_id?: string | null
          firm_id?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          parent_sie_dim_no?: number | null
          resets_annually?: boolean
          sie_dim_no?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dimensions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dimensions_created_by_import_id_fkey"
            columns: ["created_by_import_id"]
            isOneToOne: false
            referencedRelation: "sie_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      document_attachments: {
        Row: {
          company_id: string
          created_at: string
          digitization_date: string | null
          extracted_at: string | null
          extracted_data: Json | null
          extraction_model: string | null
          file_name: string
          file_size_bytes: number | null
          id: string
          is_current_version: boolean
          journal_entry_id: string | null
          journal_entry_line_id: string | null
          last_integrity_check_at: string | null
          mime_type: string | null
          original_id: string | null
          prev_version_hash: string | null
          sha256_hash: string
          storage_path: string
          superseded_by_id: string | null
          updated_at: string
          upload_source: string | null
          uploaded_by: string | null
          user_id: string
          version: number
        }
        Insert: {
          company_id: string
          created_at?: string
          digitization_date?: string | null
          extracted_at?: string | null
          extracted_data?: Json | null
          extraction_model?: string | null
          file_name: string
          file_size_bytes?: number | null
          id?: string
          is_current_version?: boolean
          journal_entry_id?: string | null
          journal_entry_line_id?: string | null
          last_integrity_check_at?: string | null
          mime_type?: string | null
          original_id?: string | null
          prev_version_hash?: string | null
          sha256_hash: string
          storage_path: string
          superseded_by_id?: string | null
          updated_at?: string
          upload_source?: string | null
          uploaded_by?: string | null
          user_id: string
          version?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          digitization_date?: string | null
          extracted_at?: string | null
          extracted_data?: Json | null
          extraction_model?: string | null
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          is_current_version?: boolean
          journal_entry_id?: string | null
          journal_entry_line_id?: string | null
          last_integrity_check_at?: string | null
          mime_type?: string | null
          original_id?: string | null
          prev_version_hash?: string | null
          sha256_hash?: string
          storage_path?: string
          superseded_by_id?: string | null
          updated_at?: string
          upload_source?: string | null
          uploaded_by?: string | null
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_attachments_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_attachments_journal_entry_line_id_fkey"
            columns: ["journal_entry_line_id"]
            isOneToOne: false
            referencedRelation: "journal_entry_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_attachments_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_attachments_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_integrity_checks: {
        Row: {
          checked_at: string
          company_id: string
          computed_sha256: string | null
          created_at: string
          detail: string | null
          document_id: string
          expected_sha256: string
          id: string
          result: string
          storage_path: string
        }
        Insert: {
          checked_at?: string
          company_id: string
          computed_sha256?: string | null
          created_at?: string
          detail?: string | null
          document_id: string
          expected_sha256: string
          id?: string
          result: string
          storage_path: string
        }
        Update: {
          checked_at?: string
          company_id?: string
          computed_sha256?: string | null
          created_at?: string
          detail?: string | null
          document_id?: string
          expected_sha256?: string
          id?: string
          result?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_integrity_checks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_integrity_checks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_change_requests: {
        Row: {
          claimed_at: string
          target_email: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          target_email: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          target_email?: string
          user_id?: string
        }
        Relationships: []
      }
      employee_benefits: {
        Row: {
          benefit_type: string
          company_id: string
          created_at: string
          description: string
          employee_id: string
          id: string
          is_active: boolean
          metadata: Json
          monthly_value: number
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          benefit_type: string
          company_id: string
          created_at?: string
          description: string
          employee_id: string
          id?: string
          is_active?: boolean
          metadata?: Json
          monthly_value: number
          updated_at?: string
          user_id: string
          valid_from: string
          valid_to?: string | null
        }
        Update: {
          benefit_type?: string
          company_id?: string
          created_at?: string
          description?: string
          employee_id?: string
          id?: string
          is_active?: boolean
          metadata?: Json
          monthly_value?: number
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_opening_balances: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          cutover_date: string
          employee_id: string
          id: string
          karens_periods_adjustment: number
          opening_semester_liability: number
          opening_semester_liability_avgifter: number
          updated_at: string
          updated_by: string | null
          vacation_days_taken_this_year: number
          vacation_paid_days_remaining: number
          vacation_saved_days_by_year: Json
          ytd_gross: number
          ytd_net: number
          ytd_tax: number
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          cutover_date: string
          employee_id: string
          id?: string
          karens_periods_adjustment?: number
          opening_semester_liability?: number
          opening_semester_liability_avgifter?: number
          updated_at?: string
          updated_by?: string | null
          vacation_days_taken_this_year?: number
          vacation_paid_days_remaining?: number
          vacation_saved_days_by_year?: Json
          ytd_gross?: number
          ytd_net?: number
          ytd_tax?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          cutover_date?: string
          employee_id?: string
          id?: string
          karens_periods_adjustment?: number
          opening_semester_liability?: number
          opening_semester_liability_avgifter?: number
          updated_at?: string
          updated_by?: string | null
          vacation_days_taken_this_year?: number
          vacation_paid_days_remaining?: number
          vacation_saved_days_by_year?: Json
          ytd_gross?: number
          ytd_net?: number
          ytd_tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_opening_balances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_opening_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_recurring_lines: {
        Row: {
          account_number: string | null
          amount: number
          company_id: string
          created_at: string
          description: string
          employee_id: string
          id: string
          is_active: boolean
          item_type: string
          metadata: Json
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          account_number?: string | null
          amount: number
          company_id: string
          created_at?: string
          description: string
          employee_id: string
          id?: string
          is_active?: boolean
          item_type: string
          metadata?: Json
          updated_at?: string
          user_id: string
          valid_from: string
          valid_to?: string | null
        }
        Update: {
          account_number?: string | null
          amount?: number
          company_id?: string
          created_at?: string
          description?: string
          employee_id?: string
          id?: string
          is_active?: boolean
          item_type?: string
          metadata?: Json
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_recurring_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_recurring_lines_employee_id_company_id_fkey"
            columns: ["employee_id", "company_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      employee_vacation_balances: {
        Row: {
          accrued_days: number
          company_id: string
          created_at: string
          employee_id: string
          entitled_days: number
          forced_payout_days: number
          id: string
          saved_days: Json
          status: string
          taken_days: number
          updated_at: string
          vacation_year_start: string
        }
        Insert: {
          accrued_days?: number
          company_id: string
          created_at?: string
          employee_id: string
          entitled_days?: number
          forced_payout_days?: number
          id?: string
          saved_days?: Json
          status?: string
          taken_days?: number
          updated_at?: string
          vacation_year_start: string
        }
        Update: {
          accrued_days?: number
          company_id?: string
          created_at?: string
          employee_id?: string
          entitled_days?: number
          forced_payout_days?: number
          id?: string
          saved_days?: Json
          status?: string
          taken_days?: number
          updated_at?: string
          vacation_year_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_vacation_balances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_vacation_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_line1: string | null
          bank_account_number: string | null
          city: string | null
          clearing_number: string | null
          company_id: string
          created_at: string
          default_dimensions: Json
          email: string | null
          employment_degree: number
          employment_end: string | null
          employment_start: string
          employment_type: string
          f_skatt_status: string | null
          f_skatt_verified_at: string | null
          first_name: string
          hourly_rate: number | null
          hours_per_week: number
          housing_benefit_type: string | null
          id: string
          is_active: boolean
          is_sidoinkomst: boolean
          jamkning_percentage: number | null
          jamkning_valid_from: string | null
          jamkning_valid_to: string | null
          last_name: string
          monthly_salary: number | null
          personnummer: string
          personnummer_last4: string
          phone: string | null
          postal_code: string | null
          salary_type: string
          semestertillagg_rate: number
          specification_number: number | null
          tax_column: number | null
          tax_municipality: string | null
          tax_table_number: number | null
          updated_at: string
          user_id: string
          vacation_days_per_year: number
          vacation_days_saved: number
          vacation_pay_rate: number | null
          vacation_rule: string
          vaxa_stod_eligible: boolean
          vaxa_stod_end: string | null
          vaxa_stod_start: string | null
          workdays_per_week: number
        }
        Insert: {
          address_line1?: string | null
          bank_account_number?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id: string
          created_at?: string
          default_dimensions?: Json
          email?: string | null
          employment_degree?: number
          employment_end?: string | null
          employment_start: string
          employment_type?: string
          f_skatt_status?: string | null
          f_skatt_verified_at?: string | null
          first_name: string
          hourly_rate?: number | null
          hours_per_week?: number
          housing_benefit_type?: string | null
          id?: string
          is_active?: boolean
          is_sidoinkomst?: boolean
          jamkning_percentage?: number | null
          jamkning_valid_from?: string | null
          jamkning_valid_to?: string | null
          last_name: string
          monthly_salary?: number | null
          personnummer: string
          personnummer_last4: string
          phone?: string | null
          postal_code?: string | null
          salary_type?: string
          semestertillagg_rate?: number
          specification_number?: number | null
          tax_column?: number | null
          tax_municipality?: string | null
          tax_table_number?: number | null
          updated_at?: string
          user_id: string
          vacation_days_per_year?: number
          vacation_days_saved?: number
          vacation_pay_rate?: number | null
          vacation_rule?: string
          vaxa_stod_eligible?: boolean
          vaxa_stod_end?: string | null
          vaxa_stod_start?: string | null
          workdays_per_week?: number
        }
        Update: {
          address_line1?: string | null
          bank_account_number?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id?: string
          created_at?: string
          default_dimensions?: Json
          email?: string | null
          employment_degree?: number
          employment_end?: string | null
          employment_start?: string
          employment_type?: string
          f_skatt_status?: string | null
          f_skatt_verified_at?: string | null
          first_name?: string
          hourly_rate?: number | null
          hours_per_week?: number
          housing_benefit_type?: string | null
          id?: string
          is_active?: boolean
          is_sidoinkomst?: boolean
          jamkning_percentage?: number | null
          jamkning_valid_from?: string | null
          jamkning_valid_to?: string | null
          last_name?: string
          monthly_salary?: number | null
          personnummer?: string
          personnummer_last4?: string
          phone?: string | null
          postal_code?: string | null
          salary_type?: string
          semestertillagg_rate?: number
          specification_number?: number | null
          tax_column?: number | null
          tax_municipality?: string | null
          tax_table_number?: number | null
          updated_at?: string
          user_id?: string
          vacation_days_per_year?: number
          vacation_days_saved?: number
          vacation_pay_rate?: number | null
          vacation_rule?: string
          vaxa_stod_eligible?: boolean
          vaxa_stod_end?: string | null
          vaxa_stod_start?: string | null
          workdays_per_week?: number
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      event_log: {
        Row: {
          company_id: string | null
          created_at: string
          data: Json
          entity_id: string | null
          event_type: string
          sequence: number
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          data?: Json
          entity_id?: string | null
          event_type: string
          sequence?: number
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          data?: Json
          entity_id?: string | null
          event_type?: string
          sequence?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          currency: string
          fetched_at: string
          id: string
          observation_date: string
          rate: number
          rate_date: string
          source: string
        }
        Insert: {
          currency: string
          fetched_at?: string
          id?: string
          observation_date: string
          rate: number
          rate_date: string
          source?: string
        }
        Update: {
          currency?: string
          fetched_at?: string
          id?: string
          observation_date?: string
          rate?: number
          rate_date?: string
          source?: string
        }
        Relationships: []
      }
      expense_claims: {
        Row: {
          amount_in_currency: number | null
          amount_sek: number
          claimant_name: string
          company_id: string
          created_at: string
          currency: string
          description: string
          document_id: string | null
          employee_id: string | null
          exchange_rate: number | null
          expense_account: string
          expense_date: string
          id: string
          journal_entry_id: string | null
          liability_account: string
          metadata: Json
          payout_batch_id: string | null
          status: string
          updated_at: string
          user_id: string
          vat_sek: number
        }
        Insert: {
          amount_in_currency?: number | null
          amount_sek: number
          claimant_name: string
          company_id: string
          created_at?: string
          currency?: string
          description: string
          document_id?: string | null
          employee_id?: string | null
          exchange_rate?: number | null
          expense_account: string
          expense_date: string
          id?: string
          journal_entry_id?: string | null
          liability_account?: string
          metadata?: Json
          payout_batch_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vat_sek?: number
        }
        Update: {
          amount_in_currency?: number | null
          amount_sek?: number
          claimant_name?: string
          company_id?: string
          created_at?: string
          currency?: string
          description?: string
          document_id?: string | null
          employee_id?: string | null
          exchange_rate?: number | null
          expense_account?: string
          expense_date?: string
          id?: string
          journal_entry_id?: string | null
          liability_account?: string
          metadata?: Json
          payout_batch_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vat_sek?: number
        }
        Relationships: [
          {
            foreignKeyName: "expense_claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_claims_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_claims_employee_id_company_id_fkey"
            columns: ["employee_id", "company_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "expense_claims_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_claims_payout_batch_id_company_id_fkey"
            columns: ["payout_batch_id", "company_id"]
            isOneToOne: false
            referencedRelation: "expense_payout_batches"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      expense_payout_batches: {
        Row: {
          cash_account: string
          claimant_name: string
          company_id: string
          created_at: string
          employee_id: string | null
          id: string
          journal_entry_id: string | null
          liability_account: string
          notes: string | null
          payout_date: string
          total_sek: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cash_account: string
          claimant_name: string
          company_id: string
          created_at?: string
          employee_id?: string | null
          id?: string
          journal_entry_id?: string | null
          liability_account: string
          notes?: string | null
          payout_date: string
          total_sek: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cash_account?: string
          claimant_name?: string
          company_id?: string
          created_at?: string
          employee_id?: string | null
          id?: string
          journal_entry_id?: string | null
          liability_account?: string
          notes?: string | null
          payout_date?: string
          total_sek?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_payout_batches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_payout_batches_employee_id_company_id_fkey"
            columns: ["employee_id", "company_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "expense_payout_batches_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_data: {
        Row: {
          company_id: string
          created_at: string | null
          extension_id: string
          id: string
          key: string
          updated_at: string | null
          user_id: string
          value: Json
        }
        Insert: {
          company_id: string
          created_at?: string | null
          extension_id: string
          id?: string
          key: string
          updated_at?: string | null
          user_id: string
          value?: Json
        }
        Update: {
          company_id?: string
          created_at?: string | null
          extension_id?: string
          id?: string
          key?: string
          updated_at?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "extension_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_toggles: {
        Row: {
          created_at: string
          enabled: boolean
          extension_slug: string
          id: string
          sector_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          extension_slug: string
          id?: string
          sector_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          extension_slug?: string
          id?: string
          sector_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fiscal_period_tax_adjustments: {
        Row: {
          account_number: string | null
          adjustment_type: string
          amount: number
          company_id: string
          created_at: string
          description: string
          fiscal_period_id: string
          id: string
          included: boolean
          source: string
          source_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          adjustment_type: string
          amount: number
          company_id: string
          created_at?: string
          description: string
          fiscal_period_id: string
          id?: string
          included?: boolean
          source: string
          source_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          adjustment_type?: string
          amount?: number
          company_id?: string
          created_at?: string
          description?: string
          fiscal_period_id?: string
          id?: string
          included?: boolean
          source?: string
          source_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_period_tax_adjustments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscal_period_tax_adjustments_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_periods: {
        Row: {
          closed_at: string | null
          closed_externally: boolean
          closing_entry_id: string | null
          company_id: string
          continuity_verified: boolean | null
          created_at: string
          id: string
          is_closed: boolean | null
          locked_at: string | null
          name: string
          opening_balance_entry_id: string | null
          opening_balances_set: boolean | null
          period_end: string
          period_start: string
          previous_period_id: string | null
          retention_expires_at: string | null
          tax_depreciation_base: number | null
          tax_depreciation_calculation: Json | null
          tax_depreciation_closing_value: number | null
          tax_depreciation_deduction: number | null
          tax_depreciation_method: string | null
          tax_depreciation_opening_value: number | null
          tax_depreciation_rule: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_externally?: boolean
          closing_entry_id?: string | null
          company_id: string
          continuity_verified?: boolean | null
          created_at?: string
          id?: string
          is_closed?: boolean | null
          locked_at?: string | null
          name: string
          opening_balance_entry_id?: string | null
          opening_balances_set?: boolean | null
          period_end: string
          period_start: string
          previous_period_id?: string | null
          retention_expires_at?: string | null
          tax_depreciation_base?: number | null
          tax_depreciation_calculation?: Json | null
          tax_depreciation_closing_value?: number | null
          tax_depreciation_deduction?: number | null
          tax_depreciation_method?: string | null
          tax_depreciation_opening_value?: number | null
          tax_depreciation_rule?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_externally?: boolean
          closing_entry_id?: string | null
          company_id?: string
          continuity_verified?: boolean | null
          created_at?: string
          id?: string
          is_closed?: boolean | null
          locked_at?: string | null
          name?: string
          opening_balance_entry_id?: string | null
          opening_balances_set?: boolean | null
          period_end?: string
          period_start?: string
          previous_period_id?: string | null
          retention_expires_at?: string | null
          tax_depreciation_base?: number | null
          tax_depreciation_calculation?: Json | null
          tax_depreciation_closing_value?: number | null
          tax_depreciation_deduction?: number | null
          tax_depreciation_method?: string | null
          tax_depreciation_opening_value?: number | null
          tax_depreciation_rule?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_periods_closing_entry_id_fkey"
            columns: ["closing_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscal_periods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscal_periods_opening_balance_entry_id_fkey"
            columns: ["opening_balance_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscal_periods_previous_period_id_fkey"
            columns: ["previous_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      idempotency_keys: {
        Row: {
          company_id: string
          created_at: string
          expires_at: string
          id: string
          key: string
          request_hash: string
          response_body: Json
          response_status: string
          scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          expires_at?: string
          id?: string
          key: string
          request_hash: string
          response_body?: Json
          response_status: string
          scope?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          key?: string
          request_hash?: string
          response_body?: Json
          response_status?: string
          scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idempotency_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inbox_rate_counters: {
        Row: {
          company_id: string
          count: number
          updated_at: string
          window_key: string
          window_kind: string
        }
        Insert: {
          company_id: string
          count?: number
          updated_at?: string
          window_key: string
          window_kind: string
        }
        Update: {
          company_id?: string
          count?: number
          updated_at?: string
          window_key?: string
          window_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_rate_counters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_deliveries: {
        Row: {
          attachment_content_type: string | null
          attachment_filename: string | null
          attachment_sha256: string | null
          bcc_addresses: string[]
          body_html: string | null
          body_text: string | null
          cc_addresses: string[]
          channel: string
          company_id: string
          created_at: string
          document_attachment_id: string | null
          error_code: string | null
          failed_at: string | null
          from_name: string | null
          id: string
          invoice_id: string
          pii_redacted_at: string | null
          provider: string | null
          provider_message_id: string | null
          provider_recipient_statuses: Json
          provider_status: string | null
          provider_status_at: string | null
          provider_status_detail: string | null
          reply_to: string | null
          retention_expires_at: string
          sent_at: string | null
          status: string
          subject: string | null
          to_addresses: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attachment_content_type?: string | null
          attachment_filename?: string | null
          attachment_sha256?: string | null
          bcc_addresses?: string[]
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: string[]
          channel: string
          company_id: string
          created_at?: string
          document_attachment_id?: string | null
          error_code?: string | null
          failed_at?: string | null
          from_name?: string | null
          id?: string
          invoice_id: string
          pii_redacted_at?: string | null
          provider?: string | null
          provider_message_id?: string | null
          provider_recipient_statuses?: Json
          provider_status?: string | null
          provider_status_at?: string | null
          provider_status_detail?: string | null
          reply_to?: string | null
          retention_expires_at: string
          sent_at?: string | null
          status: string
          subject?: string | null
          to_addresses?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attachment_content_type?: string | null
          attachment_filename?: string | null
          attachment_sha256?: string | null
          bcc_addresses?: string[]
          body_html?: string | null
          body_text?: string | null
          cc_addresses?: string[]
          channel?: string
          company_id?: string
          created_at?: string
          document_attachment_id?: string | null
          error_code?: string | null
          failed_at?: string | null
          from_name?: string | null
          id?: string
          invoice_id?: string
          pii_redacted_at?: string | null
          provider?: string | null
          provider_message_id?: string | null
          provider_recipient_statuses?: Json
          provider_status?: string | null
          provider_status_at?: string | null
          provider_status_detail?: string | null
          reply_to?: string | null
          retention_expires_at?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          to_addresses?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_deliveries_document_attachment_id_fkey"
            columns: ["document_attachment_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_deliveries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_inbox_items: {
        Row: {
          channel_context: Json | null
          company_id: string
          correlation_id: string | null
          created_at: string
          created_journal_entry_id: string | null
          created_supplier_invoice_id: string | null
          document_id: string | null
          email_body_text: string | null
          email_from: string | null
          email_received_at: string | null
          email_subject: string | null
          error_message: string | null
          extracted_data: Json | null
          extraction_skipped: boolean
          id: string
          kind_hint: string | null
          matched_supplier_id: string | null
          matched_transaction_id: string | null
          raw_email_payload: Json | null
          resend_attachment_id: string | null
          resend_email_id: string | null
          source: string
          status: string
          updated_at: string
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          channel_context?: Json | null
          company_id: string
          correlation_id?: string | null
          created_at?: string
          created_journal_entry_id?: string | null
          created_supplier_invoice_id?: string | null
          document_id?: string | null
          email_body_text?: string | null
          email_from?: string | null
          email_received_at?: string | null
          email_subject?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          extraction_skipped?: boolean
          id?: string
          kind_hint?: string | null
          matched_supplier_id?: string | null
          matched_transaction_id?: string | null
          raw_email_payload?: Json | null
          resend_attachment_id?: string | null
          resend_email_id?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          channel_context?: Json | null
          company_id?: string
          correlation_id?: string | null
          created_at?: string
          created_journal_entry_id?: string | null
          created_supplier_invoice_id?: string | null
          document_id?: string | null
          email_body_text?: string | null
          email_from?: string | null
          email_received_at?: string | null
          email_subject?: string | null
          error_message?: string | null
          extracted_data?: Json | null
          extraction_skipped?: boolean
          id?: string
          kind_hint?: string | null
          matched_supplier_id?: string | null
          matched_transaction_id?: string | null
          raw_email_payload?: Json | null
          resend_attachment_id?: string | null
          resend_email_id?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_inbox_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_created_journal_entry_id_fkey"
            columns: ["created_journal_entry_id"]
            isOneToOne: true
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_created_supplier_invoice_id_fkey"
            columns: ["created_supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_matched_supplier_id_fkey"
            columns: ["matched_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_matched_transaction_id_fkey"
            columns: ["matched_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_inbox_items_whatsapp_message_id_fkey"
            columns: ["whatsapp_message_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          accrual_balance_account: string | null
          accrual_period_end: string | null
          accrual_period_start: string | null
          apartment_number: string | null
          article_id: string | null
          brf_org_number: string | null
          created_at: string
          deduction_amount: number
          deduction_type: string | null
          description: string
          dimensions: Json
          discount_percent: number
          housing_designation: string | null
          id: string
          invoice_id: string
          labor_hours: number | null
          line_total: number | null
          line_type: string
          quantity: number | null
          revenue_account: string | null
          sales_order_item_id: string | null
          sort_order: number | null
          unit: string | null
          unit_price: number | null
          vat_amount: number
          vat_rate: number
          work_type: string | null
        }
        Insert: {
          accrual_balance_account?: string | null
          accrual_period_end?: string | null
          accrual_period_start?: string | null
          apartment_number?: string | null
          article_id?: string | null
          brf_org_number?: string | null
          created_at?: string
          deduction_amount?: number
          deduction_type?: string | null
          description: string
          dimensions?: Json
          discount_percent?: number
          housing_designation?: string | null
          id?: string
          invoice_id: string
          labor_hours?: number | null
          line_total?: number | null
          line_type?: string
          quantity?: number | null
          revenue_account?: string | null
          sales_order_item_id?: string | null
          sort_order?: number | null
          unit?: string | null
          unit_price?: number | null
          vat_amount?: number
          vat_rate?: number
          work_type?: string | null
        }
        Update: {
          accrual_balance_account?: string | null
          accrual_period_end?: string | null
          accrual_period_start?: string | null
          apartment_number?: string | null
          article_id?: string | null
          brf_org_number?: string | null
          created_at?: string
          deduction_amount?: number
          deduction_type?: string | null
          description?: string
          dimensions?: Json
          discount_percent?: number
          housing_designation?: string | null
          id?: string
          invoice_id?: string
          labor_hours?: number | null
          line_total?: number | null
          line_type?: string
          quantity?: number | null
          revenue_account?: string | null
          sales_order_item_id?: string | null
          sort_order?: number | null
          unit?: string | null
          unit_price?: number | null
          vat_amount?: number
          vat_rate?: number
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_sales_order_item_id_fkey"
            columns: ["sales_order_item_id"]
            isOneToOne: false
            referencedRelation: "sales_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payee_defaults: {
        Row: {
          cash_account_id: string
          company_id: string
          created_at: string
          currency: string
          id: string
          updated_at: string
        }
        Insert: {
          cash_account_id: string
          company_id: string
          created_at?: string
          currency: string
          id?: string
          updated_at?: string
        }
        Update: {
          cash_account_id?: string
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payee_defaults_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payee_defaults_same_company"
            columns: ["cash_account_id", "company_id"]
            isOneToOne: false
            referencedRelation: "cash_accounts"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string | null
          exchange_rate: number | null
          exchange_rate_difference: number | null
          id: string
          invoice_id: string
          journal_entry_id: string | null
          notes: string | null
          payment_date: string
          payment_exchange_rate: number | null
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string | null
          exchange_rate?: number | null
          exchange_rate_difference?: number | null
          id?: string
          invoice_id: string
          journal_entry_id?: string | null
          notes?: string | null
          payment_date: string
          payment_exchange_rate?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string | null
          exchange_rate?: number | null
          exchange_rate_difference?: number | null
          id?: string
          invoice_id?: string
          journal_entry_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_exchange_rate?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_reminders: {
        Row: {
          action_token: string
          action_token_used: boolean | null
          company_id: string
          created_at: string
          email_to: string
          fee_journal_entry_id: string | null
          id: string
          interest_amount: number
          interest_days: number | null
          interest_from_date: string | null
          interest_rate: number | null
          invoice_id: string
          reminder_fee: number
          reminder_level: number
          response_at: string | null
          response_type: string | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          action_token?: string
          action_token_used?: boolean | null
          company_id: string
          created_at?: string
          email_to: string
          fee_journal_entry_id?: string | null
          id?: string
          interest_amount?: number
          interest_days?: number | null
          interest_from_date?: string | null
          interest_rate?: number | null
          invoice_id: string
          reminder_fee?: number
          reminder_level: number
          response_at?: string | null
          response_type?: string | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          action_token?: string
          action_token_used?: boolean | null
          company_id?: string
          created_at?: string
          email_to?: string
          fee_journal_entry_id?: string | null
          id?: string
          interest_amount?: number
          interest_days?: number | null
          interest_from_date?: string | null
          interest_rate?: number | null
          invoice_id?: string
          reminder_fee?: number
          reminder_level?: number
          response_at?: string | null
          response_type?: string | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_reminders_fee_journal_entry_id_fkey"
            columns: ["fee_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string
          converted_from_id: string | null
          created_at: string
          creation_complete: boolean
          credited_invoice_id: string | null
          currency: string | null
          customer_id: string | null
          deduction_personnummer_encrypted: string | null
          deduction_personnummer_last4: string | null
          deduction_reclaimed_total: number
          deduction_total: number
          default_dimensions: Json
          delivery_date: string | null
          document_type: string
          due_date: string
          exchange_rate: number | null
          exchange_rate_date: string | null
          external_invoice_number: string | null
          id: string
          invoice_date: string
          invoice_marking: string | null
          invoice_number: string | null
          is_self_billed: boolean
          journal_entry_id: string | null
          moms_ruta: string | null
          notes: string | null
          ore_rounding: boolean | null
          our_reference: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_cash_account_id: string | null
          payment_details: Json | null
          payment_link_auto: boolean
          payment_link_url: string | null
          quote_decided_at: string | null
          quote_status: string | null
          received_date: string | null
          remaining_amount: number
          reverse_charge_text: string | null
          sales_order_id: string | null
          self_billing_agreement_ref: string | null
          status: string | null
          stripe_payment_link_id: string | null
          subtotal: number | null
          subtotal_sek: number | null
          total: number | null
          total_sek: number | null
          updated_at: string
          user_id: string
          valid_until: string | null
          vat_amount: number | null
          vat_amount_sek: number | null
          vat_rate: number | null
          vat_treatment: string | null
          your_reference: string | null
        }
        Insert: {
          company_id: string
          converted_from_id?: string | null
          created_at?: string
          creation_complete?: boolean
          credited_invoice_id?: string | null
          currency?: string | null
          customer_id?: string | null
          deduction_personnummer_encrypted?: string | null
          deduction_personnummer_last4?: string | null
          deduction_reclaimed_total?: number
          deduction_total?: number
          default_dimensions?: Json
          delivery_date?: string | null
          document_type?: string
          due_date: string
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          external_invoice_number?: string | null
          id?: string
          invoice_date: string
          invoice_marking?: string | null
          invoice_number?: string | null
          is_self_billed?: boolean
          journal_entry_id?: string | null
          moms_ruta?: string | null
          notes?: string | null
          ore_rounding?: boolean | null
          our_reference?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_cash_account_id?: string | null
          payment_details?: Json | null
          payment_link_auto?: boolean
          payment_link_url?: string | null
          quote_decided_at?: string | null
          quote_status?: string | null
          received_date?: string | null
          remaining_amount?: number
          reverse_charge_text?: string | null
          sales_order_id?: string | null
          self_billing_agreement_ref?: string | null
          status?: string | null
          stripe_payment_link_id?: string | null
          subtotal?: number | null
          subtotal_sek?: number | null
          total?: number | null
          total_sek?: number | null
          updated_at?: string
          user_id: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_amount_sek?: number | null
          vat_rate?: number | null
          vat_treatment?: string | null
          your_reference?: string | null
        }
        Update: {
          company_id?: string
          converted_from_id?: string | null
          created_at?: string
          creation_complete?: boolean
          credited_invoice_id?: string | null
          currency?: string | null
          customer_id?: string | null
          deduction_personnummer_encrypted?: string | null
          deduction_personnummer_last4?: string | null
          deduction_reclaimed_total?: number
          deduction_total?: number
          default_dimensions?: Json
          delivery_date?: string | null
          document_type?: string
          due_date?: string
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          external_invoice_number?: string | null
          id?: string
          invoice_date?: string
          invoice_marking?: string | null
          invoice_number?: string | null
          is_self_billed?: boolean
          journal_entry_id?: string | null
          moms_ruta?: string | null
          notes?: string | null
          ore_rounding?: boolean | null
          our_reference?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_cash_account_id?: string | null
          payment_details?: Json | null
          payment_link_auto?: boolean
          payment_link_url?: string | null
          quote_decided_at?: string | null
          quote_status?: string | null
          received_date?: string | null
          remaining_amount?: number
          reverse_charge_text?: string | null
          sales_order_id?: string | null
          self_billing_agreement_ref?: string | null
          status?: string | null
          stripe_payment_link_id?: string | null
          subtotal?: number | null
          subtotal_sek?: number | null
          total?: number | null
          total_sek?: number | null
          updated_at?: string
          user_id?: string
          valid_until?: string | null
          vat_amount?: number | null
          vat_amount_sek?: number | null
          vat_rate?: number | null
          vat_treatment?: string | null
          your_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_converted_from_id_fkey"
            columns: ["converted_from_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_credited_invoice_id_fkey"
            columns: ["credited_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_cash_account_same_company"
            columns: ["payment_cash_account_id", "company_id"]
            isOneToOne: false
            referencedRelation: "cash_accounts"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "invoices_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          attachment_urls: string[] | null
          commit_method: string | null
          committed_actor_label: string | null
          committed_actor_type: string | null
          committed_at: string | null
          company_id: string
          correction_of_id: string | null
          created_at: string
          created_via: string
          description: string
          entry_date: string
          fiscal_period_id: string
          id: string
          notes: string | null
          reversed_by_id: string | null
          reverses_id: string | null
          rubric_version: string | null
          source_id: string | null
          source_proposal_id: string | null
          source_type: string
          source_voucher_number: number | null
          source_voucher_series: string | null
          status: string | null
          updated_at: string
          user_id: string
          voucher_number: number
          voucher_series: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          commit_method?: string | null
          committed_actor_label?: string | null
          committed_actor_type?: string | null
          committed_at?: string | null
          company_id: string
          correction_of_id?: string | null
          created_at?: string
          created_via?: string
          description: string
          entry_date: string
          fiscal_period_id: string
          id?: string
          notes?: string | null
          reversed_by_id?: string | null
          reverses_id?: string | null
          rubric_version?: string | null
          source_id?: string | null
          source_proposal_id?: string | null
          source_type: string
          source_voucher_number?: number | null
          source_voucher_series?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          voucher_number: number
          voucher_series?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          commit_method?: string | null
          committed_actor_label?: string | null
          committed_actor_type?: string | null
          committed_at?: string | null
          company_id?: string
          correction_of_id?: string | null
          created_at?: string
          created_via?: string
          description?: string
          entry_date?: string
          fiscal_period_id?: string
          id?: string
          notes?: string | null
          reversed_by_id?: string | null
          reverses_id?: string | null
          rubric_version?: string | null
          source_id?: string | null
          source_proposal_id?: string | null
          source_type?: string
          source_voucher_number?: number | null
          source_voucher_series?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          voucher_number?: number
          voucher_series?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_correction_of_id_fkey"
            columns: ["correction_of_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_reversed_by_id_fkey"
            columns: ["reversed_by_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_reverses_id_fkey"
            columns: ["reverses_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entry_lines: {
        Row: {
          account_id: string | null
          account_number: string
          amount_in_currency: number | null
          cost_center: string | null
          created_at: string
          credit_amount: number | null
          currency: string | null
          debit_amount: number | null
          dimensions: Json
          exchange_rate: number | null
          id: string
          journal_entry_id: string
          line_description: string | null
          project: string | null
          sort_order: number | null
          tax_code: string | null
        }
        Insert: {
          account_id?: string | null
          account_number: string
          amount_in_currency?: number | null
          cost_center?: string | null
          created_at?: string
          credit_amount?: number | null
          currency?: string | null
          debit_amount?: number | null
          dimensions?: Json
          exchange_rate?: number | null
          id?: string
          journal_entry_id: string
          line_description?: string | null
          project?: string | null
          sort_order?: number | null
          tax_code?: string | null
        }
        Update: {
          account_id?: string | null
          account_number?: string
          amount_in_currency?: number | null
          cost_center?: string | null
          created_at?: string
          credit_amount?: number | null
          currency?: string | null
          debit_amount?: number | null
          dimensions?: Json
          exchange_rate?: number | null
          id?: string
          journal_entry_id?: string
          line_description?: string | null
          project?: string | null
          sort_order?: number | null
          tax_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entry_no_doc_required: {
        Row: {
          company_id: string
          created_at: string
          journal_entry_id: string
          reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          journal_entry_id: string
          reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          journal_entry_id?: string
          reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_no_doc_required_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_no_doc_required_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: true
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entry_rattelse_log: {
        Row: {
          actor: string | null
          added_lines: Json | null
          company_id: string
          created_at: string
          external_signature: string | null
          id: string
          journal_entry_id: string
          new_description: string | null
          new_entry_date: string | null
          old_description: string | null
          old_entry_date: string | null
          rattelse_type: string
          sie_import_id: string | null
          source: string
          struck_lines: Json | null
        }
        Insert: {
          actor?: string | null
          added_lines?: Json | null
          company_id: string
          created_at?: string
          external_signature?: string | null
          id?: string
          journal_entry_id: string
          new_description?: string | null
          new_entry_date?: string | null
          old_description?: string | null
          old_entry_date?: string | null
          rattelse_type: string
          sie_import_id?: string | null
          source?: string
          struck_lines?: Json | null
        }
        Update: {
          actor?: string | null
          added_lines?: Json | null
          company_id?: string
          created_at?: string
          external_signature?: string | null
          id?: string
          journal_entry_id?: string
          new_description?: string | null
          new_entry_date?: string | null
          old_description?: string | null
          old_entry_date?: string | null
          rattelse_type?: string
          sie_import_id?: string | null
          source?: string
          struck_lines?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_rattelse_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          content: string
          content_hash: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
          section_title: string | null
          source_file: string
          title: string
        }
        Insert: {
          content: string
          content_hash: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          section_title?: string | null
          source_file: string
          title: string
        }
        Update: {
          content?: string
          content_hash?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          section_title?: string | null
          source_file?: string
          title?: string
        }
        Relationships: []
      }
      mail_connections: {
        Row: {
          access_token_expires_at: string | null
          backfill_completed_at: string | null
          backfill_from: string | null
          company_id: string
          connected_by: string | null
          created_at: string
          email_address: string
          encrypted_access_token: string | null
          encrypted_refresh_token: string
          id: string
          last_error_at: string | null
          last_error_code: string | null
          last_searched_at: string | null
          provider: string
          scope_label: string | null
          scopes: string[]
          status: string
          updated_at: string
        }
        Insert: {
          access_token_expires_at?: string | null
          backfill_completed_at?: string | null
          backfill_from?: string | null
          company_id: string
          connected_by?: string | null
          created_at?: string
          email_address: string
          encrypted_access_token?: string | null
          encrypted_refresh_token: string
          id?: string
          last_error_at?: string | null
          last_error_code?: string | null
          last_searched_at?: string | null
          provider: string
          scope_label?: string | null
          scopes?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          access_token_expires_at?: string | null
          backfill_completed_at?: string | null
          backfill_from?: string | null
          company_id?: string
          connected_by?: string | null
          created_at?: string
          email_address?: string
          encrypted_access_token?: string | null
          encrypted_refresh_token?: string
          id?: string
          last_error_at?: string | null
          last_error_code?: string | null
          last_searched_at?: string | null
          provider?: string
          scope_label?: string | null
          scopes?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mapping_rules: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          capitalization_threshold: number | null
          capitalized_debit_account: string | null
          company_id: string | null
          confidence_score: number | null
          created_at: string
          credit_account: string | null
          debit_account: string | null
          default_private: boolean | null
          description_pattern: string | null
          id: string
          is_active: boolean | null
          mcc_codes: number[] | null
          merchant_pattern: string | null
          priority: number | null
          requires_review: boolean | null
          risk_level: string | null
          rule_name: string
          rule_type: string
          source: string
          template_id: string | null
          updated_at: string
          user_description: string | null
          user_id: string | null
          vat_credit_account: string | null
          vat_debit_account: string | null
          vat_treatment: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          capitalization_threshold?: number | null
          capitalized_debit_account?: string | null
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          credit_account?: string | null
          debit_account?: string | null
          default_private?: boolean | null
          description_pattern?: string | null
          id?: string
          is_active?: boolean | null
          mcc_codes?: number[] | null
          merchant_pattern?: string | null
          priority?: number | null
          requires_review?: boolean | null
          risk_level?: string | null
          rule_name: string
          rule_type: string
          source?: string
          template_id?: string | null
          updated_at?: string
          user_description?: string | null
          user_id?: string | null
          vat_credit_account?: string | null
          vat_debit_account?: string | null
          vat_treatment?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          capitalization_threshold?: number | null
          capitalized_debit_account?: string | null
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          credit_account?: string | null
          debit_account?: string | null
          default_private?: boolean | null
          description_pattern?: string | null
          id?: string
          is_active?: boolean | null
          mcc_codes?: number[] | null
          merchant_pattern?: string | null
          priority?: number | null
          requires_review?: boolean | null
          risk_level?: string | null
          rule_name?: string
          rule_type?: string
          source?: string
          template_id?: string | null
          updated_at?: string
          user_description?: string | null
          user_id?: string | null
          vat_credit_account?: string | null
          vat_debit_account?: string | null
          vat_treatment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mapping_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_tasks: {
        Row: {
          api_key_id: string | null
          company_id: string
          created_at: string
          error: Json | null
          expires_at: string
          id: string
          poll_interval_ms: number
          result: Json | null
          status: string
          status_message: string | null
          tool_name: string
          ttl_ms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_id?: string | null
          company_id: string
          created_at?: string
          error?: Json | null
          expires_at?: string
          id?: string
          poll_interval_ms?: number
          result?: Json | null
          status?: string
          status_message?: string | null
          tool_name: string
          ttl_ms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_id?: string | null
          company_id?: string
          created_at?: string
          error?: Json | null
          expires_at?: string
          id?: string
          poll_interval_ms?: number
          result?: Json | null
          status?: string
          status_message?: string | null
          tool_name?: string
          ttl_ms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      metered_events: {
        Row: {
          attribution: Json
          capability_key: string
          company_id: string
          event_type: string
          id: string
          occurred_at: string
          team_id: string | null
        }
        Insert: {
          attribution?: Json
          capability_key: string
          company_id: string
          event_type: string
          id?: string
          occurred_at?: string
          team_id?: string | null
        }
        Update: {
          attribution?: Json
          capability_key?: string
          company_id?: string
          event_type?: string
          id?: string
          occurred_at?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metered_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metered_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      mileage_trips: {
        Row: {
          company_id: string
          created_at: string
          created_via: string
          distance_km: number
          employee_id: string | null
          from_location: string
          id: string
          is_round_trip: boolean
          journal_entry_id: string | null
          notes: string | null
          odometer_end: number | null
          odometer_start: number | null
          purpose: string
          salary_run_id: string | null
          status: string
          to_location: string
          trip_date: string
          updated_at: string
          user_id: string
          vehicle_registration: string | null
          vehicle_type: string
          visited: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_via?: string
          distance_km: number
          employee_id?: string | null
          from_location: string
          id?: string
          is_round_trip?: boolean
          journal_entry_id?: string | null
          notes?: string | null
          odometer_end?: number | null
          odometer_start?: number | null
          purpose: string
          salary_run_id?: string | null
          status?: string
          to_location: string
          trip_date: string
          updated_at?: string
          user_id: string
          vehicle_registration?: string | null
          vehicle_type?: string
          visited?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_via?: string
          distance_km?: number
          employee_id?: string | null
          from_location?: string
          id?: string
          is_round_trip?: boolean
          journal_entry_id?: string | null
          notes?: string | null
          odometer_end?: number | null
          odometer_start?: number | null
          purpose?: string
          salary_run_id?: string | null
          status?: string
          to_location?: string
          trip_date?: string
          updated_at?: string
          user_id?: string
          vehicle_registration?: string | null
          vehicle_type?: string
          visited?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mileage_trips_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mileage_trips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mileage_trips_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mileage_trips_salary_run_id_fkey"
            columns: ["salary_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      network_peers: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          peer_endpoint_url: string | null
          peer_name: string
          peer_org_number: string
          peer_tenant_id: string | null
          public_key: string | null
          status: Database["public"]["Enums"]["network_peer_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          peer_endpoint_url?: string | null
          peer_name: string
          peer_org_number: string
          peer_tenant_id?: string | null
          public_key?: string | null
          status?: Database["public"]["Enums"]["network_peer_status"]
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          peer_endpoint_url?: string | null
          peer_name?: string
          peer_org_number?: string
          peer_tenant_id?: string | null
          public_key?: string | null
          status?: Database["public"]["Enums"]["network_peer_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notice_dismissals: {
        Row: {
          company_id: string
          dismissed_at: string
          notice_id: string
          user_id: string
        }
        Insert: {
          company_id: string
          dismissed_at?: string
          notice_id: string
          user_id: string
        }
        Update: {
          company_id?: string
          dismissed_at?: string
          notice_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notice_dismissals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_log: {
        Row: {
          company_id: string | null
          days_before: number
          delivery_status: string | null
          id: string
          notification_type: string
          reference_id: string
          sent_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          days_before: number
          delivery_status?: string | null
          id?: string
          notification_type: string
          reference_id: string
          sent_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          days_before?: number
          delivery_status?: string | null
          id?: string
          notification_type?: string
          reference_id?: string
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          email_digest_enabled: boolean
          email_enabled: boolean | null
          id: string
          invoice_reminders_enabled: boolean | null
          invoice_sent_enabled: boolean | null
          missing_underlag_enabled: boolean
          period_locked_enabled: boolean | null
          period_year_closed_enabled: boolean | null
          push_enabled: boolean | null
          quiet_end: string | null
          quiet_start: string | null
          receipt_extracted_enabled: boolean | null
          receipt_matched_enabled: boolean | null
          tax_deadlines_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_digest_enabled?: boolean
          email_enabled?: boolean | null
          id?: string
          invoice_reminders_enabled?: boolean | null
          invoice_sent_enabled?: boolean | null
          missing_underlag_enabled?: boolean
          period_locked_enabled?: boolean | null
          period_year_closed_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_end?: string | null
          quiet_start?: string | null
          receipt_extracted_enabled?: boolean | null
          receipt_matched_enabled?: boolean | null
          tax_deadlines_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_digest_enabled?: boolean
          email_enabled?: boolean | null
          id?: string
          invoice_reminders_enabled?: boolean | null
          invoice_sent_enabled?: boolean | null
          missing_underlag_enabled?: boolean
          period_locked_enabled?: boolean | null
          period_year_closed_enabled?: boolean | null
          push_enabled?: boolean | null
          quiet_end?: string | null
          quiet_start?: string | null
          receipt_extracted_enabled?: boolean | null
          receipt_matched_enabled?: boolean | null
          tax_deadlines_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oauth_client_registrations: {
        Row: {
          client_name: string
          created_at: string
          id: string
          redirect_uri: string
          revoked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_name: string
          created_at?: string
          id?: string
          redirect_uri: string
          revoked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_name?: string
          created_at?: string
          id?: string
          redirect_uri?: string
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oauth_flows: {
        Row: {
          code_verifier: string | null
          company_id: string
          connector_state: string | null
          created_at: string
          expires_at: string
          handoff_code: string | null
          handoff_error: string | null
          handoff_expires_at: string | null
          handoff_id: string | null
          id: string
          kind: string
          origin: string
          redirect_uri: string
          return_to: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_verifier?: string | null
          company_id: string
          connector_state?: string | null
          created_at?: string
          expires_at: string
          handoff_code?: string | null
          handoff_error?: string | null
          handoff_expires_at?: string | null
          handoff_id?: string | null
          id: string
          kind: string
          origin: string
          redirect_uri: string
          return_to?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_verifier?: string | null
          company_id?: string
          connector_state?: string | null
          created_at?: string
          expires_at?: string
          handoff_code?: string | null
          handoff_error?: string | null
          handoff_expires_at?: string | null
          handoff_id?: string | null
          id?: string
          kind?: string
          origin?: string
          redirect_uri?: string
          return_to?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_flows_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_used_codes: {
        Row: {
          code_hash: string
          created_at: string
        }
        Insert: {
          code_hash: string
          created_at?: string
        }
        Update: {
          code_hash?: string
          created_at?: string
        }
        Relationships: []
      }
      operations: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string
          error: Json | null
          id: string
          operation_type: string
          params: Json
          progress: Json
          result: Json | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          operation_type: string
          params?: Json
          progress?: Json
          result?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          operation_type?: string
          params?: Json
          progress?: Json
          result?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      overlay_invoices: {
        Row: {
          created_at: string
          currency: string
          direction: string
          due_date: string
          external_reference: string
          gross_amount: number
          id: string
          issue_date: string
          local_invoice_id: string | null
          net_amount: number
          payload_json: Json | null
          peer_id: string
          state: Database["public"]["Enums"]["overlay_invoice_state"]
          tenant_id: string
          updated_at: string
          vat_amount: number
        }
        Insert: {
          created_at?: string
          currency?: string
          direction: string
          due_date: string
          external_reference: string
          gross_amount: number
          id?: string
          issue_date: string
          local_invoice_id?: string | null
          net_amount: number
          payload_json?: Json | null
          peer_id: string
          state?: Database["public"]["Enums"]["overlay_invoice_state"]
          tenant_id: string
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          created_at?: string
          currency?: string
          direction?: string
          due_date?: string
          external_reference?: string
          gross_amount?: number
          id?: string
          issue_date?: string
          local_invoice_id?: string | null
          net_amount?: number
          payload_json?: Json | null
          peer_id?: string
          state?: Database["public"]["Enums"]["overlay_invoice_state"]
          tenant_id?: string
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "overlay_invoices_peer_id_fkey"
            columns: ["peer_id"]
            isOneToOne: false
            referencedRelation: "network_peers"
            referencedColumns: ["id"]
          },
        ]
      }
      parties: {
        Row: {
          alias_keys: string[]
          archived_at: string | null
          company_id: string
          created_at: string
          display_name: string
          id: string
          kind: string
          legal_name: string | null
          merged_into: string | null
          org_number: string | null
          origin: string
          status: string
          suggested_reason: Json | null
          updated_at: string
          user_id: string
          vat_number: string | null
        }
        Insert: {
          alias_keys?: string[]
          archived_at?: string | null
          company_id: string
          created_at?: string
          display_name: string
          id?: string
          kind?: string
          legal_name?: string | null
          merged_into?: string | null
          org_number?: string | null
          origin?: string
          status?: string
          suggested_reason?: Json | null
          updated_at?: string
          user_id: string
          vat_number?: string | null
        }
        Update: {
          alias_keys?: string[]
          archived_at?: string | null
          company_id?: string
          created_at?: string
          display_name?: string
          id?: string
          kind?: string
          legal_name?: string | null
          merged_into?: string | null
          org_number?: string | null
          origin?: string
          status?: string
          suggested_reason?: Json | null
          updated_at?: string
          user_id?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parties_merged_into_same_company"
            columns: ["merged_into", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      party_decisions: {
        Row: {
          after: Json | null
          before: Json | null
          company_id: string
          created_at: string
          id: string
          kind: string
          note: string | null
          party_id: string
          user_id: string
        }
        Insert: {
          after?: Json | null
          before?: Json | null
          company_id: string
          created_at?: string
          id?: string
          kind: string
          note?: string | null
          party_id: string
          user_id: string
        }
        Update: {
          after?: Json | null
          before?: Json | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: string
          note?: string | null
          party_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_decisions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_decisions_party_same_company"
            columns: ["party_id", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      party_facts: {
        Row: {
          company_id: string
          created_at: string
          deprecated_reason: string | null
          fetched_at: string | null
          field: string
          id: string
          party_id: string
          rank: string
          recorded_at: string
          reference: Json | null
          source: string
          superseded_at: string | null
          updated_at: string
          user_id: string
          valid_from: string | null
          valid_to: string | null
          value: Json
        }
        Insert: {
          company_id: string
          created_at?: string
          deprecated_reason?: string | null
          fetched_at?: string | null
          field: string
          id?: string
          party_id: string
          rank?: string
          recorded_at?: string
          reference?: Json | null
          source: string
          superseded_at?: string | null
          updated_at?: string
          user_id: string
          valid_from?: string | null
          valid_to?: string | null
          value: Json
        }
        Update: {
          company_id?: string
          created_at?: string
          deprecated_reason?: string | null
          fetched_at?: string | null
          field?: string
          id?: string
          party_id?: string
          rank?: string
          recorded_at?: string
          reference?: Json | null
          source?: string
          superseded_at?: string | null
          updated_at?: string
          user_id?: string
          valid_from?: string | null
          valid_to?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "party_facts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_facts_party_same_company"
            columns: ["party_id", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      party_identities: {
        Row: {
          company_id: string
          created_at: string
          first_seen: string | null
          id: string
          last_paid: string | null
          last_seen: string | null
          paid_count: number
          party_id: string
          scheme: string
          seen_count: number
          source: string
          status: string
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          company_id: string
          created_at?: string
          first_seen?: string | null
          id?: string
          last_paid?: string | null
          last_seen?: string | null
          paid_count?: number
          party_id: string
          scheme: string
          seen_count?: number
          source: string
          status?: string
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          company_id?: string
          created_at?: string
          first_seen?: string | null
          id?: string
          last_paid?: string | null
          last_seen?: string | null
          paid_count?: number
          party_id?: string
          scheme?: string
          seen_count?: number
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_identities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "party_identities_party_same_company"
            columns: ["party_id", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      payment_match_log: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          match_confidence: number | null
          match_method: string | null
          new_state: Json | null
          previous_state: Json | null
          supplier_invoice_id: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          match_confidence?: number | null
          match_method?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          supplier_invoice_id?: string | null
          transaction_id: string
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          match_confidence?: number | null
          match_method?: string | null
          new_state?: Json | null
          previous_state?: Json | null
          supplier_invoice_id?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_match_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_match_log_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_match_log_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_match_log_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_operations: {
        Row: {
          actor_id: string | null
          actor_label: string | null
          actor_type: string
          agent_metadata: Json | null
          company_id: string
          created_at: string
          id: string
          operation_type: string
          params: Json
          preview_data: Json
          rejection_category: string | null
          rejection_reason: string | null
          resolved_at: string | null
          result_data: Json | null
          risk_level: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string | null
          actor_type?: string
          agent_metadata?: Json | null
          company_id: string
          created_at?: string
          id?: string
          operation_type: string
          params?: Json
          preview_data?: Json
          rejection_category?: string | null
          rejection_reason?: string | null
          resolved_at?: string | null
          result_data?: Json | null
          risk_level?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          actor_label?: string | null
          actor_type?: string
          agent_metadata?: Json | null
          company_id?: string
          created_at?: string
          id?: string
          operation_type?: string
          params?: Json
          preview_data?: Json
          rejection_category?: string | null
          rejection_reason?: string | null
          resolved_at?: string | null
          result_data?: Json | null
          risk_level?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pending_operations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_access: {
        Row: {
          company_id: string
          created_at: string
          disabled_at: string | null
          enabled_at: string | null
          enabled_by: string | null
          max_sends: number | null
          note: string | null
          receive_enabled: boolean
          request_note: string | null
          requested_at: string | null
          requested_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          disabled_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          max_sends?: number | null
          note?: string | null
          receive_enabled?: boolean
          request_note?: string | null
          requested_at?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          disabled_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          max_sends?: number | null
          note?: string | null
          receive_enabled?: boolean
          request_note?: string | null
          requested_at?: string | null
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "peppol_access_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_deliveries: {
        Row: {
          company_id: string
          created_at: string
          customization_id: string
          evidence_retrieved_at: string | null
          filename: string
          id: string
          idempotency_key: string
          invoice_id: string
          profile_id: string
          provider: string | null
          provider_submission_id: string | null
          provider_tenant_id: string | null
          recipient_identifier: string
          recipient_scheme: string
          retention_expires_at: string
          status: string
          status_at: string
          status_detail: string | null
          submitted_at: string | null
          terminal_at: string | null
          updated_at: string
          user_id: string
          xml_payload: string
          xml_sha256: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customization_id: string
          evidence_retrieved_at?: string | null
          filename: string
          id?: string
          idempotency_key?: string
          invoice_id: string
          profile_id: string
          provider?: string | null
          provider_submission_id?: string | null
          provider_tenant_id?: string | null
          recipient_identifier: string
          recipient_scheme: string
          retention_expires_at: string
          status?: string
          status_at?: string
          status_detail?: string | null
          submitted_at?: string | null
          terminal_at?: string | null
          updated_at?: string
          user_id: string
          xml_payload: string
          xml_sha256: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customization_id?: string
          evidence_retrieved_at?: string | null
          filename?: string
          id?: string
          idempotency_key?: string
          invoice_id?: string
          profile_id?: string
          provider?: string | null
          provider_submission_id?: string | null
          provider_tenant_id?: string | null
          recipient_identifier?: string
          recipient_scheme?: string
          retention_expires_at?: string
          status?: string
          status_at?: string
          status_detail?: string | null
          submitted_at?: string | null
          terminal_at?: string | null
          updated_at?: string
          user_id?: string
          xml_payload?: string
          xml_sha256?: string
        }
        Relationships: [
          {
            foreignKeyName: "peppol_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_deliveries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_delivery_events: {
        Row: {
          company_id: string
          created_at: string
          delivery_id: string
          detail: string | null
          event_sha256: string
          id: string
          is_terminal: boolean
          normalized_status: string
          occurred_at: string
          provider: string | null
          provider_event_code: string
          provider_event_id: string | null
          raw_payload: Json
          received_at: string
          source: string
          verification_method: string
        }
        Insert: {
          company_id: string
          created_at?: string
          delivery_id: string
          detail?: string | null
          event_sha256: string
          id?: string
          is_terminal?: boolean
          normalized_status: string
          occurred_at: string
          provider?: string | null
          provider_event_code: string
          provider_event_id?: string | null
          raw_payload?: Json
          received_at?: string
          source: string
          verification_method: string
        }
        Update: {
          company_id?: string
          created_at?: string
          delivery_id?: string
          detail?: string | null
          event_sha256?: string
          id?: string
          is_terminal?: boolean
          normalized_status?: string
          occurred_at?: string
          provider?: string | null
          provider_event_code?: string
          provider_event_id?: string | null
          raw_payload?: Json
          received_at?: string
          source?: string
          verification_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "peppol_delivery_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_delivery_events_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "peppol_deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_delivery_evidence: {
        Row: {
          company_id: string
          created_at: string
          delivery_id: string
          document_payload: string | null
          document_sha256: string | null
          evidence_payload: Json
          evidence_sha256: string
          evidence_type: string
          id: string
          provider: string
          retrieved_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          delivery_id: string
          document_payload?: string | null
          document_sha256?: string | null
          evidence_payload?: Json
          evidence_sha256: string
          evidence_type: string
          id?: string
          provider: string
          retrieved_at: string
        }
        Update: {
          company_id?: string
          created_at?: string
          delivery_id?: string
          document_payload?: string | null
          document_sha256?: string | null
          evidence_payload?: Json
          evidence_sha256?: string
          evidence_type?: string
          id?: string
          provider?: string
          retrieved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "peppol_delivery_evidence_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_delivery_evidence_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "peppol_deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_inbound_documents: {
        Row: {
          company_id: string | null
          created_at: string
          currency: string | null
          document_id: string | null
          document_type: string
          due_date: string | null
          id: string
          inbox_item_id: string | null
          issue_date: string | null
          last_error: string | null
          payable_amount: number | null
          processed_at: string | null
          provider: string
          provider_document_id: string
          received_at: string
          recipient_identifier: string | null
          recipient_scheme: string | null
          sender_identifier: string | null
          sender_name: string | null
          sender_scheme: string | null
          status: string
          summary: Json
          supplier_invoice_id: string | null
          ubl_json: Json
          updated_at: string
          xml_document_id: string | null
          xml_payload: string | null
          xml_sha256: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          currency?: string | null
          document_id?: string | null
          document_type: string
          due_date?: string | null
          id?: string
          inbox_item_id?: string | null
          issue_date?: string | null
          last_error?: string | null
          payable_amount?: number | null
          processed_at?: string | null
          provider: string
          provider_document_id: string
          received_at?: string
          recipient_identifier?: string | null
          recipient_scheme?: string | null
          sender_identifier?: string | null
          sender_name?: string | null
          sender_scheme?: string | null
          status?: string
          summary?: Json
          supplier_invoice_id?: string | null
          ubl_json?: Json
          updated_at?: string
          xml_document_id?: string | null
          xml_payload?: string | null
          xml_sha256?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          currency?: string | null
          document_id?: string | null
          document_type?: string
          due_date?: string | null
          id?: string
          inbox_item_id?: string | null
          issue_date?: string | null
          last_error?: string | null
          payable_amount?: number | null
          processed_at?: string | null
          provider?: string
          provider_document_id?: string
          received_at?: string
          recipient_identifier?: string | null
          recipient_scheme?: string | null
          sender_identifier?: string | null
          sender_name?: string | null
          sender_scheme?: string | null
          status?: string
          summary?: Json
          supplier_invoice_id?: string | null
          ubl_json?: Json
          updated_at?: string
          xml_document_id?: string | null
          xml_payload?: string | null
          xml_sha256?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peppol_inbound_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_inbound_documents_inbox_item_id_fkey"
            columns: ["inbox_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_inbox_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_inbound_documents_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peppol_inbound_documents_xml_document_id_fkey"
            columns: ["xml_document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      peppol_registrations: {
        Row: {
          business_card: Json
          company_id: string
          created_at: string
          deregistered_at: string | null
          document_types: Json
          id: string
          last_error: string | null
          last_error_code: string | null
          participant_identifier: string
          participant_scheme: string
          provider: string
          provider_account_reference: string | null
          registered_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_card?: Json
          company_id: string
          created_at?: string
          deregistered_at?: string | null
          document_types?: Json
          id?: string
          last_error?: string | null
          last_error_code?: string | null
          participant_identifier: string
          participant_scheme: string
          provider: string
          provider_account_reference?: string | null
          registered_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_card?: Json
          company_id?: string
          created_at?: string
          deregistered_at?: string | null
          document_types?: Json
          id?: string
          last_error?: string | null
          last_error_code?: string | null
          participant_identifier?: string
          participant_scheme?: string
          provider?: string
          provider_account_reference?: string | null
          registered_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peppol_registrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_event_types: {
        Row: {
          event_type: string
        }
        Insert: {
          event_type: string
        }
        Update: {
          event_type?: string
        }
        Relationships: []
      }
      processing_history: {
        Row: {
          actor: Json
          aggregate_id: string
          aggregate_type: string
          appended_at: string
          causation_id: string | null
          company_id: string
          correlation_id: string
          event_id: string
          event_type: string
          occurred_at: string
          payload: Json
          payload_schema_version: number
          rubric_version: string | null
          seq: number
        }
        Insert: {
          actor: Json
          aggregate_id: string
          aggregate_type: string
          appended_at?: string
          causation_id?: string | null
          company_id: string
          correlation_id: string
          event_id?: string
          event_type: string
          occurred_at: string
          payload?: Json
          payload_schema_version?: number
          rubric_version?: string | null
          seq?: number
        }
        Update: {
          actor?: Json
          aggregate_id?: string
          aggregate_type?: string
          appended_at?: string
          causation_id?: string | null
          company_id?: string
          correlation_id?: string
          event_id?: string
          event_type?: string
          occurred_at?: string
          payload?: Json
          payload_schema_version?: number
          rubric_version?: string | null
          seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "processing_history_causation_id_fkey"
            columns: ["causation_id"]
            isOneToOne: false
            referencedRelation: "processing_history"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "processing_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processing_history_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "processing_event_types"
            referencedColumns: ["event_type"]
          },
        ]
      }
      profiles: {
        Row: {
          anonymized_at: string | null
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          anonymized_at?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          anonymized_at?: string | null
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          code: string
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_consent_tokens: {
        Row: {
          access_token: string
          consent_id: string
          created_at: string
          provider: string
          provider_company_id: string | null
          refresh_token: string | null
          scopes: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          consent_id: string
          created_at?: string
          provider: string
          provider_company_id?: string | null
          refresh_token?: string | null
          scopes?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          consent_id?: string
          created_at?: string
          provider?: string
          provider_company_id?: string | null
          refresh_token?: string | null
          scopes?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_consent_tokens_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: true
            referencedRelation: "provider_consents"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_consents: {
        Row: {
          company_id: string
          company_name: string | null
          created_at: string
          etag: string
          expires_at: string | null
          id: string
          name: string
          org_number: string | null
          provider: string | null
          status: number
          updated_at: string
        }
        Insert: {
          company_id: string
          company_name?: string | null
          created_at?: string
          etag?: string
          expires_at?: string | null
          id?: string
          name: string
          org_number?: string | null
          provider?: string | null
          status?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          company_name?: string | null
          created_at?: string
          etag?: string
          expires_at?: string | null
          id?: string
          name?: string
          org_number?: string | null
          provider?: string | null
          status?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_consents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_otc: {
        Row: {
          code: string
          consent_id: string
          expires_at: string
          origin: string | null
          provider_code: string | null
          provider_error: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          consent_id: string
          expires_at: string
          origin?: string | null
          provider_code?: string | null
          provider_error?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          consent_id?: string
          expires_at?: string
          origin?: string | null
          provider_code?: string | null
          provider_error?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_otc_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "provider_consents"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      receipt_line_items: {
        Row: {
          bas_account: string | null
          category: string | null
          created_at: string
          description: string
          extraction_confidence: number | null
          id: string
          is_business: boolean | null
          line_total: number
          quantity: number | null
          receipt_id: string
          sort_order: number | null
          suggested_category: string | null
          unit_price: number | null
          vat_amount: number | null
          vat_rate: number | null
        }
        Insert: {
          bas_account?: string | null
          category?: string | null
          created_at?: string
          description: string
          extraction_confidence?: number | null
          id?: string
          is_business?: boolean | null
          line_total: number
          quantity?: number | null
          receipt_id: string
          sort_order?: number | null
          suggested_category?: string | null
          unit_price?: number | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Update: {
          bas_account?: string | null
          category?: string | null
          created_at?: string
          description?: string
          extraction_confidence?: number | null
          id?: string
          is_business?: boolean | null
          line_total?: number
          quantity?: number | null
          receipt_id?: string
          sort_order?: number | null
          suggested_category?: string | null
          unit_price?: number | null
          vat_amount?: number | null
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_line_items_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          company_id: string
          created_at: string
          currency: string | null
          document_id: string | null
          extraction_confidence: number | null
          id: string
          image_thumbnail_url: string | null
          image_url: string
          is_foreign_merchant: boolean | null
          is_restaurant: boolean | null
          is_systembolaget: boolean | null
          match_confidence: number | null
          matched_transaction_id: string | null
          merchant_name: string | null
          merchant_org_number: string | null
          merchant_vat_number: string | null
          raw_extraction: Json | null
          receipt_date: string | null
          receipt_time: string | null
          representation_persons: number | null
          representation_purpose: string | null
          status: string
          total_amount: number | null
          updated_at: string
          user_id: string
          vat_amount: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          currency?: string | null
          document_id?: string | null
          extraction_confidence?: number | null
          id?: string
          image_thumbnail_url?: string | null
          image_url: string
          is_foreign_merchant?: boolean | null
          is_restaurant?: boolean | null
          is_systembolaget?: boolean | null
          match_confidence?: number | null
          matched_transaction_id?: string | null
          merchant_name?: string | null
          merchant_org_number?: string | null
          merchant_vat_number?: string | null
          raw_extraction?: Json | null
          receipt_date?: string | null
          receipt_time?: string | null
          representation_persons?: number | null
          representation_purpose?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          user_id: string
          vat_amount?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          currency?: string | null
          document_id?: string | null
          extraction_confidence?: number | null
          id?: string
          image_thumbnail_url?: string | null
          image_url?: string
          is_foreign_merchant?: boolean | null
          is_restaurant?: boolean | null
          is_systembolaget?: boolean | null
          match_confidence?: number | null
          matched_transaction_id?: string | null
          merchant_name?: string | null
          merchant_org_number?: string | null
          merchant_vat_number?: string | null
          raw_extraction?: Json | null
          receipt_date?: string | null
          receipt_time?: string | null
          representation_persons?: number | null
          representation_purpose?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_matched_transaction_id_fkey"
            columns: ["matched_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_invoice_schedule_items: {
        Row: {
          created_at: string
          description: string
          dimensions: Json
          id: string
          quantity: number
          schedule_id: string
          sort_order: number
          unit: string
          unit_price: number
          vat_rate: number | null
        }
        Insert: {
          created_at?: string
          description: string
          dimensions?: Json
          id?: string
          quantity: number
          schedule_id: string
          sort_order?: number
          unit?: string
          unit_price: number
          vat_rate?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          dimensions?: Json
          id?: string
          quantity?: number
          schedule_id?: string
          sort_order?: number
          unit?: string
          unit_price?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_invoice_schedule_items_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "recurring_invoice_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_invoice_schedules: {
        Row: {
          auto_send: boolean
          company_id: string
          created_at: string
          currency: string
          customer_id: string
          day_of_month: number
          default_dimensions: Json
          generated_count: number
          id: string
          interval_months: number
          last_invoice_id: string | null
          last_run_at: string | null
          last_run_warning: string | null
          name: string
          next_run_date: string
          notes: string | null
          our_reference: string | null
          payment_terms_days: number
          send_hour: number
          status: string
          updated_at: string
          user_id: string
          your_reference: string | null
        }
        Insert: {
          auto_send?: boolean
          company_id: string
          created_at?: string
          currency?: string
          customer_id: string
          day_of_month: number
          default_dimensions?: Json
          generated_count?: number
          id?: string
          interval_months?: number
          last_invoice_id?: string | null
          last_run_at?: string | null
          last_run_warning?: string | null
          name: string
          next_run_date: string
          notes?: string | null
          our_reference?: string | null
          payment_terms_days?: number
          send_hour?: number
          status?: string
          updated_at?: string
          user_id: string
          your_reference?: string | null
        }
        Update: {
          auto_send?: boolean
          company_id?: string
          created_at?: string
          currency?: string
          customer_id?: string
          day_of_month?: number
          default_dimensions?: Json
          generated_count?: number
          id?: string
          interval_months?: number
          last_invoice_id?: string | null
          last_run_at?: string | null
          last_run_warning?: string | null
          name?: string
          next_run_date?: string
          notes?: string | null
          our_reference?: string | null
          payment_terms_days?: number
          send_hour?: number
          status?: string
          updated_at?: string
          user_id?: string
          your_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_invoice_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoice_schedules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoice_schedules_last_invoice_id_fkey"
            columns: ["last_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      rot_rut_payout_request_items: {
        Row: {
          created_at: string
          decided_amount: number | null
          id: string
          invoice_id: string
          reclaimed_amount: number | null
          request_id: string
          requested_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          decided_amount?: number | null
          id?: string
          invoice_id: string
          reclaimed_amount?: number | null
          request_id: string
          requested_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          decided_amount?: number | null
          id?: string
          invoice_id?: string
          reclaimed_amount?: number | null
          request_id?: string
          requested_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rot_rut_payout_request_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rot_rut_payout_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "rot_rut_payout_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      rot_rut_payout_requests: {
        Row: {
          company_id: string
          created_at: string
          decided_at: string | null
          decided_total: number | null
          deduction_type: string
          file_document_id: string | null
          file_name: string
          id: string
          name: string
          reclaim_journal_entry_id: string | null
          reclaimed_at: string | null
          requested_total: number
          settlement_journal_entry_id: string | null
          skv_referensnummer: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          decided_at?: string | null
          decided_total?: number | null
          deduction_type: string
          file_document_id?: string | null
          file_name: string
          id?: string
          name: string
          reclaim_journal_entry_id?: string | null
          reclaimed_at?: string | null
          requested_total: number
          settlement_journal_entry_id?: string | null
          skv_referensnummer?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          decided_at?: string | null
          decided_total?: number | null
          deduction_type?: string
          file_document_id?: string | null
          file_name?: string
          id?: string
          name?: string
          reclaim_journal_entry_id?: string | null
          reclaimed_at?: string | null
          requested_total?: number
          settlement_journal_entry_id?: string | null
          skv_referensnummer?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rot_rut_payout_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rot_rut_payout_requests_file_document_id_fkey"
            columns: ["file_document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rot_rut_payout_requests_reclaim_journal_entry_id_fkey"
            columns: ["reclaim_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rot_rut_payout_requests_settlement_journal_entry_id_fkey"
            columns: ["settlement_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_absence_days: {
        Row: {
          absence_date: string
          absence_type: string
          company_id: string
          created_at: string
          employee_id: string
          franvaro_specifikationsnummer: number | null
          hours: number
          id: string
          notes: string | null
          salary_run_employee_id: string | null
          updated_at: string
        }
        Insert: {
          absence_date: string
          absence_type: string
          company_id: string
          created_at?: string
          employee_id: string
          franvaro_specifikationsnummer?: number | null
          hours?: number
          id?: string
          notes?: string | null
          salary_run_employee_id?: string | null
          updated_at?: string
        }
        Update: {
          absence_date?: string
          absence_type?: string
          company_id?: string
          created_at?: string
          employee_id?: string
          franvaro_specifikationsnummer?: number | null
          hours?: number
          id?: string
          notes?: string | null
          salary_run_employee_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_absence_days_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_absence_days_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_absence_days_salary_run_employee_id_fkey"
            columns: ["salary_run_employee_id"]
            isOneToOne: false
            referencedRelation: "salary_run_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_absence_franvaro_audit: {
        Row: {
          absence_date: string
          absence_day_id: string
          assigned_at: string
          employee_id: string
          id: string
          new_specifikationsnummer: number
          old_specifikationsnummer: number | null
          trigger_op: string
          year_month: string
        }
        Insert: {
          absence_date: string
          absence_day_id: string
          assigned_at?: string
          employee_id: string
          id?: string
          new_specifikationsnummer: number
          old_specifikationsnummer?: number | null
          trigger_op: string
          year_month: string
        }
        Update: {
          absence_date?: string
          absence_day_id?: string
          assigned_at?: string
          employee_id?: string
          id?: string
          new_specifikationsnummer?: number
          old_specifikationsnummer?: number | null
          trigger_op?: string
          year_month?: string
        }
        Relationships: []
      }
      salary_line_items: {
        Row: {
          account_number: string | null
          amount: number
          company_id: string
          created_at: string
          description: string
          id: string
          is_avgift_basis: boolean
          is_gross_deduction: boolean
          is_net_deduction: boolean
          is_taxable: boolean
          is_vacation_basis: boolean
          item_type: string
          quantity: number | null
          salary_run_employee_id: string
          sort_order: number
          source_benefit_id: string | null
          source_expense_claim_id: string | null
          source_recurring_line_id: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          amount: number
          company_id: string
          created_at?: string
          description: string
          id?: string
          is_avgift_basis?: boolean
          is_gross_deduction?: boolean
          is_net_deduction?: boolean
          is_taxable?: boolean
          is_vacation_basis?: boolean
          item_type: string
          quantity?: number | null
          salary_run_employee_id: string
          sort_order?: number
          source_benefit_id?: string | null
          source_expense_claim_id?: string | null
          source_recurring_line_id?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          amount?: number
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          is_avgift_basis?: boolean
          is_gross_deduction?: boolean
          is_net_deduction?: boolean
          is_taxable?: boolean
          is_vacation_basis?: boolean
          item_type?: string
          quantity?: number | null
          salary_run_employee_id?: string
          sort_order?: number
          source_benefit_id?: string | null
          source_expense_claim_id?: string | null
          source_recurring_line_id?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_line_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_line_items_salary_run_employee_id_fkey"
            columns: ["salary_run_employee_id"]
            isOneToOne: false
            referencedRelation: "salary_run_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_line_items_source_benefit_id_fkey"
            columns: ["source_benefit_id"]
            isOneToOne: false
            referencedRelation: "employee_benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_line_items_source_expense_claim_fkey"
            columns: ["source_expense_claim_id", "company_id"]
            isOneToOne: false
            referencedRelation: "expense_claims"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "salary_line_items_source_recurring_line_id_fkey"
            columns: ["source_recurring_line_id"]
            isOneToOne: false
            referencedRelation: "employee_recurring_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_payroll_config: {
        Row: {
          avgifter_alderspension: number
          avgifter_allman_loneavgift: number
          avgifter_arbetsmarknad: number
          avgifter_arbetsskada: number
          avgifter_efterlevandepension: number
          avgifter_foraldraforsakring: number
          avgifter_minimum_annual: number
          avgifter_reduced_65plus: number
          avgifter_sjukforsakring: number
          avgifter_total: number
          avgifter_vaxa_stod_cap: number | null
          avgifter_vaxa_stod_rate: number | null
          avgifter_youth_rate: number | null
          avgifter_youth_salary_cap: number | null
          bilforman_slr: number
          config_year: number
          created_at: string
          egenavgifter_total: number
          friskvard_cap: number
          id: string
          inkomstbasbelopp: number
          karensavdrag_factor: number
          kostforman_frukost: number
          kostforman_heldag: number
          kostforman_lunch: number
          max_karensavdrag_per_year: number
          max_pgi: number
          milersattning_egen_bil: number
          milersattning_formansbil_el: number
          milersattning_formansbil_fossil: number
          prisbasbelopp: number
          reduced_avgift_age: number
          sgi_ceiling: number
          sjuklon_rate: number
          slp_rate: number
          statlig_skatt_brytpunkt: number
          traktamente_halvdag: number
          traktamente_heldag: number
          traktamente_natt: number
        }
        Insert: {
          avgifter_alderspension: number
          avgifter_allman_loneavgift: number
          avgifter_arbetsmarknad: number
          avgifter_arbetsskada: number
          avgifter_efterlevandepension: number
          avgifter_foraldraforsakring: number
          avgifter_minimum_annual: number
          avgifter_reduced_65plus: number
          avgifter_sjukforsakring: number
          avgifter_total: number
          avgifter_vaxa_stod_cap?: number | null
          avgifter_vaxa_stod_rate?: number | null
          avgifter_youth_rate?: number | null
          avgifter_youth_salary_cap?: number | null
          bilforman_slr: number
          config_year: number
          created_at?: string
          egenavgifter_total: number
          friskvard_cap: number
          id?: string
          inkomstbasbelopp: number
          karensavdrag_factor?: number
          kostforman_frukost: number
          kostforman_heldag: number
          kostforman_lunch: number
          max_karensavdrag_per_year?: number
          max_pgi: number
          milersattning_egen_bil: number
          milersattning_formansbil_el: number
          milersattning_formansbil_fossil: number
          prisbasbelopp: number
          reduced_avgift_age: number
          sgi_ceiling: number
          sjuklon_rate?: number
          slp_rate: number
          statlig_skatt_brytpunkt: number
          traktamente_halvdag: number
          traktamente_heldag: number
          traktamente_natt: number
        }
        Update: {
          avgifter_alderspension?: number
          avgifter_allman_loneavgift?: number
          avgifter_arbetsmarknad?: number
          avgifter_arbetsskada?: number
          avgifter_efterlevandepension?: number
          avgifter_foraldraforsakring?: number
          avgifter_minimum_annual?: number
          avgifter_reduced_65plus?: number
          avgifter_sjukforsakring?: number
          avgifter_total?: number
          avgifter_vaxa_stod_cap?: number | null
          avgifter_vaxa_stod_rate?: number | null
          avgifter_youth_rate?: number | null
          avgifter_youth_salary_cap?: number | null
          bilforman_slr?: number
          config_year?: number
          created_at?: string
          egenavgifter_total?: number
          friskvard_cap?: number
          id?: string
          inkomstbasbelopp?: number
          karensavdrag_factor?: number
          kostforman_frukost?: number
          kostforman_heldag?: number
          kostforman_lunch?: number
          max_karensavdrag_per_year?: number
          max_pgi?: number
          milersattning_egen_bil?: number
          milersattning_formansbil_el?: number
          milersattning_formansbil_fossil?: number
          prisbasbelopp?: number
          reduced_avgift_age?: number
          sgi_ceiling?: number
          sjuklon_rate?: number
          slp_rate?: number
          statlig_skatt_brytpunkt?: number
          traktamente_halvdag?: number
          traktamente_heldag?: number
          traktamente_natt?: number
        }
        Relationships: []
      }
      salary_payslip_deliveries: {
        Row: {
          bounced_at: string | null
          company_id: string
          complained_at: string | null
          created_at: string
          delivered_at: string | null
          email_address: string
          employee_id: string
          error_message: string | null
          id: string
          provider: string
          provider_event: Json | null
          provider_message_id: string | null
          salary_run_id: string
          sent_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bounced_at?: string | null
          company_id: string
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email_address: string
          employee_id: string
          error_message?: string | null
          id?: string
          provider?: string
          provider_event?: Json | null
          provider_message_id?: string | null
          salary_run_id: string
          sent_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bounced_at?: string | null
          company_id?: string
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          email_address?: string
          employee_id?: string
          error_message?: string | null
          id?: string
          provider?: string
          provider_event?: Json | null
          provider_message_id?: string | null
          salary_run_id?: string
          sent_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_payslip_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payslip_deliveries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payslip_deliveries_salary_run_id_fkey"
            columns: ["salary_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_payslip_links: {
        Row: {
          access_count: number
          company_id: string
          created_at: string
          employee_id: string
          expires_at: string
          id: string
          last_accessed_at: string | null
          revoked_at: string | null
          salary_run_id: string
          token_hash: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_count?: number
          company_id: string
          created_at?: string
          employee_id: string
          expires_at: string
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          salary_run_id: string
          token_hash: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_count?: number
          company_id?: string
          created_at?: string
          employee_id?: string
          expires_at?: string
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          salary_run_id?: string
          token_hash?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_payslip_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payslip_links_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_payslip_links_salary_run_id_fkey"
            columns: ["salary_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_run_employees: {
        Row: {
          avgifter_amount: number
          avgifter_amount_override: number | null
          avgifter_basis: number
          avgifter_basis_override: number | null
          avgifter_category: string | null
          avgifter_rate: number
          benefit_values: number
          benefits_adjusted: boolean
          calculation_breakdown: Json | null
          company_id: string
          created_at: string
          employee_id: string
          employment_degree: number
          gross_deductions: number
          gross_salary: number
          hours_worked: number | null
          id: string
          monthly_salary: number
          net_deductions: number
          net_salary: number
          override_reason: string | null
          parental_days: number
          removed_from_agi: boolean
          salary_run_id: string
          salary_type: string
          sick_days: number
          tax_column: number | null
          tax_table_number: number | null
          tax_table_year: number | null
          tax_withheld: number
          tax_withheld_override: number | null
          taxable_income: number
          updated_at: string
          vab_days: number
          vacation_accrual: number
          vacation_accrual_avgifter: number
          vacation_days_taken: number
          ytd_gross: number
          ytd_net: number
          ytd_tax: number
        }
        Insert: {
          avgifter_amount?: number
          avgifter_amount_override?: number | null
          avgifter_basis?: number
          avgifter_basis_override?: number | null
          avgifter_category?: string | null
          avgifter_rate?: number
          benefit_values?: number
          benefits_adjusted?: boolean
          calculation_breakdown?: Json | null
          company_id: string
          created_at?: string
          employee_id: string
          employment_degree: number
          gross_deductions?: number
          gross_salary?: number
          hours_worked?: number | null
          id?: string
          monthly_salary: number
          net_deductions?: number
          net_salary?: number
          override_reason?: string | null
          parental_days?: number
          removed_from_agi?: boolean
          salary_run_id: string
          salary_type: string
          sick_days?: number
          tax_column?: number | null
          tax_table_number?: number | null
          tax_table_year?: number | null
          tax_withheld?: number
          tax_withheld_override?: number | null
          taxable_income?: number
          updated_at?: string
          vab_days?: number
          vacation_accrual?: number
          vacation_accrual_avgifter?: number
          vacation_days_taken?: number
          ytd_gross?: number
          ytd_net?: number
          ytd_tax?: number
        }
        Update: {
          avgifter_amount?: number
          avgifter_amount_override?: number | null
          avgifter_basis?: number
          avgifter_basis_override?: number | null
          avgifter_category?: string | null
          avgifter_rate?: number
          benefit_values?: number
          benefits_adjusted?: boolean
          calculation_breakdown?: Json | null
          company_id?: string
          created_at?: string
          employee_id?: string
          employment_degree?: number
          gross_deductions?: number
          gross_salary?: number
          hours_worked?: number | null
          id?: string
          monthly_salary?: number
          net_deductions?: number
          net_salary?: number
          override_reason?: string | null
          parental_days?: number
          removed_from_agi?: boolean
          salary_run_id?: string
          salary_type?: string
          sick_days?: number
          tax_column?: number | null
          tax_table_number?: number | null
          tax_table_year?: number | null
          tax_withheld?: number
          tax_withheld_override?: number | null
          taxable_income?: number
          updated_at?: string
          vab_days?: number
          vacation_accrual?: number
          vacation_accrual_avgifter?: number
          vacation_days_taken?: number
          ytd_gross?: number
          ytd_net?: number
          ytd_tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "salary_run_employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_run_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_run_employees_salary_run_id_fkey"
            columns: ["salary_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_runs: {
        Row: {
          agi_generated_at: string | null
          agi_submitted_at: string | null
          approved_at: string | null
          approved_by: string | null
          avgifter_entry_id: string | null
          booked_at: string | null
          booked_by: string | null
          calculation_params: Json | null
          company_id: string
          corrects_run_id: string | null
          created_at: string
          id: string
          is_correction: boolean
          notes: string | null
          paid_at: string | null
          payment_date: string
          payment_file_format: string | null
          payment_file_generated_at: string | null
          pension_entry_id: string | null
          period_month: number
          period_year: number
          salary_entry_id: string | null
          status: string
          total_avgifter: number
          total_employer_cost: number
          total_gross: number
          total_net: number
          total_tax: number
          total_vacation_accrual: number
          updated_at: string
          user_id: string
          vacation_entry_id: string | null
          voucher_series: string
        }
        Insert: {
          agi_generated_at?: string | null
          agi_submitted_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          avgifter_entry_id?: string | null
          booked_at?: string | null
          booked_by?: string | null
          calculation_params?: Json | null
          company_id: string
          corrects_run_id?: string | null
          created_at?: string
          id?: string
          is_correction?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_date: string
          payment_file_format?: string | null
          payment_file_generated_at?: string | null
          pension_entry_id?: string | null
          period_month: number
          period_year: number
          salary_entry_id?: string | null
          status?: string
          total_avgifter?: number
          total_employer_cost?: number
          total_gross?: number
          total_net?: number
          total_tax?: number
          total_vacation_accrual?: number
          updated_at?: string
          user_id: string
          vacation_entry_id?: string | null
          voucher_series?: string
        }
        Update: {
          agi_generated_at?: string | null
          agi_submitted_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          avgifter_entry_id?: string | null
          booked_at?: string | null
          booked_by?: string | null
          calculation_params?: Json | null
          company_id?: string
          corrects_run_id?: string | null
          created_at?: string
          id?: string
          is_correction?: boolean
          notes?: string | null
          paid_at?: string | null
          payment_date?: string
          payment_file_format?: string | null
          payment_file_generated_at?: string | null
          pension_entry_id?: string | null
          period_month?: number
          period_year?: number
          salary_entry_id?: string | null
          status?: string
          total_avgifter?: number
          total_employer_cost?: number
          total_gross?: number
          total_net?: number
          total_tax?: number
          total_vacation_accrual?: number
          updated_at?: string
          user_id?: string
          vacation_entry_id?: string | null
          voucher_series?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_runs_avgifter_entry_id_fkey"
            columns: ["avgifter_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_runs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_runs_corrects_run_id_fkey"
            columns: ["corrects_run_id"]
            isOneToOne: false
            referencedRelation: "salary_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_runs_pension_entry_id_fkey"
            columns: ["pension_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_runs_salary_entry_id_fkey"
            columns: ["salary_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_runs_vacation_entry_id_fkey"
            columns: ["vacation_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_worked_days: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          end_time: string | null
          hours: number
          id: string
          notes: string | null
          salary_run_employee_id: string | null
          start_time: string | null
          updated_at: string
          work_date: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          end_time?: string | null
          hours?: number
          id?: string
          notes?: string | null
          salary_run_employee_id?: string | null
          start_time?: string | null
          updated_at?: string
          work_date: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          end_time?: string | null
          hours?: number
          id?: string
          notes?: string | null
          salary_run_employee_id?: string | null
          start_time?: string | null
          updated_at?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_worked_days_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_worked_days_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_worked_days_salary_run_employee_id_fkey"
            columns: ["salary_run_employee_id"]
            isOneToOne: false
            referencedRelation: "salary_run_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_items: {
        Row: {
          article_id: string | null
          company_id: string
          created_at: string
          delivered_qty: number
          description: string
          dimensions: Json
          discount_percent: number
          id: string
          last_delivery_date: string | null
          line_total: number
          line_type: string
          quantity: number
          revenue_account: string | null
          sales_order_id: string
          sort_order: number
          unit: string
          unit_price: number
          updated_at: string
          vat_rate: number
        }
        Insert: {
          article_id?: string | null
          company_id: string
          created_at?: string
          delivered_qty?: number
          description?: string
          dimensions?: Json
          discount_percent?: number
          id?: string
          last_delivery_date?: string | null
          line_total?: number
          line_type?: string
          quantity?: number
          revenue_account?: string | null
          sales_order_id: string
          sort_order?: number
          unit?: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
        }
        Update: {
          article_id?: string | null
          company_id?: string
          created_at?: string
          delivered_qty?: number
          description?: string
          dimensions?: Json
          discount_percent?: number
          id?: string
          last_delivery_date?: string | null
          line_total?: number
          line_type?: string
          quantity?: number
          revenue_account?: string | null
          sales_order_id?: string
          sort_order?: number
          unit?: string
          unit_price?: number
          updated_at?: string
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_items_order_company_fkey"
            columns: ["sales_order_id", "company_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "sales_order_items_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          cancelled_at: string | null
          company_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          currency: string
          customer_id: string | null
          customer_type_snapshot: string | null
          customer_vat_validated_snapshot: boolean | null
          default_dimensions: Json
          id: string
          last_delivery_date: string | null
          notes: string | null
          order_date: string
          order_number: string | null
          our_reference: string | null
          requested_delivery_date: string | null
          source_invoice_id: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
          vat_amount: number
          your_reference: string | null
        }
        Insert: {
          cancelled_at?: string | null
          company_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_type_snapshot?: string | null
          customer_vat_validated_snapshot?: boolean | null
          default_dimensions?: Json
          id?: string
          last_delivery_date?: string | null
          notes?: string | null
          order_date?: string
          order_number?: string | null
          our_reference?: string | null
          requested_delivery_date?: string | null
          source_invoice_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id: string
          vat_amount?: number
          your_reference?: string | null
        }
        Update: {
          cancelled_at?: string | null
          company_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_type_snapshot?: string | null
          customer_vat_validated_snapshot?: boolean | null
          default_dimensions?: Json
          id?: string
          last_delivery_date?: string | null
          notes?: string | null
          order_date?: string
          order_number?: string | null
          our_reference?: string | null
          requested_delivery_date?: string | null
          source_invoice_id?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
          vat_amount?: number
          your_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_source_invoice_id_fkey"
            columns: ["source_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sandbox_seed_attempts: {
        Row: {
          attempt_id: string
          company_id: string | null
          completed_at: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_id?: string
          company_id?: string | null
          completed_at?: string | null
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          company_id?: string | null
          completed_at?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sandbox_seed_attempts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_batch_items: {
        Row: {
          applied_amount: number
          created_at: string
          id: string
          overlay_invoice_id: string
          settlement_batch_id: string
        }
        Insert: {
          applied_amount: number
          created_at?: string
          id?: string
          overlay_invoice_id: string
          settlement_batch_id: string
        }
        Update: {
          applied_amount?: number
          created_at?: string
          id?: string
          overlay_invoice_id?: string
          settlement_batch_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_batch_items_overlay_invoice_id_fkey"
            columns: ["overlay_invoice_id"]
            isOneToOne: false
            referencedRelation: "overlay_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlement_batch_items_settlement_batch_id_fkey"
            columns: ["settlement_batch_id"]
            isOneToOne: false
            referencedRelation: "settlement_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_batches: {
        Row: {
          batch_reference: string
          cleared_at: string | null
          cleared_voucher_id: string | null
          created_at: string
          currency: string
          id: string
          net_settlement_amount: number
          peer_id: string
          settled_at: string | null
          status: Database["public"]["Enums"]["settlement_batch_status"]
          tenant_id: string
          total_ap_offset: number
          total_ar_offset: number
          updated_at: string
        }
        Insert: {
          batch_reference: string
          cleared_at?: string | null
          cleared_voucher_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          net_settlement_amount: number
          peer_id: string
          settled_at?: string | null
          status?: Database["public"]["Enums"]["settlement_batch_status"]
          tenant_id: string
          total_ap_offset?: number
          total_ar_offset?: number
          updated_at?: string
        }
        Update: {
          batch_reference?: string
          cleared_at?: string | null
          cleared_voucher_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          net_settlement_amount?: number
          peer_id?: string
          settled_at?: string | null
          status?: Database["public"]["Enums"]["settlement_batch_status"]
          tenant_id?: string
          total_ap_offset?: number
          total_ar_offset?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_batches_peer_id_fkey"
            columns: ["peer_id"]
            isOneToOne: false
            referencedRelation: "network_peers"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_premium_rules: {
        Row: {
          applies_to_all_employees: boolean
          applies_to_employee_ids: string[]
          company_id: string
          created_at: string
          created_by: string | null
          day_of_week: number[]
          end_time: string
          id: string
          is_active: boolean
          item_type: string
          name: string
          premium_percent: number
          priority: number
          start_time: string
          updated_at: string
        }
        Insert: {
          applies_to_all_employees?: boolean
          applies_to_employee_ids?: string[]
          company_id: string
          created_at?: string
          created_by?: string | null
          day_of_week: number[]
          end_time: string
          id?: string
          is_active?: boolean
          item_type: string
          name: string
          premium_percent: number
          priority?: number
          start_time: string
          updated_at?: string
        }
        Update: {
          applies_to_all_employees?: boolean
          applies_to_employee_ids?: string[]
          company_id?: string
          created_at?: string
          created_by?: string | null
          day_of_week?: number[]
          end_time?: string
          id?: string
          is_active?: boolean
          item_type?: string
          name?: string
          premium_percent?: number
          priority?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_premium_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_connections: {
        Row: {
          client_id_encrypted: string | null
          client_secret_encrypted: string | null
          company_id: string
          connected_at: string | null
          created_at: string
          currency: string | null
          disconnected_at: string | null
          error_message: string | null
          id: string
          last_order_synced_at: string | null
          shop_domain: string
          shop_name: string | null
          status: string
          transaction_sync_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id_encrypted?: string | null
          client_secret_encrypted?: string | null
          company_id: string
          connected_at?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          last_order_synced_at?: string | null
          shop_domain: string
          shop_name?: string | null
          status?: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id_encrypted?: string | null
          client_secret_encrypted?: string | null
          company_id?: string
          connected_at?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          last_order_synced_at?: string | null
          shop_domain?: string
          shop_name?: string | null
          status?: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopify_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sie_account_mappings: {
        Row: {
          company_id: string
          confidence: number | null
          created_at: string
          id: string
          match_type: string | null
          source_account: string
          source_name: string | null
          target_account: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          match_type?: string | null
          source_account: string
          source_name?: string | null
          target_account: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          match_type?: string | null
          source_account?: string
          source_name?: string | null
          target_account?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sie_account_mappings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sie_imports: {
        Row: {
          accounts_count: number | null
          company_id: string
          company_name: string | null
          created_at: string
          error_message: string | null
          file_hash: string
          file_storage_path: string | null
          filename: string
          fiscal_period_id: string | null
          fiscal_year_end: string | null
          fiscal_year_start: string | null
          id: string
          imported_at: string | null
          migration_documentation: Json | null
          opening_balance_entry_id: string | null
          opening_balance_total: number | null
          org_number: string | null
          replaced_at: string | null
          sie_type: number
          status: string | null
          transactions_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accounts_count?: number | null
          company_id: string
          company_name?: string | null
          created_at?: string
          error_message?: string | null
          file_hash: string
          file_storage_path?: string | null
          filename: string
          fiscal_period_id?: string | null
          fiscal_year_end?: string | null
          fiscal_year_start?: string | null
          id?: string
          imported_at?: string | null
          migration_documentation?: Json | null
          opening_balance_entry_id?: string | null
          opening_balance_total?: number | null
          org_number?: string | null
          replaced_at?: string | null
          sie_type: number
          status?: string | null
          transactions_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accounts_count?: number | null
          company_id?: string
          company_name?: string | null
          created_at?: string
          error_message?: string | null
          file_hash?: string
          file_storage_path?: string | null
          filename?: string
          fiscal_period_id?: string | null
          fiscal_year_end?: string | null
          fiscal_year_start?: string | null
          id?: string
          imported_at?: string | null
          migration_documentation?: Json | null
          opening_balance_entry_id?: string | null
          opening_balance_total?: number | null
          org_number?: string | null
          replaced_at?: string | null
          sie_type?: number
          status?: string | null
          transactions_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sie_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sie_imports_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sie_imports_opening_balance_entry_id_fkey"
            columns: ["opening_balance_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      skattekonto_file_imports: {
        Row: {
          closing_saldo: number | null
          company_id: string
          created_at: string
          date_from: string | null
          date_to: string | null
          duplicate_count: number
          error_message: string | null
          file_hash: string
          file_variant: string
          filename: string
          id: string
          imported_count: number
          promoted_count: number
          row_count: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          closing_saldo?: number | null
          company_id: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duplicate_count?: number
          error_message?: string | null
          file_hash: string
          file_variant: string
          filename: string
          id?: string
          imported_count?: number
          promoted_count?: number
          row_count?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          closing_saldo?: number | null
          company_id?: string
          created_at?: string
          date_from?: string | null
          date_to?: string | null
          duplicate_count?: number
          error_message?: string | null
          file_hash?: string
          file_variant?: string
          filename?: string
          id?: string
          imported_count?: number
          promoted_count?: number
          row_count?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skattekonto_file_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      skattekonto_rules: {
        Row: {
          active: boolean
          amount_max: number | null
          amount_min: number | null
          company_id: string | null
          company_type: string
          counter_account: string
          counter_account_ef: string | null
          created_at: string
          id: string
          label: string | null
          pattern: string
          priority: number
          requires_employer: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount_max?: number | null
          amount_min?: number | null
          company_id?: string | null
          company_type?: string
          counter_account: string
          counter_account_ef?: string | null
          created_at?: string
          id?: string
          label?: string | null
          pattern: string
          priority: number
          requires_employer?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount_max?: number | null
          amount_min?: number | null
          company_id?: string | null
          company_type?: string
          counter_account?: string
          counter_account_ef?: string | null
          created_at?: string
          id?: string
          label?: string | null
          pattern?: string
          priority?: number
          requires_employer?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skattekonto_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      skattekonto_transactions: {
        Row: {
          belopp_kronofogden: number | null
          belopp_skatteverket: number
          company_id: string
          dedup_key: string
          file_import_id: string | null
          forfallodatum: string | null
          id: string
          imported_at: string
          is_ignored: boolean
          journal_entry_id: string | null
          ranteberakningsdatum: string | null
          source: string
          status: string
          suggested_at: string | null
          suggested_journal_entry_id: string | null
          transaktionsdatum: string
          transaktionsidentitet: number | null
          transaktionstext: string
          updated_at: string
        }
        Insert: {
          belopp_kronofogden?: number | null
          belopp_skatteverket: number
          company_id: string
          dedup_key: string
          file_import_id?: string | null
          forfallodatum?: string | null
          id?: string
          imported_at?: string
          is_ignored?: boolean
          journal_entry_id?: string | null
          ranteberakningsdatum?: string | null
          source?: string
          status: string
          suggested_at?: string | null
          suggested_journal_entry_id?: string | null
          transaktionsdatum: string
          transaktionsidentitet?: number | null
          transaktionstext: string
          updated_at?: string
        }
        Update: {
          belopp_kronofogden?: number | null
          belopp_skatteverket?: number
          company_id?: string
          dedup_key?: string
          file_import_id?: string | null
          forfallodatum?: string | null
          id?: string
          imported_at?: string
          is_ignored?: boolean
          journal_entry_id?: string | null
          ranteberakningsdatum?: string | null
          source?: string
          status?: string
          suggested_at?: string | null
          suggested_journal_entry_id?: string | null
          transaktionsdatum?: string
          transaktionsidentitet?: number | null
          transaktionstext?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skattekonto_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skattekonto_transactions_file_import_id_fkey"
            columns: ["file_import_id"]
            isOneToOne: false
            referencedRelation: "skattekonto_file_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skattekonto_transactions_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skattekonto_transactions_suggested_journal_entry_id_fkey"
            columns: ["suggested_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      skatteverket_api_audit_log: {
        Row: {
          ag_registered_id: string | null
          company_id: string
          correlation_id: string | null
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          outcome: string
          redovisningsperiod: string | null
          request_size_bytes: number | null
          response_status: number | null
          skv_status: string | null
          user_id: string
        }
        Insert: {
          ag_registered_id?: string | null
          company_id: string
          correlation_id?: string | null
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          outcome: string
          redovisningsperiod?: string | null
          request_size_bytes?: number | null
          response_status?: number | null
          skv_status?: string | null
          user_id: string
        }
        Update: {
          ag_registered_id?: string | null
          company_id?: string
          correlation_id?: string | null
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          outcome?: string
          redovisningsperiod?: string | null
          request_size_bytes?: number | null
          response_status?: number | null
          skv_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skatteverket_api_audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      skatteverket_company_connections: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          environment: string
          id: string
          lasombud_checked_at: string | null
          lasombud_status: string
          last_error: string | null
          last_probe_at: string | null
          last_probe_detail: Json | null
          moms_ombud_checked_at: string | null
          moms_ombud_status: string
          org_number: string
          status: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          environment: string
          id?: string
          lasombud_checked_at?: string | null
          lasombud_status?: string
          last_error?: string | null
          last_probe_at?: string | null
          last_probe_detail?: Json | null
          moms_ombud_checked_at?: string | null
          moms_ombud_status?: string
          org_number: string
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          environment?: string
          id?: string
          lasombud_checked_at?: string | null
          lasombud_status?: string
          last_error?: string | null
          last_probe_at?: string | null
          last_probe_detail?: Json | null
          moms_ombud_checked_at?: string | null
          moms_ombud_status?: string
          org_number?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skatteverket_company_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      skatteverket_tokens: {
        Row: {
          access_token: string
          company_id: string
          created_at: string
          expires_at: string
          id: string
          last_error_at: string | null
          last_error_code: string | null
          refresh_count: number
          refresh_token: string | null
          scope: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          company_id: string
          created_at?: string
          expires_at: string
          id?: string
          last_error_at?: string | null
          last_error_code?: string | null
          refresh_count?: number
          refresh_token?: string | null
          scope?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          company_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_error_at?: string | null
          last_error_code?: string | null
          refresh_count?: number
          refresh_token?: string | null
          scope?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skatteverket_tokens_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_connections: {
        Row: {
          company_id: string
          connected_at: string | null
          created_at: string
          disconnected_at: string | null
          display_name: string | null
          error_message: string | null
          id: string
          last_balance_txn_synced_at: string | null
          last_event_created_at: string | null
          last_event_id: string | null
          livemode: boolean
          oauth_state: string | null
          status: string
          stripe_account_id: string | null
          transaction_sync_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          display_name?: string | null
          error_message?: string | null
          id?: string
          last_balance_txn_synced_at?: string | null
          last_event_created_at?: string | null
          last_event_id?: string | null
          livemode?: boolean
          oauth_state?: string | null
          status?: string
          stripe_account_id?: string | null
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          connected_at?: string | null
          created_at?: string
          disconnected_at?: string | null
          display_name?: string | null
          error_message?: string | null
          id?: string
          last_balance_txn_synced_at?: string | null
          last_event_created_at?: string | null
          last_event_id?: string | null
          livemode?: boolean
          oauth_state?: string | null
          status?: string
          stripe_account_id?: string | null
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payment_events: {
        Row: {
          amount: number | null
          checkout_session_id: string | null
          company_id: string
          connection_id: string
          created_at: string
          currency: string | null
          event_created_at: string | null
          id: string
          invoice_id: string | null
          journal_entry_id: string | null
          payment_intent_id: string | null
          payment_link_id: string | null
          reason: string | null
          status: string
          stripe_event_id: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          checkout_session_id?: string | null
          company_id: string
          connection_id: string
          created_at?: string
          currency?: string | null
          event_created_at?: string | null
          id?: string
          invoice_id?: string | null
          journal_entry_id?: string | null
          payment_intent_id?: string | null
          payment_link_id?: string | null
          reason?: string | null
          status?: string
          stripe_event_id: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          checkout_session_id?: string | null
          company_id?: string
          connection_id?: string
          created_at?: string
          currency?: string | null
          event_created_at?: string | null
          id?: string
          invoice_id?: string | null
          journal_entry_id?: string | null
          payment_intent_id?: string | null
          payment_link_id?: string | null
          reason?: string | null
          status?: string
          stripe_event_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payment_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payment_events_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "stripe_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payment_events_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payment_events_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_payouts: {
        Row: {
          amount: number | null
          arrival_date: string | null
          company_id: string
          connection_id: string
          created_at: string
          currency: string | null
          event_created_at: string | null
          fees: number | null
          gross: number | null
          id: string
          journal_entry_id: string | null
          payout_id: string
          reason: string | null
          status: string
          stripe_event_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          arrival_date?: string | null
          company_id: string
          connection_id: string
          created_at?: string
          currency?: string | null
          event_created_at?: string | null
          fees?: number | null
          gross?: number | null
          id?: string
          journal_entry_id?: string | null
          payout_id: string
          reason?: string | null
          status?: string
          stripe_event_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          arrival_date?: string | null
          company_id?: string
          connection_id?: string
          created_at?: string
          currency?: string | null
          event_created_at?: string | null
          fees?: number | null
          gross?: number | null
          id?: string
          journal_entry_id?: string | null
          payout_id?: string
          reason?: string | null
          status?: string
          stripe_event_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_payouts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payouts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "stripe_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_payouts_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          event_id: string
          processed_at: string
          type: string
        }
        Insert: {
          event_id: string
          processed_at?: string
          type: string
        }
        Update: {
          event_id?: string
          processed_at?: string
          type?: string
        }
        Relationships: []
      }
      supplier_invoice_items: {
        Row: {
          account_number: string
          accrual_balance_account: string | null
          accrual_period_end: string | null
          accrual_period_start: string | null
          apply_slp: boolean
          created_at: string
          description: string
          dimensions: Json
          id: string
          line_total: number
          quantity: number
          reverse_charge_rate: number | null
          sort_order: number
          supplier_invoice_id: string
          unit: string
          unit_price: number
          vat_amount: number
          vat_code: string | null
          vat_rate: number
        }
        Insert: {
          account_number: string
          accrual_balance_account?: string | null
          accrual_period_end?: string | null
          accrual_period_start?: string | null
          apply_slp?: boolean
          created_at?: string
          description: string
          dimensions?: Json
          id?: string
          line_total?: number
          quantity?: number
          reverse_charge_rate?: number | null
          sort_order?: number
          supplier_invoice_id: string
          unit?: string
          unit_price?: number
          vat_amount?: number
          vat_code?: string | null
          vat_rate?: number
        }
        Update: {
          account_number?: string
          accrual_balance_account?: string | null
          accrual_period_end?: string | null
          accrual_period_start?: string | null
          apply_slp?: boolean
          created_at?: string
          description?: string
          dimensions?: Json
          id?: string
          line_total?: number
          quantity?: number
          reverse_charge_rate?: number | null
          sort_order?: number
          supplier_invoice_id?: string
          unit?: string
          unit_price?: number
          vat_amount?: number
          vat_code?: string | null
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoice_items_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoice_payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          exchange_rate: number | null
          exchange_rate_difference: number | null
          id: string
          journal_entry_id: string | null
          notes: string | null
          payment_date: string
          payment_exchange_rate: number | null
          supplier_invoice_id: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          exchange_rate?: number | null
          exchange_rate_difference?: number | null
          id?: string
          journal_entry_id?: string | null
          notes?: string | null
          payment_date: string
          payment_exchange_rate?: number | null
          supplier_invoice_id: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          exchange_rate?: number | null
          exchange_rate_difference?: number | null
          id?: string
          journal_entry_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_exchange_rate?: number | null
          supplier_invoice_id?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoice_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoice_payments_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoice_payments_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoice_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoices: {
        Row: {
          approved_at: string | null
          arrival_number: number
          bank_entered_at: string | null
          company_id: string
          created_at: string
          credited_invoice_id: string | null
          currency: string
          default_dimensions: Json
          delivery_date: string | null
          document_id: string | null
          due_date: string
          exchange_rate: number | null
          exchange_rate_date: string | null
          id: string
          invoice_date: string
          is_credit_note: boolean
          notes: string | null
          ore_rounding: boolean | null
          paid_amount: number
          paid_at: string | null
          paid_with_private_funds: boolean
          payment_journal_entry_id: string | null
          payment_reference: string | null
          received_date: string
          registration_journal_entry_id: string | null
          remaining_amount: number
          reverse_charge: boolean
          reversed_at: string | null
          status: string
          subtotal: number
          subtotal_sek: number | null
          supplier_id: string
          supplier_invoice_number: string
          total: number
          total_sek: number | null
          transaction_id: string | null
          updated_at: string
          user_id: string
          vat_amount: number
          vat_amount_sek: number | null
          vat_treatment: string
        }
        Insert: {
          approved_at?: string | null
          arrival_number: number
          bank_entered_at?: string | null
          company_id: string
          created_at?: string
          credited_invoice_id?: string | null
          currency?: string
          default_dimensions?: Json
          delivery_date?: string | null
          document_id?: string | null
          due_date: string
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          id?: string
          invoice_date: string
          is_credit_note?: boolean
          notes?: string | null
          ore_rounding?: boolean | null
          paid_amount?: number
          paid_at?: string | null
          paid_with_private_funds?: boolean
          payment_journal_entry_id?: string | null
          payment_reference?: string | null
          received_date?: string
          registration_journal_entry_id?: string | null
          remaining_amount?: number
          reverse_charge?: boolean
          reversed_at?: string | null
          status?: string
          subtotal?: number
          subtotal_sek?: number | null
          supplier_id: string
          supplier_invoice_number: string
          total?: number
          total_sek?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
          vat_amount?: number
          vat_amount_sek?: number | null
          vat_treatment?: string
        }
        Update: {
          approved_at?: string | null
          arrival_number?: number
          bank_entered_at?: string | null
          company_id?: string
          created_at?: string
          credited_invoice_id?: string | null
          currency?: string
          default_dimensions?: Json
          delivery_date?: string | null
          document_id?: string | null
          due_date?: string
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          id?: string
          invoice_date?: string
          is_credit_note?: boolean
          notes?: string | null
          ore_rounding?: boolean | null
          paid_amount?: number
          paid_at?: string | null
          paid_with_private_funds?: boolean
          payment_journal_entry_id?: string | null
          payment_reference?: string | null
          received_date?: string
          registration_journal_entry_id?: string | null
          remaining_amount?: number
          reverse_charge?: boolean
          reversed_at?: string | null
          status?: string
          subtotal?: number
          subtotal_sek?: number | null
          supplier_id?: string
          supplier_invoice_number?: string
          total?: number
          total_sek?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
          vat_amount?: number
          vat_amount_sek?: number | null
          vat_treatment?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_credited_invoice_id_fkey"
            columns: ["credited_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_payment_journal_entry_id_fkey"
            columns: ["payment_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_registration_journal_entry_id_fkey"
            columns: ["registration_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payment_batch_items: {
        Row: {
          amount: number
          batch_id: string
          company_id: string
          created_at: string
          id: string
          payee_account: string | null
          payee_bankgiro: string | null
          payee_city: string | null
          payee_clearing: string | null
          payee_name: string
          payee_plusgiro: string | null
          payee_type: string
          payment_date: string
          reference: string
          reference_type: string
          supplier_invoice_id: string
        }
        Insert: {
          amount: number
          batch_id: string
          company_id: string
          created_at?: string
          id?: string
          payee_account?: string | null
          payee_bankgiro?: string | null
          payee_city?: string | null
          payee_clearing?: string | null
          payee_name: string
          payee_plusgiro?: string | null
          payee_type: string
          payment_date: string
          reference: string
          reference_type: string
          supplier_invoice_id: string
        }
        Update: {
          amount?: number
          batch_id?: string
          company_id?: string
          created_at?: string
          id?: string
          payee_account?: string | null
          payee_bankgiro?: string | null
          payee_city?: string | null
          payee_clearing?: string | null
          payee_name?: string
          payee_plusgiro?: string | null
          payee_type?: string
          payment_date?: string
          reference?: string
          reference_type?: string
          supplier_invoice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_payment_batch_items_batch"
            columns: ["batch_id", "company_id"]
            isOneToOne: false
            referencedRelation: "supplier_payment_batches"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "fk_supplier_payment_batch_items_invoice"
            columns: ["supplier_invoice_id", "company_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id", "company_id"]
          },
          {
            foreignKeyName: "supplier_payment_batch_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payment_batches: {
        Row: {
          cancelled_at: string | null
          cancelled_by: string | null
          company_id: string
          created_at: string
          currency: string
          debtor_snapshot: Json
          download_count: number
          file_generated_at: string | null
          format: string
          id: string
          item_count: number
          msg_id: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          company_id: string
          created_at?: string
          currency?: string
          debtor_snapshot: Json
          download_count?: number
          file_generated_at?: string | null
          format: string
          id?: string
          item_count: number
          msg_id: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          debtor_snapshot?: Json
          download_count?: number
          file_generated_at?: string | null
          format?: string
          id?: string
          item_count?: number
          msg_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_payment_batches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          account_number: string | null
          address_line1: string | null
          address_line2: string | null
          archived_at: string | null
          bank_account: string | null
          bankgiro: string | null
          bic: string | null
          category: string | null
          city: string | null
          clearing_number: string | null
          company_id: string
          country: string | null
          country_raw: string | null
          created_at: string
          default_currency: string
          default_expense_account: string | null
          default_payment_terms: number | null
          email: string | null
          iban: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          org_number: string | null
          party_id: string | null
          phone: string | null
          plusgiro: string | null
          postal_code: string | null
          supplier_type: string
          updated_at: string
          user_id: string
          vat_number: string | null
        }
        Insert: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          bank_account?: string | null
          bankgiro?: string | null
          bic?: string | null
          category?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id: string
          country?: string | null
          country_raw?: string | null
          created_at?: string
          default_currency?: string
          default_expense_account?: string | null
          default_payment_terms?: number | null
          email?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          org_number?: string | null
          party_id?: string | null
          phone?: string | null
          plusgiro?: string | null
          postal_code?: string | null
          supplier_type?: string
          updated_at?: string
          user_id: string
          vat_number?: string | null
        }
        Update: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          archived_at?: string | null
          bank_account?: string | null
          bankgiro?: string | null
          bic?: string | null
          category?: string | null
          city?: string | null
          clearing_number?: string | null
          company_id?: string
          country?: string | null
          country_raw?: string | null
          created_at?: string
          default_currency?: string
          default_expense_account?: string | null
          default_payment_terms?: number | null
          email?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          org_number?: string | null
          party_id?: string | null
          phone?: string | null
          plusgiro?: string | null
          postal_code?: string | null
          supplier_type?: string
          updated_at?: string
          user_id?: string
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_party_same_company"
            columns: ["party_id", "company_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      tax_assessment_notices: {
        Row: {
          archived_at: string | null
          company_id: string
          created_at: string
          decision_date: string
          decision_type: string
          fiscal_period_id: string
          id: string
          payment_due_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          company_id: string
          created_at?: string
          decision_date: string
          decision_type: string
          fiscal_period_id: string
          id?: string
          payment_due_date: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          company_id?: string
          created_at?: string
          decision_date?: string
          decision_type?: string
          fiscal_period_id?: string
          id?: string
          payment_due_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_assessment_notices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_assessment_notices_fiscal_period_company_fkey"
            columns: ["fiscal_period_id", "company_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id", "company_id"]
          },
        ]
      }
      tax_table_rates: {
        Row: {
          column_number: number
          created_at: string
          id: string
          income_from: number
          income_to: number
          table_number: number
          table_year: number
          tax_amount: number
        }
        Insert: {
          column_number: number
          created_at?: string
          id?: string
          income_from: number
          income_to: number
          table_number: number
          table_year: number
          tax_amount: number
        }
        Update: {
          column_number?: number
          created_at?: string
          id?: string
          income_from?: number
          income_to?: number
          table_number?: number
          table_year?: number
          tax_amount?: number
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: string
          status: string
          team_id: string
          token_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          role?: string
          status?: string
          team_id: string
          token_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: string
          status?: string
          team_id?: string
          token_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string
          role: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          id: string
          kind: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          kind?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          kind?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      transaction_assistant_reads: {
        Row: {
          account: string | null
          agreement: number | null
          candidates: Json
          category: string | null
          company_id: string
          confidence: number
          created_at: string
          from_candidate: boolean
          has_underlag: boolean
          id: string
          model: string | null
          model_confidence: string | null
          reasoning: string
          reverse_charge: boolean
          transaction_id: string
          underlag_key: string | null
          updated_at: string
          vat_treatment: string | null
        }
        Insert: {
          account?: string | null
          agreement?: number | null
          candidates?: Json
          category?: string | null
          company_id: string
          confidence: number
          created_at?: string
          from_candidate?: boolean
          has_underlag?: boolean
          id?: string
          model?: string | null
          model_confidence?: string | null
          reasoning?: string
          reverse_charge?: boolean
          transaction_id: string
          underlag_key?: string | null
          updated_at?: string
          vat_treatment?: string | null
        }
        Update: {
          account?: string | null
          agreement?: number | null
          candidates?: Json
          category?: string | null
          company_id?: string
          confidence?: number
          created_at?: string
          from_candidate?: boolean
          has_underlag?: boolean
          id?: string
          model?: string | null
          model_confidence?: string | null
          reasoning?: string
          reverse_charge?: boolean
          transaction_id?: string
          underlag_key?: string | null
          updated_at?: string
          vat_treatment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_assistant_reads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_assistant_reads_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_voucher_links: {
        Row: {
          allocated_amount: number
          company_id: string
          created_at: string
          id: string
          journal_entry_id: string
          role: string
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allocated_amount: number
          company_id: string
          created_at?: string
          id?: string
          journal_entry_id: string
          role?: string
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allocated_amount?: number
          company_id?: string
          created_at?: string
          id?: string
          journal_entry_id?: string
          role?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_voucher_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_voucher_links_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_voucher_links_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          amount_sek: number | null
          bank_connection_id: string | null
          bank_file_import_id: string | null
          bank_transaction_code: string | null
          cash_account_id: string | null
          category: string | null
          company_id: string
          counterparty_account: string | null
          counterparty_iban: string | null
          created_at: string
          currency: string | null
          date: string
          description: string
          document_id: string | null
          enrichment: Json | null
          exchange_rate: number | null
          exchange_rate_date: string | null
          external_id: string | null
          id: string
          import_source: string | null
          invoice_id: string | null
          is_business: boolean | null
          is_ignored: boolean
          journal_entry_id: string | null
          mcc_code: number | null
          merchant_name: string | null
          notes: string | null
          original_description: string | null
          potential_invoice_id: string | null
          potential_journal_entry_id: string | null
          potential_match_confidence: number | null
          potential_match_method: string | null
          potential_rot_rut_payout_request_id: string | null
          potential_supplier_invoice_id: string | null
          proprietary_bank_transaction_code: string | null
          receipt_id: string | null
          reconciliation_method: string | null
          reference: string | null
          supplier_invoice_id: string | null
          title_edited_at: string | null
          transaction_method: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          amount_sek?: number | null
          bank_connection_id?: string | null
          bank_file_import_id?: string | null
          bank_transaction_code?: string | null
          cash_account_id?: string | null
          category?: string | null
          company_id: string
          counterparty_account?: string | null
          counterparty_iban?: string | null
          created_at?: string
          currency?: string | null
          date: string
          description: string
          document_id?: string | null
          enrichment?: Json | null
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          external_id?: string | null
          id?: string
          import_source?: string | null
          invoice_id?: string | null
          is_business?: boolean | null
          is_ignored?: boolean
          journal_entry_id?: string | null
          mcc_code?: number | null
          merchant_name?: string | null
          notes?: string | null
          original_description?: string | null
          potential_invoice_id?: string | null
          potential_journal_entry_id?: string | null
          potential_match_confidence?: number | null
          potential_match_method?: string | null
          potential_rot_rut_payout_request_id?: string | null
          potential_supplier_invoice_id?: string | null
          proprietary_bank_transaction_code?: string | null
          receipt_id?: string | null
          reconciliation_method?: string | null
          reference?: string | null
          supplier_invoice_id?: string | null
          title_edited_at?: string | null
          transaction_method?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          amount_sek?: number | null
          bank_connection_id?: string | null
          bank_file_import_id?: string | null
          bank_transaction_code?: string | null
          cash_account_id?: string | null
          category?: string | null
          company_id?: string
          counterparty_account?: string | null
          counterparty_iban?: string | null
          created_at?: string
          currency?: string | null
          date?: string
          description?: string
          document_id?: string | null
          enrichment?: Json | null
          exchange_rate?: number | null
          exchange_rate_date?: string | null
          external_id?: string | null
          id?: string
          import_source?: string | null
          invoice_id?: string | null
          is_business?: boolean | null
          is_ignored?: boolean
          journal_entry_id?: string | null
          mcc_code?: number | null
          merchant_name?: string | null
          notes?: string | null
          original_description?: string | null
          potential_invoice_id?: string | null
          potential_journal_entry_id?: string | null
          potential_match_confidence?: number | null
          potential_match_method?: string | null
          potential_rot_rut_payout_request_id?: string | null
          potential_supplier_invoice_id?: string | null
          proprietary_bank_transaction_code?: string | null
          receipt_id?: string | null
          reconciliation_method?: string | null
          reference?: string | null
          supplier_invoice_id?: string | null
          title_edited_at?: string | null
          transaction_method?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_journal_entry"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_receipt"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bank_connection_id_fkey"
            columns: ["bank_connection_id"]
            isOneToOne: false
            referencedRelation: "bank_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bank_file_import_id_fkey"
            columns: ["bank_file_import_id"]
            isOneToOne: false
            referencedRelation: "bank_file_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cash_account_id_fkey"
            columns: ["cash_account_id"]
            isOneToOne: false
            referencedRelation: "cash_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "document_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_potential_invoice_id_fkey"
            columns: ["potential_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_potential_journal_entry_id_fkey"
            columns: ["potential_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_potential_rot_rut_payout_request_id_fkey"
            columns: ["potential_rot_rut_payout_request_id"]
            isOneToOne: false
            referencedRelation: "rot_rut_payout_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_potential_supplier_invoice_id_fkey"
            columns: ["potential_supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_invoice_id_fkey"
            columns: ["supplier_invoice_id"]
            isOneToOne: false
            referencedRelation: "supplier_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          active_company_id: string | null
          auto_logout: boolean
          created_at: string
          hide_assistant_fab: boolean
          id: string
          locale: string
          ui_state: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          active_company_id?: string | null
          auto_logout?: boolean
          created_at?: string
          hide_assistant_fab?: boolean
          id?: string
          locale?: string
          ui_state?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          active_company_id?: string | null
          auto_logout?: boolean
          created_at?: string
          hide_assistant_fab?: boolean
          id?: string
          locale?: string
          ui_state?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_active_company_id_fkey"
            columns: ["active_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_year_closures: {
        Row: {
          adjustment_entry_id: string | null
          closed_at: string
          closed_by: string | null
          company_id: string
          created_at: string
          id: string
          report: Json
          vacation_year_start: string
        }
        Insert: {
          adjustment_entry_id?: string | null
          closed_at?: string
          closed_by?: string | null
          company_id: string
          created_at?: string
          id?: string
          report: Json
          vacation_year_start: string
        }
        Update: {
          adjustment_entry_id?: string | null
          closed_at?: string
          closed_by?: string | null
          company_id?: string
          created_at?: string
          id?: string
          report?: Json
          vacation_year_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacation_year_closures_adjustment_entry_id_fkey"
            columns: ["adjustment_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacation_year_closures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      voucher_gap_explanations: {
        Row: {
          company_id: string
          created_at: string
          explanation: string
          fiscal_period_id: string
          gap_end: number
          gap_start: number
          id: string
          updated_at: string
          user_id: string
          voucher_series: string
        }
        Insert: {
          company_id: string
          created_at?: string
          explanation: string
          fiscal_period_id: string
          gap_end: number
          gap_start: number
          id?: string
          updated_at?: string
          user_id: string
          voucher_series?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          explanation?: string
          fiscal_period_id?: string
          gap_end?: number
          gap_start?: number
          id?: string
          updated_at?: string
          user_id?: string
          voucher_series?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_gap_explanations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_gap_explanations_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      voucher_sequences: {
        Row: {
          company_id: string
          created_at: string
          fiscal_period_id: string
          id: string
          last_number: number
          updated_at: string
          user_id: string
          voucher_series: string
        }
        Insert: {
          company_id: string
          created_at?: string
          fiscal_period_id: string
          id?: string
          last_number?: number
          updated_at?: string
          user_id: string
          voucher_series?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          fiscal_period_id?: string
          id?: string
          last_number?: number
          updated_at?: string
          user_id?: string
          voucher_series?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_sequences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_sequences_fiscal_period_id_fkey"
            columns: ["fiscal_period_id"]
            isOneToOne: false
            referencedRelation: "fiscal_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          api_version: string
          attempts: number
          company_id: string
          created_at: string
          delivered_at: string | null
          error: string | null
          event_type: string
          id: string
          next_attempt_at: string
          payload: Json
          previous_attributes: Json | null
          request_id: string | null
          response_body: string | null
          response_headers: Json | null
          response_status: number | null
          status: string
          updated_at: string
          webhook_id: string | null
        }
        Insert: {
          api_version: string
          attempts?: number
          company_id: string
          created_at?: string
          delivered_at?: string | null
          error?: string | null
          event_type: string
          id?: string
          next_attempt_at?: string
          payload: Json
          previous_attributes?: Json | null
          request_id?: string | null
          response_body?: string | null
          response_headers?: Json | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_id?: string | null
        }
        Update: {
          api_version?: string
          attempts?: number
          company_id?: string
          created_at?: string
          delivered_at?: string | null
          error?: string | null
          event_type?: string
          id?: string
          next_attempt_at?: string
          payload?: Json
          previous_attributes?: Json | null
          request_id?: string | null
          response_body?: string | null
          response_headers?: Json | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean
          api_version_pinned: string
          company_id: string
          created_at: string
          created_by_api_key_id: string | null
          description: string | null
          disabled_at: string | null
          disabled_reason: string | null
          event_type: string
          id: string
          name: string
          secret: string
          updated_at: string
          webhook_url: string
        }
        Insert: {
          active?: boolean
          api_version_pinned?: string
          company_id: string
          created_at?: string
          created_by_api_key_id?: string | null
          description?: string | null
          disabled_at?: string | null
          disabled_reason?: string | null
          event_type: string
          id?: string
          name?: string
          secret: string
          updated_at?: string
          webhook_url: string
        }
        Update: {
          active?: boolean
          api_version_pinned?: string
          company_id?: string
          created_at?: string
          created_by_api_key_id?: string | null
          description?: string | null
          disabled_at?: string | null
          disabled_reason?: string | null
          event_type?: string
          id?: string
          name?: string
          secret?: string
          updated_at?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_webhooks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhooks_created_by_api_key_id_fkey"
            columns: ["created_by_api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      webshop_orders: {
        Row: {
          company_id: string
          connection_id: string | null
          created_at: string
          currency: string
          customer_company: string | null
          customer_country: string | null
          customer_email: string | null
          customer_name: string | null
          customer_orgnr: string | null
          exchange_rate: number | null
          external_id: string
          gateway_reference: string | null
          id: string
          invoice_id: string | null
          is_paid: boolean
          journal_entry_id: string | null
          legacy_transaction_id: string | null
          line_items: Json
          manually_booked_at: string | null
          manually_booked_by: string | null
          manually_booked_journal_entry_id: string | null
          order_date: string
          order_number: string
          paid_date: string | null
          parent_order_id: string | null
          payment_method: string | null
          payment_method_title: string | null
          platform: string
          platform_order_id: string
          refunded_total: number
          remote_changed_after_freeze: boolean
          row_type: string
          status: string
          store_label: string | null
          store_scope: string
          total: number
          total_sek: number | null
          total_tax: number
          updated_at: string
          user_id: string
          vat_breakdown: Json
        }
        Insert: {
          company_id: string
          connection_id?: string | null
          created_at?: string
          currency: string
          customer_company?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_orgnr?: string | null
          exchange_rate?: number | null
          external_id: string
          gateway_reference?: string | null
          id?: string
          invoice_id?: string | null
          is_paid?: boolean
          journal_entry_id?: string | null
          legacy_transaction_id?: string | null
          line_items?: Json
          manually_booked_at?: string | null
          manually_booked_by?: string | null
          manually_booked_journal_entry_id?: string | null
          order_date: string
          order_number: string
          paid_date?: string | null
          parent_order_id?: string | null
          payment_method?: string | null
          payment_method_title?: string | null
          platform: string
          platform_order_id: string
          refunded_total?: number
          remote_changed_after_freeze?: boolean
          row_type?: string
          status: string
          store_label?: string | null
          store_scope: string
          total: number
          total_sek?: number | null
          total_tax?: number
          updated_at?: string
          user_id: string
          vat_breakdown?: Json
        }
        Update: {
          company_id?: string
          connection_id?: string | null
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_orgnr?: string | null
          exchange_rate?: number | null
          external_id?: string
          gateway_reference?: string | null
          id?: string
          invoice_id?: string | null
          is_paid?: boolean
          journal_entry_id?: string | null
          legacy_transaction_id?: string | null
          line_items?: Json
          manually_booked_at?: string | null
          manually_booked_by?: string | null
          manually_booked_journal_entry_id?: string | null
          order_date?: string
          order_number?: string
          paid_date?: string | null
          parent_order_id?: string | null
          payment_method?: string | null
          payment_method_title?: string | null
          platform?: string
          platform_order_id?: string
          refunded_total?: number
          remote_changed_after_freeze?: boolean
          row_type?: string
          status?: string
          store_label?: string | null
          store_scope?: string
          total?: number
          total_sek?: number | null
          total_tax?: number
          updated_at?: string
          user_id?: string
          vat_breakdown?: Json
        }
        Relationships: [
          {
            foreignKeyName: "webshop_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webshop_orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webshop_orders_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webshop_orders_legacy_transaction_id_fkey"
            columns: ["legacy_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webshop_orders_manually_booked_journal_entry_id_fkey"
            columns: ["manually_booked_journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webshop_orders_parent_order_id_fkey"
            columns: ["parent_order_id"]
            isOneToOne: false
            referencedRelation: "webshop_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      webshop_store_settings: {
        Row: {
          company_id: string
          created_at: string
          id: string
          payment_method_account_map: Json
          platform: string
          store_scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          payment_method_account_map?: Json
          platform: string
          store_scope: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          payment_method_account_map?: Json
          platform?: string
          store_scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webshop_store_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          company_id: string | null
          context: Json
          created_at: string
          debounce_until: string | null
          id: string
          last_inbound_at: string | null
          last_outbound_at: string | null
          pending_ack: boolean
          phone_link_id: string
          service_window_expires_at: string | null
          state: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          context?: Json
          created_at?: string
          debounce_until?: string | null
          id?: string
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          pending_ack?: boolean
          phone_link_id: string
          service_window_expires_at?: string | null
          state?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          context?: Json
          created_at?: string
          debounce_until?: string | null
          id?: string
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          pending_ack?: boolean
          phone_link_id?: string
          service_window_expires_at?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_phone_link_id_fkey"
            columns: ["phone_link_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_phone_links"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_link_codes: {
        Row: {
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          updated_at: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          updated_at?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          updated_at?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          acked_at: string | null
          attempts: number
          body_text: string | null
          conversation_id: string | null
          correlation_id: string | null
          created_at: string
          delivery_status: string | null
          direction: string
          error_message: string | null
          id: string
          inbox_item_id: string | null
          media_filename: string | null
          media_id: string | null
          media_mime: string | null
          media_sha256: string | null
          message_type: string
          phone_link_id: string | null
          processing_status: string
          raw_payload: Json | null
          sender_phone_hash: string | null
          updated_at: string
          wamid: string | null
        }
        Insert: {
          acked_at?: string | null
          attempts?: number
          body_text?: string | null
          conversation_id?: string | null
          correlation_id?: string | null
          created_at?: string
          delivery_status?: string | null
          direction: string
          error_message?: string | null
          id?: string
          inbox_item_id?: string | null
          media_filename?: string | null
          media_id?: string | null
          media_mime?: string | null
          media_sha256?: string | null
          message_type: string
          phone_link_id?: string | null
          processing_status?: string
          raw_payload?: Json | null
          sender_phone_hash?: string | null
          updated_at?: string
          wamid?: string | null
        }
        Update: {
          acked_at?: string | null
          attempts?: number
          body_text?: string | null
          conversation_id?: string | null
          correlation_id?: string | null
          created_at?: string
          delivery_status?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          inbox_item_id?: string | null
          media_filename?: string | null
          media_id?: string | null
          media_mime?: string | null
          media_sha256?: string | null
          message_type?: string
          phone_link_id?: string | null
          processing_status?: string
          raw_payload?: Json | null
          sender_phone_hash?: string | null
          updated_at?: string
          wamid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_inbox_item_id_fkey"
            columns: ["inbox_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_inbox_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_phone_link_id_fkey"
            columns: ["phone_link_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_phone_links"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_phone_links: {
        Row: {
          created_at: string
          default_company_id: string | null
          id: string
          last_company_id: string | null
          last_message_at: string | null
          muted_at: string | null
          phone_enc: string
          phone_hash: string
          phone_masked: string
          revoked_at: string | null
          updated_at: string
          user_id: string
          verified_at: string
          wa_profile_name: string | null
        }
        Insert: {
          created_at?: string
          default_company_id?: string | null
          id?: string
          last_company_id?: string | null
          last_message_at?: string | null
          muted_at?: string | null
          phone_enc: string
          phone_hash: string
          phone_masked: string
          revoked_at?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string
          wa_profile_name?: string | null
        }
        Update: {
          created_at?: string
          default_company_id?: string | null
          id?: string
          last_company_id?: string | null
          last_message_at?: string | null
          muted_at?: string | null
          phone_enc?: string
          phone_hash?: string
          phone_masked?: string
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string
          wa_profile_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_phone_links_default_company_id_fkey"
            columns: ["default_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_phone_links_last_company_id_fkey"
            columns: ["last_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_sender_rate_counters: {
        Row: {
          count: number
          phone_hash: string
          updated_at: string
          window_key: string
          window_kind: string
        }
        Insert: {
          count?: number
          phone_hash: string
          updated_at?: string
          window_key: string
          window_kind: string
        }
        Update: {
          count?: number
          phone_hash?: string
          updated_at?: string
          window_key?: string
          window_kind?: string
        }
        Relationships: []
      }
      woocommerce_connections: {
        Row: {
          browser_confirmed_at: string | null
          company_id: string
          connected_at: string | null
          consumer_key_encrypted: string | null
          consumer_secret_encrypted: string | null
          created_at: string
          currency: string | null
          disconnected_at: string | null
          error_message: string | null
          id: string
          key_permissions: string | null
          last_order_synced_at: string | null
          oauth_state: string | null
          prices_include_tax: boolean | null
          status: string
          store_name: string | null
          store_url: string
          transaction_sync_enabled: boolean
          updated_at: string
          user_id: string
          wc_version: string | null
        }
        Insert: {
          browser_confirmed_at?: string | null
          company_id: string
          connected_at?: string | null
          consumer_key_encrypted?: string | null
          consumer_secret_encrypted?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          key_permissions?: string | null
          last_order_synced_at?: string | null
          oauth_state?: string | null
          prices_include_tax?: boolean | null
          status?: string
          store_name?: string | null
          store_url: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id: string
          wc_version?: string | null
        }
        Update: {
          browser_confirmed_at?: string | null
          company_id?: string
          connected_at?: string | null
          consumer_key_encrypted?: string | null
          consumer_secret_encrypted?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          key_permissions?: string | null
          last_order_synced_at?: string | null
          oauth_state?: string | null
          prices_include_tax?: boolean | null
          status?: string
          store_name?: string | null
          store_url?: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id?: string
          wc_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "woocommerce_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      zettle_connections: {
        Row: {
          company_id: string
          connected_at: string | null
          created_at: string
          currency: string | null
          disconnected_at: string | null
          error_message: string | null
          id: string
          last_order_synced_at: string | null
          oauth_state: string | null
          organization_name: string | null
          organization_uuid: string | null
          refresh_token_encrypted: string | null
          return_origin: string | null
          status: string
          sync_lock_until: string
          transaction_sync_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          connected_at?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          last_order_synced_at?: string | null
          oauth_state?: string | null
          organization_name?: string | null
          organization_uuid?: string | null
          refresh_token_encrypted?: string | null
          return_origin?: string | null
          status?: string
          sync_lock_until?: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          connected_at?: string | null
          created_at?: string
          currency?: string | null
          disconnected_at?: string | null
          error_message?: string | null
          id?: string
          last_order_synced_at?: string | null
          oauth_state?: string | null
          organization_name?: string | null
          organization_uuid?: string | null
          refresh_token_encrypted?: string | null
          return_origin?: string | null
          status?: string
          sync_lock_until?: string
          transaction_sync_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zettle_connections_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anonymize_user_account: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      apply_invoice_delivery_provider_event: {
        Args: {
          p_detail: string
          p_occurred_at: string
          p_provider: string
          p_provider_message_id: string
          p_recipient_addresses: string[]
          p_status: string
        }
        Returns: string
      }
      apply_invoice_delivery_provider_status: {
        Args: {
          p_detail: string
          p_occurred_at: string
          p_provider: string
          p_provider_message_id: string
          p_status: string
        }
        Returns: string
      }
      apply_party_suggestions: {
        Args: { p_company_id: string; p_items: Json; p_user_id: string }
        Returns: Json
      }
      apply_rot_rut_beslut: {
        Args: {
          p_decided_total: number
          p_items: Json
          p_new_status: string
          p_request_id: string
          p_skv_referensnummer: string
        }
        Returns: undefined
      }
      apply_rot_rut_reclaim_invoice: {
        Args: {
          p_company_id: string
          p_invoice_id: string
          p_item_id: string
          p_reclaimed_amount: number
        }
        Returns: Json
      }
      authorize_invoice_delivery_service_actor: {
        Args: { p_actor_user_id: string; p_company_id: string }
        Returns: string
      }
      bulk_book_transactions: {
        Args: {
          p_company_id: string
          p_existing_journal_entry_id: string
          p_new_entry: Json
          p_tx_ids: string[]
          p_user_id?: string
        }
        Returns: Json
      }
      caller_can_write_company: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      caller_is_company_member: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      caller_is_company_owner: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      caller_is_team_owner: { Args: { p_team_id: string }; Returns: boolean }
      canonical_party_id: { Args: { p_party_id: string }; Returns: string }
      capture_invoice_delivery_payload: {
        Args: {
          p_actor_user_id: string
          p_attachment_content_type: string
          p_attachment_filename: string
          p_attachment_sha256: string
          p_bcc_addresses: string[]
          p_body_html: string
          p_body_text: string
          p_cc_addresses: string[]
          p_company_id: string
          p_delivery_id: string
          p_document_attachment_id: string
          p_from_name: string
          p_invoice_id: string
          p_reply_to: string
          p_subject: string
          p_to_addresses: string[]
        }
        Returns: string
      }
      cash_account_payee_changed: {
        Args: {
          new_row: Database["public"]["Tables"]["cash_accounts"]["Row"]
          old_row: Database["public"]["Tables"]["cash_accounts"]["Row"]
        }
        Returns: boolean
      }
      cash_account_payee_json: {
        Args: { p_cash_account_id: string }
        Returns: Json
      }
      check_and_increment_agent_quota: {
        Args: { p_day_max: number; p_minute_max: number; p_user_id: string }
        Returns: Json
      }
      check_and_increment_inbox_quota: {
        Args: { p_company_id: string; p_day_max: number; p_minute_max: number }
        Returns: Json
      }
      check_and_increment_whatsapp_sender_quota: {
        Args: { p_day_max: number; p_minute_max: number; p_phone_hash: string }
        Returns: Json
      }
      check_email_exists: { Args: { email_to_check: string }; Returns: boolean }
      claim_due_webhook_deliveries: {
        Args: { p_batch_size: number; p_now?: string }
        Returns: {
          api_version: string
          attempts: number
          company_id: string
          event_type: string
          id: string
          payload: Json
          previous_attributes: Json
          webhook_id: string
        }[]
      }
      claim_email_change_request: {
        Args: { p_email: string; p_window_seconds: number }
        Returns: boolean
      }
      claim_sandbox_seed: { Args: never; Returns: Json }
      cleanup_expired_sandbox_users: {
        Args: { p_limit?: number; p_max_age_hours?: number }
        Returns: Json
      }
      cleanup_sandbox_user: { Args: { p_user_id: string }; Returns: number }
      commit_asset_disposal: {
        Args: {
          p_actor_label?: string
          p_actor_type?: string
          p_asset_id: string
          p_company_id: string
          p_current_depreciation: number
          p_disposal_type: string
          p_disposed_at: string
          p_disposed_proceeds: number
          p_entry_id: string
          p_fiscal_period_id: string
          p_jamkning_amount: number
          p_jamkning_direction: string
          p_jamkning_new_deduction_percent: number
          p_jamkning_original_deduction_percent: number
          p_jamkning_original_input_vat: number
          p_jamkning_remaining_years: number
          p_jamkning_total_years: number
          p_proceeds_vat: number
          p_vat_treatment: string
        }
        Returns: {
          voucher_number: number
        }[]
      }
      commit_journal_entry: {
        Args: {
          p_actor_label?: string
          p_actor_type?: string
          p_commit_method?: string
          p_company_id: string
          p_entry_id: string
          p_rubric_version?: string
        }
        Returns: {
          voucher_number: number
        }[]
      }
      commit_opening_balance_replacement: {
        Args: {
          p_actor_label?: string
          p_actor_type?: string
          p_company_id: string
          p_description: string
          p_entry_date: string
          p_expected_old_entry_id: string
          p_lines: Json
          p_period_id: string
          p_user_id: string
          p_voucher_series: string
        }
        Returns: {
          new_entry_id: string
          new_voucher_number: number
          storno_entry_id: string
          storno_voucher_number: number
        }[]
      }
      company_has_capability: {
        Args: { p_capability_key: string; p_company_id: string }
        Returns: boolean
      }
      company_migration_reset_snapshot: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260818141018: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260818143004: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260818224000: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260818231500: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260826150000: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_migration_reset_snapshot_before_20260909100400: {
        Args: { p_company_id: string }
        Returns: Json
      }
      company_multi_user_ok: {
        Args: { p_company_id: string; p_grace_days: number }
        Returns: boolean
      }
      company_multi_user_state: {
        Args: { p_company_id: string; p_grace_days: number }
        Returns: {
          grace_ends_at: string
          state: string
        }[]
      }
      complete_invoice_rows: {
        Args: {
          p_company_id: string
          p_header?: Json
          p_invoice_id: string
          p_rows: Json
        }
        Returns: Json
      }
      compute_prior_opening_balances: {
        Args: { p_company_id: string; p_period_start: string }
        Returns: {
          account_number: string
          credit: number
          debit: number
        }[]
      }
      connector_reserve_upstream: {
        Args: { p_hour_max: number; p_minute_max: number; p_service: string }
        Returns: Json
      }
      correct_entry_lines_inline: {
        Args: {
          p_company_id: string
          p_entry_id: string
          p_new_lines?: Json
          p_strike_line_ids: string[]
          p_user_id?: string
        }
        Returns: Json
      }
      correct_entry_metadata: {
        Args: {
          p_company_id: string
          p_description?: string
          p_entry_date?: string
          p_entry_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      create_annual_report_version: {
        Args: {
          p_company_id: string
          p_content_hash: string
          p_entry_point: string
          p_fiscal_period_id: string
          p_framework: string
          p_ixbrl_data: Json
          p_report_data: Json
          p_schema_version: string
          p_status: string
          p_taxonomy_version: string
          p_user_id: string
          p_validation_summary: Json
        }
        Returns: {
          company_id: string
          content_hash: string
          created_at: string
          entry_point: string | null
          finalized_at: string | null
          finalized_by: string | null
          fiscal_period_id: string
          framework: string
          id: string
          ixbrl_data: Json | null
          report_data: Json
          schema_version: string
          status: string
          supersedes_version_id: string | null
          taxonomy_version: string | null
          user_id: string | null
          validation_summary: Json
          version_number: number
        }[]
        SetofOptions: {
          from: "*"
          to: "annual_report_versions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_annual_report_version_with_signatures: {
        Args: {
          p_company_id: string
          p_content_hash: string
          p_entry_point: string
          p_fiscal_period_id: string
          p_framework: string
          p_ixbrl_data: Json
          p_report_data: Json
          p_schema_version: string
          p_status: string
          p_taxonomy_version: string
          p_user_id: string
          p_validation_summary: Json
        }
        Returns: {
          company_id: string
          content_hash: string
          created_at: string
          entry_point: string | null
          finalized_at: string | null
          finalized_by: string | null
          fiscal_period_id: string
          framework: string
          id: string
          ixbrl_data: Json | null
          report_data: Json
          schema_version: string
          status: string
          supersedes_version_id: string | null
          taxonomy_version: string | null
          user_id: string | null
          validation_summary: Json
          version_number: number
        }[]
        SetofOptions: {
          from: "*"
          to: "annual_report_versions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_company_for_brand_signup: {
        Args: {
          p_brand_id: string
          p_entity_type: string
          p_name: string
          p_user_id: string
        }
        Returns: string
      }
      create_company_for_user: {
        Args: {
          p_entity_type: string
          p_name: string
          p_team_id?: string
          p_user_id: string
        }
        Returns: string
      }
      create_company_with_owner: {
        Args: {
          p_entity_type: string
          p_name: string
          p_set_active?: boolean
          p_team_id?: string
        }
        Returns: string
      }
      create_document_version: {
        Args: {
          p_file_name: string
          p_file_size_bytes: number
          p_mime_type: string
          p_original_doc_id: string
          p_sha256_hash: string
          p_storage_path: string
          p_user_id: string
        }
        Returns: string
      }
      create_expense_payout_batch: {
        Args: {
          p_cash_account: string
          p_claim_ids: string[]
          p_company_id: string
          p_notes?: string
          p_payout_date: string
          p_transaction_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      create_supplier_payment_batch: {
        Args: {
          p_batch_id: string
          p_company_id: string
          p_confirm_already_batched?: boolean
          p_debtor_snapshot: Json
          p_format: string
          p_items: Json
          p_msg_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      create_team_with_owner: { Args: { p_name: string }; Returns: string }
      current_active_company_id: { Args: never; Returns: string }
      current_user_can_write: { Args: never; Returns: boolean }
      decide_parties: {
        Args: {
          p_company_id: string
          p_kind: string
          p_note?: string
          p_party_ids: string[]
          p_user_id: string
        }
        Returns: number
      }
      delete_last_voucher: {
        Args: { p_company_id: string; p_entry_id: string }
        Returns: Json
      }
      detach_underlag_duplicate: {
        Args: {
          p_company_id: string
          p_document_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      detect_voucher_gaps: {
        Args: {
          p_company_id: string
          p_fiscal_period_id: string
          p_series?: string
        }
        Returns: {
          gap_end: number
          gap_start: number
        }[]
      }
      ensure_company_dimensions: {
        Args: { p_company_id: string }
        Returns: undefined
      }
      ensure_party: {
        Args: {
          p_company_id: string
          p_kind?: string
          p_name: string
          p_org_number?: string
          p_origin?: string
          p_user_id: string
        }
        Returns: string
      }
      ensure_user_team: { Args: never; Returns: string }
      erase_user_personal_data: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      export_invoice_delivery_evidence: {
        Args: { p_company_id: string }
        Returns: {
          attachment_content_type: string | null
          attachment_filename: string | null
          attachment_sha256: string | null
          bcc_addresses: string[]
          body_html: string | null
          body_text: string | null
          cc_addresses: string[]
          channel: string
          company_id: string
          created_at: string
          document_attachment_id: string | null
          error_code: string | null
          failed_at: string | null
          from_name: string | null
          id: string
          invoice_id: string
          pii_redacted_at: string | null
          provider: string | null
          provider_message_id: string | null
          provider_recipient_statuses: Json
          provider_status: string | null
          provider_status_at: string | null
          provider_status_detail: string | null
          reply_to: string | null
          retention_expires_at: string
          sent_at: string | null
          status: string
          subject: string | null
          to_addresses: string[]
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "invoice_deliveries"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      finalize_invoice_delivery: {
        Args: {
          p_actor_user_id: string
          p_company_id: string
          p_delivery_id: string
          p_error_code: string
          p_provider: string
          p_provider_message_id: string
          p_status: string
        }
        Returns: string
      }
      finish_sandbox_seed: {
        Args: { p_attempt_id: string; p_success: boolean }
        Returns: boolean
      }
      fiscal_year_reset_snapshot: {
        Args: { p_company_id: string; p_period_id: string }
        Returns: Json
      }
      gen_random_bytes: { Args: { size: number }; Returns: string }
      generate_article_number: {
        Args: { p_article_id: string; p_company_id: string }
        Returns: string
      }
      generate_delivery_note_number: {
        Args: { p_company_id: string }
        Returns: string
      }
      generate_inbox_local_part: {
        Args: { p_company_name: string }
        Returns: string
      }
      generate_invoice_number: {
        Args: {
          p_company_id: string
          p_document_type?: string
          p_invoice_id: string
        }
        Returns: string
      }
      generate_quote_number: { Args: { p_company_id: string }; Returns: string }
      generate_sales_order_number: {
        Args: { p_company_id: string; p_order_id: string }
        Returns: string
      }
      get_account_gl_lines_for_matching: {
        Args: {
          p_account_number?: string
          p_company_id: string
          p_date_from?: string
          p_date_to?: string
          p_include_matched?: boolean
        }
        Returns: {
          credit_amount: number
          debit_amount: number
          entry_date: string
          entry_description: string
          journal_entry_id: string
          line_description: string
          line_id: string
          linked_transaction_count: number
          source_type: string
          voucher_number: number
          voucher_series: string
        }[]
      }
      get_account_period_activity: {
        Args: {
          p_accounts: string[]
          p_company_id: string
          p_end: string
          p_exclude_journal_entry_id?: string
          p_start: string
        }
        Returns: {
          account_number: string
          credit: number
          debit: number
        }[]
      }
      get_account_usage_counts: {
        Args: { p_company_id: string }
        Returns: {
          account_number: string
          usage_count: number
        }[]
      }
      get_company_migration_reset_eligibility: {
        Args: { p_company_id: string }
        Returns: Json
      }
      get_dashboard_nav_flags: {
        Args: { p_company_id: string }
        Returns: {
          has_mileage_trips: boolean
          has_webshop: boolean
        }[]
      }
      get_fiscal_year_reset_eligibility: {
        Args: { p_company_id: string; p_period_id: string; p_user_id?: string }
        Returns: Json
      }
      get_kpi_report_aggregates: {
        Args: {
          p_company_id: string
          p_fiscal_period_id: string
          p_ob_entry_id?: string
        }
        Returns: Json
      }
      get_ledger_deep_context: {
        Args: { p_company_id: string; p_from_date?: string }
        Returns: Json
      }
      get_ledger_key_evidence: { Args: { p_company_id: string }; Returns: Json }
      get_ledger_usage_stats: {
        Args: { p_company_id: string; p_from_date: string }
        Returns: Json
      }
      get_next_arrival_number: {
        Args: { p_company_id: string }
        Returns: number
      }
      get_observed_parties: {
        Args: { p_company_id: string; p_from_date?: string; p_limit?: number }
        Returns: Json
      }
      get_trial_balance_aggregates: {
        Args: {
          p_closing_mode: string
          p_company_id: string
          p_dimensions?: Json
          p_exclude_entry_id?: string
          p_fiscal_period_id: string
          p_from_date?: string
          p_to_date?: string
        }
        Returns: Json
      }
      get_unlinked_gl_lines: {
        Args: {
          p_account_number?: string
          p_company_id: string
          p_date_from?: string
          p_date_to?: string
        }
        Returns: {
          credit_amount: number
          debit_amount: number
          entry_date: string
          entry_description: string
          journal_entry_id: string
          line_description: string
          line_id: string
          source_type: string
          voucher_number: number
          voucher_series: string
        }[]
      }
      get_vat_declaration_totals: {
        Args: {
          p_accounts: string[]
          p_company_id: string
          p_end: string
          p_net_accounts: string[]
          p_ruta_accounts: string[]
          p_start: string
        }
        Returns: Json
      }
      get_vat_ruta_source_lines: {
        Args: {
          p_accounts: string[]
          p_company_id: string
          p_cursor_date?: string
          p_cursor_entry_id?: string
          p_cursor_line_id?: string
          p_cursor_voucher_number?: number
          p_end: string
          p_limit?: number
          p_net_accounts: string[]
          p_ruta_accounts: string[]
          p_start: string
        }
        Returns: {
          credit_amount: number
          debit_amount: number
          description: string
          entry_date: string
          journal_entry_id: string
          line_id: string
          voucher_number: number
          voucher_series: string
        }[]
      }
      import_sie_journal_entries: {
        Args: {
          p_company_id: string
          p_entries: Json
          p_fiscal_period_id: string
          p_user_id: string
        }
        Returns: Json
      }
      invoice_delivery_audit_state: {
        Args: {
          delivery: Database["public"]["Tables"]["invoice_deliveries"]["Row"]
        }
        Returns: Json
      }
      invoice_delivery_provider_status_rank: {
        Args: { p_status: string }
        Returns: number
      }
      invoice_delivery_recipient_statuses_valid: {
        Args: {
          p_cc_addresses: string[]
          p_statuses: Json
          p_to_addresses: string[]
        }
        Returns: boolean
      }
      is_transaction_booked: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      jwt_caller_is_end_user: { Args: never; Returns: boolean }
      latest_sent_invoice_delivery_document: {
        Args: { p_company_id: string; p_invoice_id: string }
        Returns: string
      }
      ledger_key: { Args: { raw: string }; Returns: string }
      link_invoice_to_voucher: {
        Args: {
          p_company_id: string
          p_invoice_id: string
          p_journal_entry_id: string
          p_notes?: string
          p_user_id: string
        }
        Returns: Json
      }
      link_supplier_invoice_to_voucher: {
        Args: {
          p_company_id: string
          p_journal_entry_id: string
          p_notes?: string
          p_supplier_invoice_id: string
          p_user_id: string
        }
        Returns: Json
      }
      list_company_accounts: {
        Args: {
          p_account_class?: number
          p_active_only?: boolean
          p_company_id: string
        }
        Returns: Json
      }
      list_fiscal_period_entries_with_related: {
        Args: {
          p_collapse_corrections?: boolean
          p_company_id: string
          p_date_from?: string
          p_date_to?: string
          p_exclude_draft?: boolean
          p_include_related?: boolean
          p_limit?: number
          p_offset?: number
          p_period_id: string
          p_series?: string
          p_sort_date?: string
          p_status?: string
        }
        Returns: {
          entry: Json
          total_count: number
        }[]
      }
      list_invoice_delivery_summaries: {
        Args: { p_company_id: string; p_invoice_id: string }
        Returns: {
          attachment_filename: string
          cc_addresses: string[]
          channel: string
          created_at: string
          document_attachment_id: string
          error_code: string
          failed_at: string
          id: string
          provider: string
          provider_recipient_statuses: Json
          provider_status: string
          provider_status_at: string
          provider_status_detail: string
          sent_at: string
          status: string
          to_addresses: string[]
        }[]
      }
      list_invoice_delivery_summaries_for_service: {
        Args: { p_company_id: string; p_invoice_id: string; p_user_id: string }
        Returns: {
          attachment_filename: string
          cc_addresses: string[]
          channel: string
          created_at: string
          document_attachment_id: string
          error_code: string
          failed_at: string
          id: string
          provider: string
          provider_recipient_statuses: Json
          provider_status: string
          provider_status_at: string
          provider_status_detail: string
          sent_at: string
          status: string
          to_addresses: string[]
        }[]
      }
      list_peppol_delivery_summaries: {
        Args: { p_company_id: string; p_invoice_id: string }
        Returns: {
          created_at: string
          evidence_retrieved_at: string
          id: string
          idempotency_key: string
          provider: string
          provider_submission_id: string
          recipient_identifier: string
          recipient_scheme: string
          status: string
          status_at: string
          status_detail: string
          submitted_at: string
          terminal_at: string
          xml_sha256: string
        }[]
      }
      log_committed_at_override: {
        Args: {
          p_entry: Database["public"]["Tables"]["journal_entries"]["Row"]
          p_jwt_role: string
        }
        Returns: undefined
      }
      mark_entry_as_opening_balance: {
        Args: { p_company_id: string; p_entry_id: string }
        Returns: Json
      }
      match_batch_allocate: {
        Args: {
          p_allocations: Json
          p_company_id: string
          p_tx_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      match_booking_templates: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          embedding_text: string
          similarity: number
          template_id: string
        }[]
      }
      match_documents: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          section_title: string
          similarity: number
          source_file: string
          title: string
        }[]
      }
      merge_parties: {
        Args: {
          p_company_id: string
          p_merged: string[]
          p_note?: string
          p_survivor: string
          p_user_id: string
        }
        Returns: string
      }
      mirror_invoice_payee_defaults: {
        Args: { p_company_id: string; p_drop_currency?: string }
        Returns: undefined
      }
      next_documents_for_integrity_check: {
        Args: { p_limit?: number }
        Returns: {
          company_id: string
          file_name: string
          id: string
          last_checked_at: string
          sha256_hash: string
          storage_path: string
          user_id: string
        }[]
      }
      next_voucher_number: {
        Args: {
          p_company_id: string
          p_fiscal_period_id: string
          p_series?: string
        }
        Returns: number
      }
      normalize_counterparty_key: { Args: { raw: string }; Returns: string }
      normalize_country_code: { Args: { input: string }; Returns: string }
      normalize_org_number: { Args: { raw: string }; Returns: string }
      peek_next_invoice_number: {
        Args: { p_company_id: string; p_document_type?: string }
        Returns: string
      }
      peppol_delivery_status_rank: {
        Args: { p_status: string }
        Returns: number
      }
      pre_request_statement_timeout: { Args: never; Returns: undefined }
      prepare_annual_report_signature_slots: {
        Args: {
          p_annual_report_version_id: string
          p_company_id: string
          p_fiscal_period_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      promote_parties: {
        Args: { p_company_id: string; p_items: Json; p_user_id: string }
        Returns: Json
      }
      record_manual_invoice_delivery: {
        Args: {
          p_actor_user_id: string
          p_company_id: string
          p_invoice_id: string
          p_sent_at?: string
        }
        Returns: Json
      }
      record_party_facts: {
        Args: {
          p_company_id: string
          p_facts: Json
          p_fetched_at?: string
          p_party_id: string
          p_source: string
          p_user_id: string
        }
        Returns: Json
      }
      record_peppol_delivery_event: {
        Args: {
          p_company_id: string
          p_detail: string
          p_event_sha256: string
          p_idempotency_key: string
          p_is_terminal: boolean
          p_normalized_status: string
          p_occurred_at: string
          p_provider: string
          p_provider_event_code: string
          p_provider_event_id: string
          p_provider_submission_id: string
          p_provider_tenant_id: string
          p_raw_payload: Json
          p_verification_method: string
        }
        Returns: {
          company_id: string
          created_at: string
          customization_id: string
          evidence_retrieved_at: string | null
          filename: string
          id: string
          idempotency_key: string
          invoice_id: string
          profile_id: string
          provider: string | null
          provider_submission_id: string | null
          provider_tenant_id: string | null
          recipient_identifier: string
          recipient_scheme: string
          retention_expires_at: string
          status: string
          status_at: string
          status_detail: string | null
          submitted_at: string | null
          terminal_at: string | null
          updated_at: string
          user_id: string
          xml_payload: string
          xml_sha256: string
        }
        SetofOptions: {
          from: "*"
          to: "peppol_deliveries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      record_peppol_delivery_evidence: {
        Args: {
          p_company_id: string
          p_document_payload: string
          p_document_sha256: string
          p_evidence_payload: Json
          p_evidence_sha256: string
          p_evidence_type: string
          p_idempotency_key: string
          p_provider: string
          p_retrieved_at: string
        }
        Returns: string
      }
      recover_stuck_webhook_deliveries: {
        Args: {
          p_backoff: number[]
          p_max_attempts: number
          p_now?: string
          p_stuck_before: string
        }
        Returns: {
          attempts: number
          id: string
          status: string
        }[]
      }
      redact_expired_invoice_delivery_pii: { Args: never; Returns: number }
      refresh_sales_order_completion: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      release_email_change_request: { Args: never; Returns: undefined }
      release_reversed_entry_transactions: {
        Args: { p_company_id: string; p_entry_id: string }
        Returns: Json
      }
      release_voucher_range: {
        Args: {
          p_actual_last: number
          p_company_id: string
          p_fiscal_period_id: string
          p_reserved_highest: number
          p_series: string
        }
        Returns: undefined
      }
      relink_documents_to_correction: {
        Args: {
          p_from_entry_id: string
          p_to_entry_id: string
          p_user_id: string
        }
        Returns: number
      }
      repair_stranded_transactions: {
        Args: {
          p_actor?: Json
          p_company_id?: string
          p_correlation_id?: string
          p_dry_run?: boolean
          p_skip_locked?: boolean
        }
        Returns: {
          amount: number
          company_id: string
          currency: string
          is_sandbox: boolean
          lock_state: string
          previous_category: string
          repaired: boolean
          transaction_date: string
          transaction_id: string
        }[]
      }
      replace_period_opening_balance_link: {
        Args: {
          p_company_id: string
          p_new_entry_id: string
          p_period_id: string
        }
        Returns: undefined
      }
      replace_sie_import: {
        Args: { p_company_id: string; p_import_id: string; p_user_id?: string }
        Returns: number
      }
      reserve_invoice_delivery: {
        Args: {
          p_actor_user_id: string
          p_company_id: string
          p_invoice_id: string
        }
        Returns: string
      }
      reserve_voucher_range: {
        Args: {
          p_company_id: string
          p_fiscal_period_id: string
          p_highest_used: number
          p_series: string
        }
        Returns: undefined
      }
      reset_company_for_migration: {
        Args: {
          p_company_id: string
          p_confirm_no_filed_declarations: boolean
          p_confirm_retained_archive: boolean
          p_confirmed_name: string
          p_reason: string
        }
        Returns: Json
      }
      reset_company_for_migration_before_20260909100400: {
        Args: {
          p_company_id: string
          p_confirm_no_filed_declarations: boolean
          p_confirm_retained_archive: boolean
          p_confirmed_name: string
          p_reason: string
        }
        Returns: Json
      }
      reset_fiscal_year: {
        Args: {
          p_company_id: string
          p_confirmed_name: string
          p_period_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      resolve_active_company: {
        Args: never
        Returns: {
          company_id: string
          locale: string
          used_fallback: boolean
        }[]
      }
      resolve_active_company_gated: {
        Args: { p_grace_days: number }
        Returns: {
          company_id: string
          has_locked_membership: boolean
          locale: string
          used_fallback: boolean
        }[]
      }
      retag_line_dimensions: {
        Args: {
          p_company_id: string
          p_dimensions: Json
          p_line_id: string
          p_reason: string
          p_user_id?: string
        }
        Returns: Json
      }
      revert_rot_rut_reclaim_invoice: {
        Args: { p_company_id: string; p_invoice_id: string; p_item_id: string }
        Returns: Json
      }
      rot_rut_customer_outstanding: {
        Args: {
          p_deduction: number
          p_paid: number
          p_reclaimed: number
          p_total: number
        }
        Returns: number
      }
      rotate_company_inbox: {
        Args: { p_company_id: string }
        Returns: {
          company_id: string
          created_at: string
          deprecated_at: string | null
          id: string
          local_part: string
          slug_seed: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "company_inboxes"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      rotate_mcp_refresh_token: {
        Args: {
          p_grace_seconds: number
          p_new_key_hash: string
          p_new_key_prefix: string
          p_new_refresh_hash: string
          p_presented_hash: string
        }
        Returns: {
          outcome: string
          scopes: string[]
        }[]
      }
      sales_order_invoiced_quantities: {
        Args: { p_order_ids: string[] }
        Returns: {
          invoiced_qty: number
          sales_order_id: string
          sales_order_item_id: string
        }[]
      }
      seed_chart_of_accounts: {
        Args: { p_company_id: string; p_entity_type: string }
        Returns: undefined
      }
      set_cash_account_primary: {
        Args: { p_cash_account_id: string; p_company_id: string }
        Returns: undefined
      }
      settle_expense_claims_via_salary_run: {
        Args: {
          p_company_id: string
          p_salary_run_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      sie_correction_snapshots: {
        Args: { p_entry_id: string; p_rows: Json }
        Returns: Json
      }
      stage_peppol_delivery: {
        Args: {
          p_company_id: string
          p_customization_id: string
          p_filename: string
          p_invoice_id: string
          p_profile_id: string
          p_recipient_identifier: string
          p_recipient_scheme: string
          p_xml_payload: string
          p_xml_sha256: string
        }
        Returns: {
          company_id: string
          created_at: string
          customization_id: string
          evidence_retrieved_at: string | null
          filename: string
          id: string
          idempotency_key: string
          invoice_id: string
          profile_id: string
          provider: string | null
          provider_submission_id: string | null
          provider_tenant_id: string | null
          recipient_identifier: string
          recipient_scheme: string
          retention_expires_at: string
          status: string
          status_at: string
          status_detail: string | null
          submitted_at: string | null
          terminal_at: string | null
          updated_at: string
          user_id: string
          xml_payload: string
          xml_sha256: string
        }
        SetofOptions: {
          from: "*"
          to: "peppol_deliveries"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      supported_entity_types: { Args: never; Returns: string[] }
      sync_team_to_company: {
        Args: { p_company_id: string; p_team_id: string }
        Returns: undefined
      }
      total_amount: {
        Args: { je: Database["public"]["Tables"]["journal_entries"]["Row"] }
        Returns: number
      }
      transactions_without_documents: {
        Args: {
          p_company_id: string
          p_limit?: number
          p_offset?: number
          p_since?: string
        }
        Returns: Json
      }
      undo_bank_file_import: {
        Args: { p_company_id: string; p_import_id: string; p_user_id?: string }
        Returns: Json
      }
      undo_party_decisions: {
        Args: { p_company_id: string; p_party_ids: string[]; p_user_id: string }
        Returns: number
      }
      undo_party_merge: {
        Args: { p_company_id: string; p_decision_id: string; p_user_id: string }
        Returns: number
      }
      undo_party_promotions: {
        Args: { p_company_id: string; p_party_ids: string[]; p_user_id: string }
        Returns: number
      }
      undo_sie_import: {
        Args: { p_company_id: string; p_import_id: string; p_user_id?: string }
        Returns: number
      }
      update_overdue_supplier_invoices: { Args: never; Returns: undefined }
      user_company_ids: { Args: never; Returns: string[] }
      user_is_company_admin: {
        Args: { p_company_id: string }
        Returns: boolean
      }
      user_is_team_admin: { Args: { p_team_id: string }; Returns: boolean }
      user_role_in_company: { Args: { p_company_id: string }; Returns: string }
      user_team_ids: { Args: never; Returns: string[] }
      uuid_generate_v4: { Args: never; Returns: string }
      validate_and_increment_api_key: {
        Args: { p_key_hash: string }
        Returns: {
          api_key_id: string
          api_key_name: string
          company_id: string
          mode: string
          rate_limited: boolean
          scopes: string[]
          unattended_commit_limit: number
          user_id: string
        }[]
      }
      validate_and_increment_connector_key: {
        Args: { p_key_hash: string }
        Returns: {
          connector_key_id: string
          current_period_end: string
          instance_url: string
          limits: Json
          org_number: string
          rate_limited: boolean
          scopes: string[]
          status: string
        }[]
      }
      validate_version_chain: {
        Args: { p_document_id: string }
        Returns: {
          document_id: string
          hash_valid: boolean
          version: number
        }[]
      }
      verifikat_without_documents: {
        Args: {
          p_company_id: string
          p_limit?: number
          p_min_amount?: number
          p_offset?: number
          p_since?: string
        }
        Returns: Json
      }
      voucher_series_labels_valid: { Args: { labels: Json }; Returns: boolean }
    }
    Enums: {
      network_peer_status: "pending" | "active" | "suspended" | "rejected"
      overlay_invoice_state:
        | "draft"
        | "delivered"
        | "approved"
        | "disputed"
        | "cleared"
        | "settled"
      settlement_batch_status:
        | "draft"
        | "proposed"
        | "accepted"
        | "cleared"
        | "settled"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      network_peer_status: ["pending", "active", "suspended", "rejected"],
      overlay_invoice_state: [
        "draft",
        "delivered",
        "approved",
        "disputed",
        "cleared",
        "settled",
      ],
      settlement_batch_status: [
        "draft",
        "proposed",
        "accepted",
        "cleared",
        "settled",
        "failed",
      ],
    },
  },
} as const

