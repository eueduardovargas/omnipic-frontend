'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  ImageIcon,
  CheckCircle,
  Loader2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import {
  processPhotoWithWebhook,
  isAuthenticated,
  getCurrentUserId,
} from '@/lib/n8n-webhook';

interface UploadZoneProps {
  onFileSelect?: (file: File) => void;
  service?: string;
  enableWebhook?: boolean;
}

export default function UploadZone({
  onFileSelect,
  service = 'enhance',
  enableWebhook = false,
}: UploadZoneProps) {
  const t = useTranslations('smartflow');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ width: number; height: number } | null>(null);
  const [webhookState, setWebhookState] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle'
  );
  const [webhookError, setWebhookError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setPreview(src);
        const img = new window.Image();
        img.onload = () => setFileInfo({ width: img.width, height: img.height });
        img.src = src;
      };
      reader.readAsDataURL(file);
      onFileSelect?.(file);

      // Trigger n8n webhook if enabled
      if (enableWebhook) {
        if (!isAuthenticated()) {
          router.push(`/${locale}/auth?redirect=service&service=${service}`);
          return;
        }
        setWebhookState('sending');
        setWebhookError(null);
        const userId = getCurrentUserId() || 'anonymous';
        processPhotoWithWebhook(file, service, userId)
          .then((res) => {
            if (res.ok) {
              setWebhookState('success');
            } else {
              setWebhookState('error');
              setWebhookError(res.error || 'Erro desconhecido');
            }
          })
          .catch((err) => {
            setWebhookState('error');
            setWebhookError(err.message);
          });
      }
    },
    [onFileSelect, enableWebhook, service, router, locale]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setPreview(null);
    setFileInfo(null);
    setWebhookState('idle');
    setWebhookError(null);
  };

  if (preview) {
    return (
      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative rounded-lg overflow-hidden max-h-[400px]">
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 bg-accent-emerald/20 text-accent-emerald px-3 py-1.5 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" /> {t('faceDetected')}
          </span>
          {fileInfo && (
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-muted">
              <ImageIcon className="w-4 h-4" /> {t('resolution')}: {fileInfo.width}x{fileInfo.height}
            </span>
          )}
          <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-muted">
            <CheckCircle className="w-4 h-4" /> {t('orientation')}
          </span>
        </div>

        {/* Webhook status */}
        {webhookState === 'sending' && (
          <div className="flex items-center gap-2 p-3 bg-accent-violet/10 border border-accent-violet/30 rounded-xl text-accent-violet text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando para processamento...
          </div>
        )}
        {webhookState === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-accent-emerald/10 border border-accent-emerald/30 rounded-xl text-accent-emerald text-sm">
            <CheckCircle className="w-4 h-4" />
            Imagem enviada com sucesso! O processamento está em andamento.
          </div>
        )}
        {webhookState === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            Erro: {webhookError}
          </div>
        )}

        <button
          onClick={reset}
          className="text-sm text-muted hover:text-white transition-colors"
        >
          Trocar imagem
        </button>
      </motion.div>
    );
  }

  return (
    <label
      className={`glass-card flex flex-col items-center justify-center p-12 cursor-pointer border-2 border-dashed transition-colors ${
        isDragOver ? 'border-accent-violet bg-accent-violet/10' : 'border-border hover:border-accent-violet/50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {enableWebhook && !isAuthenticated() ? (
        <Lock className="w-12 h-12 text-muted mb-4" />
      ) : (
        <Upload className="w-12 h-12 text-muted mb-4" />
      )}
      <p className="text-lg font-medium mb-2">{t('uploadTitle')}</p>
      <p className="text-muted text-sm mb-4">{t('uploadDescription')}</p>
      <p className="text-muted/60 text-xs">{t('uploadFormats')}</p>
      {enableWebhook && !isAuthenticated() && (
        <p className="text-accent-violet text-xs mt-3 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Faça login para enviar sua foto
        </p>
      )}
    </label>
  );
}
