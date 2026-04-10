/**
 * n8n webhook integration for OmniPic photo processing.
 *
 * On image upload from a service card, the client uploads the file to a temporary
 * location (or sends as base64) and calls the n8n webhook with metadata so n8n can
 * orchestrate the AI pipeline (Replicate, fal.ai, etc.) and store the result.
 */

export interface WebhookPayload {
  userId: string;
  service: string;
  imageUrl?: string;
  imageBase64?: string;
  metadata?: Record<string, unknown>;
}

export interface WebhookResponse {
  ok: boolean;
  jobId?: string;
  resultUrl?: string;
  error?: string;
}

const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  'https://n8n.omnipic.net/webhook/photo-process';

/**
 * Reads a File object as a Base64 data URL string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sends a photo + metadata to the n8n webhook for processing.
 */
export async function sendToN8nWebhook(
  payload: WebhookPayload
): Promise<WebhookResponse> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Webhook returned ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      jobId: data.jobId,
      resultUrl: data.resultUrl,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown webhook error',
    };
  }
}

/**
 * Convenience: upload a local File to n8n with given service id and optional metadata.
 */
export async function processPhotoWithWebhook(
  file: File,
  service: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<WebhookResponse> {
  const imageBase64 = await fileToBase64(file);
  return sendToN8nWebhook({
    userId,
    service,
    imageBase64,
    metadata: {
      ...metadata,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
    },
  });
}

/**
 * Mock auth check — in production this would verify the user's session token.
 * For now we check localStorage for an `omnipic-user` token set on login.
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem('omnipic-user');
  } catch {
    return false;
  }
}

/**
 * Returns the current authenticated user id from localStorage, or null.
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('omnipic-user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.id || parsed.email || null;
  } catch {
    return null;
  }
}
