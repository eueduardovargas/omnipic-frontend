/**
 * Database type definitions for Supabase.
 * Mirrors the SQL schema in `src/lib/supabase/schema.sql`.
 * Can be regenerated via `supabase gen types typescript`.
 */

export type PlanType = 'weekly' | 'monthly' | 'annual';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';
export type ImageProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  receipt_url: string | null;
  created_at: string;
}

export interface ImageProcessingRow {
  id: string;
  user_id: string;
  service_type: string;
  status: ImageProcessingStatus;
  input_url: string | null;
  output_url: string | null;
  metadata: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

type EmptyRelationships = [];

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserRow, 'id'>>;
        Relationships: EmptyRelationships;
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: Omit<SubscriptionRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SubscriptionRow, 'id'>>;
        Relationships: EmptyRelationships;
      };
      payments: {
        Row: PaymentRow;
        Insert: Omit<PaymentRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PaymentRow, 'id'>>;
        Relationships: EmptyRelationships;
      };
      image_processing: {
        Row: ImageProcessingRow;
        Insert: Omit<ImageProcessingRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ImageProcessingRow, 'id'>>;
        Relationships: EmptyRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
