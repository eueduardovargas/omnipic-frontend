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
  isAuthenticated,
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
  const [fileInfo, setFileInfo] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setPreview(src);

        const img = new window.Image();
        img.onload = () =>
          setFileInfo({ width: img.width, height: img.height });
        img.src = src;
      };
      reader.readAsDataURL(file);

      onFileSelect?.(file);
    },
    [onFileSelect]
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
  };

  if (preview) {
    return (
      <motion.div
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 bg-accent-emerald/20 text-accent-emerald px-3 py-1.5 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            {t('faceDetected')}
          </span>

          {fileInfo && (
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-muted">
              <ImageIcon className="w-4 h-4" />
              {t('resolution')}: {fileInfo.width}x{fileInfo.height}
            </span>
          )}

          <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-muted">
            <CheckCircle className="w-4 h-4" />
            {t('orientation')}
          </span>
        </div>

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
        isDragOver
          ? 'border-accent-violet bg-accent-violet/10'
          : 'border-border hover:border-accent-violet/50'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <Upload className="w-12 h-12 text-muted mb-4" />

      <p className="text-lg font-medium mb-2">{t('uploadTitle')}</p>
      <p className="text-muted text-sm mb-4">{t('uploadDescription')}</p>
      <p className="text-muted/60 text-xs">{t('uploadFormats')}</p>
    </label>
  );
}
