'use client';

/**
 * useImageProcessing — list + create image processing jobs for the
 * current user. Returns helpers the processar flow can use to log work.
 */

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type {
  ImageProcessingRow,
  ImageProcessingStatus,
} from '@/lib/supabase/types';
import { useSupabaseUser } from './useSupabaseUser';

interface UseImageProcessingOptions {
  limit?: number;
}

interface CreateJobInput {
  serviceType: string;
  inputUrl?: string;
  metadata?: Record<string, unknown>;
}

interface UpdateJobInput {
  status?: ImageProcessingStatus;
  outputUrl?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

interface UseImageProcessingResult {
  jobs: ImageProcessingRow[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  createJob: (input: CreateJobInput) => Promise<ImageProcessingRow | null>;
  updateJob: (
    id: string,
    input: UpdateJobInput,
  ) => Promise<ImageProcessingRow | null>;
}

export function useImageProcessing(
  options: UseImageProcessingOptions = {},
): UseImageProcessingResult {
  const { limit = 50 } = options;
  const { authUser } = useSupabaseUser();
  const [jobs, setJobs] = useState<ImageProcessingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!authUser) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from('image_processing')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;
      setJobs(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [authUser, limit]);

  const createJob = useCallback(
    async ({
      serviceType,
      inputUrl,
      metadata,
    }: CreateJobInput): Promise<ImageProcessingRow | null> => {
      if (!authUser) return null;

      const supabase = getSupabaseBrowserClient();
      const { data, error: insertError } = await supabase
        .from('image_processing')
        .insert({
          user_id: authUser.id,
          service_type: serviceType,
          status: 'queued',
          input_url: inputUrl ?? null,
          metadata: metadata ?? null,
        })
        .select('*')
        .single();

      if (insertError) {
        setError(insertError);
        return null;
      }

      setJobs((prev) => [data, ...prev]);
      return data;
    },
    [authUser],
  );

  const updateJob = useCallback(
    async (
      id: string,
      { status, outputUrl, errorMessage, metadata }: UpdateJobInput,
    ): Promise<ImageProcessingRow | null> => {
      if (!authUser) return null;

      const supabase = getSupabaseBrowserClient();
      const patch: Record<string, unknown> = {};
      if (status !== undefined) patch.status = status;
      if (outputUrl !== undefined) patch.output_url = outputUrl;
      if (errorMessage !== undefined) patch.error_message = errorMessage;
      if (metadata !== undefined) patch.metadata = metadata;
      if (status === 'completed' || status === 'failed') {
        patch.completed_at = new Date().toISOString();
      }

      const { data, error: updateError } = await supabase
        .from('image_processing')
        .update(patch)
        .eq('id', id)
        .eq('user_id', authUser.id)
        .select('*')
        .single();

      if (updateError) {
        setError(updateError);
        return null;
      }

      setJobs((prev) => prev.map((job) => (job.id === id ? data : job)));
      return data;
    },
    [authUser],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { jobs, loading, error, refresh, createJob, updateJob };
}
