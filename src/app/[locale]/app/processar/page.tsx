'use client';

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, UserPlus, Eraser, Wand2, Heart,
  Camera, Users, Briefcase, Image,
  Sun, Moon, CloudSun,
  Zap, Gauge, Smile, Frown, Meh,
  Eye, Paintbrush,
  ArrowLeft, ArrowRight, Check, Download, Sparkles, Lock,
} from 'lucide-react';
import { ServiceType, FlowAnswers } from '@/types';
import { smartFlowServices } from '@/lib/smart-flow';
import { buildPrompt } from '@/lib/prompt-builder';
import {
  processPhotoWithWebhook,
  getCurrentUserId,
} from '@/lib/n8n-webhook';
import UploadZone from '@/components/shared/UploadZone';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Play, Clock, UserPlus, Eraser, Wand2, Heart,
};

const TOTAL_STEPS = 5;
const VALID_SERVICES: ServiceType[] = [
  'video', 'restauracao', 'composicao', 'limpeza', 'estilizacao', 'reconstrucao',
];

function ProcessarPageContent() {
  const t = useTranslations('smartflow');
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const preselectedService = useMemo<ServiceType | null>(() => {
    const raw = searchParams?.get('service');
    if (!raw) return null;
    return VALID_SERVICES.includes(raw as ServiceType) ? (raw as ServiceType) : null;
  }, [searchParams]);

  const initialStep = preselectedService ? 1 : 0;
  const initialAnswers: Partial<FlowAnswers> = preselectedService
    ? { servico: preselectedService }
    : {};

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [answers, setAnswers] = useState<Partial<FlowAnswers>>(initialAnswers);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [hasWatermark, setHasWatermark] = useState(true);

  const processingMessages: string[] = t.raw('processingMessages');

  // Determine how many result images to show
  // Non-subscribers: always 1 image
  // Subscribers + reconstrucao (Memorias Vivas): 3 images
  // Subscribers + other services: 1 image
  const resultCount = useMemo(() => {
    const isSubscriber = false; // Will be integrated with Stripe later
    if (isSubscriber && answers.servico === 'reconstrucao') return 3;
    return 1;
  }, [answers.servico]);

  useEffect(() => {
    if (preselectedService && answers.servico !== preselectedService) {
      setAnswers((prev) => ({ ...prev, servico: preselectedService }));
      if (currentStep === 0) setCurrentStep(1);
    }
  }, [preselectedService, answers.servico, currentStep]);

  const updateAnswer = useCallback((key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canNext = useCallback(() => {
    if (currentStep === 0) return !!answers.servico;
    if (currentStep === 1) return !!answers.qualidade && !!answers.iluminacao;
    if (currentStep === 2) return !!answers.tipoFoto;
    if (currentStep === 3) return !!file;
    return false;
  }, [currentStep, answers, file]);

  const startProcessing = useCallback(async () => {
    setProcessing(true);
    setProgress(0);
    setMsgIndex(0);
    setResultError(null);

    const prompt = buildPrompt(answers as FlowAnswers);
    console.log('Generated AI Prompt:', prompt);

    if (file) {
      const userId = getCurrentUserId() || 'anonymous';
      try {
        const response = await processPhotoWithWebhook(
          file,
          answers.servico || 'restauracao',
          userId,
          prompt,
          answers as Record<string, unknown>,
        );

        if (response.ok && response.resultUrl) {
          setResultUrl(response.resultUrl);
          setHasWatermark(response.hasWatermark ?? true);
        } else if (response.error) {
          setResultError(response.error);
        }
      } catch (err) {
        console.error('Processing error:', err);
        setResultError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    }
  }, [answers, file]);

  // Progress animation
  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          setProcessing(false);
          return 100;
        }
        return p + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [processing]);

  // Rotating messages
  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % processingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [processing, processingMessages.length]);

  const handleNext = () => {
    if (currentStep === 3) {
      setCurrentStep(4);
      startProcessing();
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep((s) => s + 1);
  };

  // Option card helper
  const OptionCard = ({
    selected,
    onClick,
    label,
    icon: Icon,
  }: {
    selected: boolean;
    onClick: () => void;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-all ${
        selected
          ? 'border-accent-violet bg-accent-violet/20 text-white'
          : 'border-border bg-card hover:border-accent-violet/50 text-muted'
      }`}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="pt-20 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-3">
            {(() => {
              const allLabels = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5')];
              const visibleLabels = preselectedService ? allLabels.slice(1) : allLabels;
              const offset = preselectedService ? 1 : 0;
              return visibleLabels.map((label, idx) => {
                const stepIndex = idx + offset;
                return (
                  <span
                    key={idx}
                    className={`text-xs font-medium ${
                      stepIndex <= currentStep ? 'text-white' : 'text-muted/50'
                    }`}
                  >
                    {label}
                  </span>
                );
              });
            })()}
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-accent rounded-full"
              animate={{
                width: `${
                  preselectedService
                    ? ((currentStep - 1 + 1) / (TOTAL_STEPS - 1)) * 100
                    : ((currentStep + 1) / TOTAL_STEPS) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: Service Selection */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-8">{t('title')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {smartFlowServices.map((svc) => {
                  const Icon = serviceIcons[svc.icon] || Sparkles;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => updateAnswer('servico', svc.id)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-card border transition-all ${
                        answers.servico === svc.id
                          ? 'border-accent-violet bg-accent-violet/20 text-white shadow-lg shadow-accent-violet/20'
                          : 'border-border bg-card hover:border-accent-violet/50 text-muted'
                      }`}
                    >
                      <Icon className="w-10 h-10" />
                      <span className="text-sm font-semibold text-center">
                        {t(svc.labelKey)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Qualidade e Iluminacao */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-semibold mb-4">{t('currentQuality')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <OptionCard
                    selected={answers.qualidade === 'baixa'}
                    onClick={() => updateAnswer('qualidade', 'baixa')}
                    label={t('low')}
                  />
                  <OptionCard
                    selected={answers.qualidade === 'media'}
                    onClick={() => updateAnswer('qualidade', 'media')}
                    label={t('medium')}
                  />
                  <OptionCard
                    selected={answers.qualidade === 'alta'}
                    onClick={() => updateAnswer('qualidade', 'alta')}
                    label={t('high')}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t('lighting')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <OptionCard
                    selected={answers.iluminacao === 'escura'}
                    onClick={() => updateAnswer('iluminacao', 'escura')}
                    label={t('dark')}
                    icon={Moon}
                  />
                  <OptionCard
                    selected={answers.iluminacao === 'normal'}
                    onClick={() => updateAnswer('iluminacao', 'normal')}
                    label={t('normal')}
                    icon={CloudSun}
                  />
                  <OptionCard
                    selected={answers.iluminacao === 'clara'}
                    onClick={() => updateAnswer('iluminacao', 'clara')}
                    label={t('bright')}
                    icon={Sun}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Tipo de Foto + Service-specific questions */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Tipo de Foto */}
              <div>
                <h3 className="font-semibold mb-4">{t('photoType')}</h3>
                <div className="grid grid-cols-4 gap-3">
                  <OptionCard
                    selected={answers.tipoFoto === 'selfie'}
                    onClick={() => updateAnswer('tipoFoto', 'selfie')}
                    label={t('selfie')}
                    icon={Camera}
                  />
                  <OptionCard
                    selected={answers.tipoFoto === 'grupo'}
                    onClick={() => updateAnswer('tipoFoto', 'grupo')}
                    label={t('group')}
                    icon={Users}
                  />
                  <OptionCard
                    selected={answers.tipoFoto === 'profissional'}
                    onClick={() => updateAnswer('tipoFoto', 'profissional')}
                    label={t('professional')}
                    icon={Briefcase}
                  />
                  <OptionCard
                    selected={answers.tipoFoto === 'antiga'}
                    onClick={() => updateAnswer('tipoFoto', 'antiga')}
                    label={t('old')}
                    icon={Image}
                  />
                </div>
              </div>

              {/* Service-specific: video */}
              {answers.servico === 'video' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('motionType')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tipoMovimento === 'natural'} onClick={() => updateAnswer('tipoMovimento', 'natural')} label={t('natural')} />
                      <OptionCard selected={answers.tipoMovimento === 'cinematico'} onClick={() => updateAnswer('tipoMovimento', 'cinematico')} label={t('cinematic')} />
                      <OptionCard selected={answers.tipoMovimento === 'emocional'} onClick={() => updateAnswer('tipoMovimento', 'emocional')} label={t('emotional')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('intensity')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.intensidade === 'suave'} onClick={() => updateAnswer('intensidade', 'suave')} label={t('gentle')} />
                      <OptionCard selected={answers.intensidade === 'media'} onClick={() => updateAnswer('intensidade', 'media')} label={t('moderate')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('expression')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.expressao === 'sorrindo'} onClick={() => updateAnswer('expressao', 'sorrindo')} label={t('smiling')} icon={Smile} />
                      <OptionCard selected={answers.expressao === 'neutro'} onClick={() => updateAnswer('expressao', 'neutro')} label={t('neutral')} icon={Meh} />
                      <OptionCard selected={answers.expressao === 'emocional'} onClick={() => updateAnswer('expressao', 'emocional')} label={t('emotional')} icon={Heart} />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific: restauracao */}
              {answers.servico === 'restauracao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('keepOriginal')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.manterOriginal === true} onClick={() => updateAnswer('manterOriginal', true)} label={t('yes')} />
                      <OptionCard selected={answers.manterOriginal === false} onClick={() => updateAnswer('manterOriginal', false)} label={t('improveSlightly')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('desiredTone')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.tomDesejado === 'realista'} onClick={() => updateAnswer('tomDesejado', 'realista')} label={t('realistic')} />
                      <OptionCard selected={answers.tomDesejado === 'moderno'} onClick={() => updateAnswer('tomDesejado', 'moderno')} label={t('slightlyModern')} />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific: composicao */}
              {answers.servico === 'composicao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('angle')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.angulo === 'frontal'} onClick={() => updateAnswer('angulo', 'frontal')} label={t('frontal')} />
                      <OptionCard selected={answers.angulo === 'lateral'} onClick={() => updateAnswer('angulo', 'lateral')} label={t('lateral')} />
                      <OptionCard selected={answers.angulo === 'desconhecido'} onClick={() => updateAnswer('angulo', 'desconhecido')} label={t('unknown')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('distance')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.distancia === 'proximo'} onClick={() => updateAnswer('distancia', 'proximo')} label={t('close')} />
                      <OptionCard selected={answers.distancia === 'medio'} onClick={() => updateAnswer('distancia', 'medio')} label={t('medium')} />
                      <OptionCard selected={answers.distancia === 'longe'} onClick={() => updateAnswer('distancia', 'longe')} label={t('far')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('sceneLighting')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.iluminacaoCena === 'quente'} onClick={() => updateAnswer('iluminacaoCena', 'quente')} label={t('warm')} />
                      <OptionCard selected={answers.iluminacaoCena === 'fria'} onClick={() => updateAnswer('iluminacaoCena', 'fria')} label={t('cold')} />
                      <OptionCard selected={answers.iluminacaoCena === 'natural'} onClick={() => updateAnswer('iluminacaoCena', 'natural')} label={t('natural')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('interactionType')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tipoInteracao === 'sem-contato'} onClick={() => updateAnswer('tipoInteracao', 'sem-contato')} label={t('noContact')} />
                      <OptionCard selected={answers.tipoInteracao === 'proximo'} onClick={() => updateAnswer('tipoInteracao', 'proximo')} label={t('nearby')} />
                      <OptionCard selected={answers.tipoInteracao === 'abraco'} onClick={() => updateAnswer('tipoInteracao', 'abraco')} label={t('hug')} />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific: limpeza */}
              {answers.servico === 'limpeza' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('bgComplexity')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.complexidadeFundo === 'simples'} onClick={() => updateAnswer('complexidadeFundo', 'simples')} label={t('simple')} />
                      <OptionCard selected={answers.complexidadeFundo === 'medio'} onClick={() => updateAnswer('complexidadeFundo', 'medio')} label={t('medium')} />
                      <OptionCard selected={answers.complexidadeFundo === 'complexo'} onClick={() => updateAnswer('complexidadeFundo', 'complexo')} label={t('complex')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('bgPreference')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.preferenciaFundo === 'recriar'} onClick={() => updateAnswer('preferenciaFundo', 'recriar')} label={t('recreateBg')} />
                      <OptionCard selected={answers.preferenciaFundo === 'limpo'} onClick={() => updateAnswer('preferenciaFundo', 'limpo')} label={t('cleanBg')} />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific: estilizacao */}
              {answers.servico === 'estilizacao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('baseStyle')}</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <OptionCard selected={answers.estiloBase === 'cinema'} onClick={() => updateAnswer('estiloBase', 'cinema')} label={t('cinema')} />
                      <OptionCard selected={answers.estiloBase === 'estudio'} onClick={() => updateAnswer('estiloBase', 'estudio')} label={t('studio')} />
                      <OptionCard selected={answers.estiloBase === 'instagram'} onClick={() => updateAnswer('estiloBase', 'instagram')} label={t('instagram')} />
                      <OptionCard selected={answers.estiloBase === 'vintage'} onClick={() => updateAnswer('estiloBase', 'vintage')} label={t('vintage')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('realismLevel')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.nivelRealismo === 'natural'} onClick={() => updateAnswer('nivelRealismo', 'natural')} label={t('natural')} />
                      <OptionCard selected={answers.nivelRealismo === 'estilizado'} onClick={() => updateAnswer('nivelRealismo', 'estilizado')} label={t('stylized')} />
                    </div>
                  </div>
                </>
              )}

              {/* Service-specific: reconstrucao */}
              {answers.servico === 'reconstrucao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('estimatedAge')}</h3>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={answers.idadeEstimada || ''}
                      onChange={(e) => updateAnswer('idadeEstimada', parseInt(e.target.value) || undefined)}
                      className="w-32 bg-background border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-accent-violet"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('howToSee')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.comoVer === 'hoje'} onClick={() => updateAnswer('comoVer', 'hoje')} label={t('asToday')} />
                      <OptionCard selected={answers.comoVer === 'idade-especifica'} onClick={() => updateAnswer('comoVer', 'idade-especifica')} label={t('specificAge')} />
                    </div>
                  </div>
                  {answers.comoVer === 'idade-especifica' && (
                    <div>
                      <h3 className="font-semibold mb-4">{t('desiredAge')}</h3>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={answers.idadeDesejada || ''}
                        onChange={(e) => updateAnswer('idadeDesejada', parseInt(e.target.value) || undefined)}
                        className="w-32 bg-background border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-accent-violet"
                        placeholder="60"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-4">{t('emotionalTone')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tomEmocional === 'natural'} onClick={() => updateAnswer('tomEmocional', 'natural')} label={t('natural')} icon={Meh} />
                      <OptionCard selected={answers.tomEmocional === 'sorrindo'} onClick={() => updateAnswer('tomEmocional', 'sorrindo')} label={t('smiling')} icon={Smile} />
                      <OptionCard selected={answers.tomEmocional === 'serio'} onClick={() => updateAnswer('tomEmocional', 'serio')} label={t('serious')} icon={Frown} />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 3: Upload */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold mb-8">{t('uploadTitle')}</h2>
              <UploadZone
                onFileSelect={(f) => setFile(f)}
                service={(answers.servico as string) || 'enhance'}
                enableWebhook={false}
              />
            </motion.div>
          )}

          {/* STEP 4: Processing / Results */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {!done ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative w-32 h-32 mb-8">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1F1F1F" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(progress / 100) * 339.292} 339.292`}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{progress}%</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium mb-2">{t('processing')}</p>
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-muted"
                  >
                    {processingMessages[msgIndex]}
                  </motion.p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-8">{t('results')}</h2>

                  {/* Error state */}
                  {resultError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
                      Erro: {resultError}
                    </div>
                  )}

                  {/* Results grid */}
                  <div className={`grid gap-6 mb-8 ${resultCount === 1 ? 'grid-cols-1 max-w-lg mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {Array.from({ length: resultCount }, (_, i) => i + 1).map((n) => (
                      <motion.div
                        key={n}
                        className={`glass-card overflow-hidden cursor-pointer transition-all ${
                          selectedResult === n ? 'ring-2 ring-accent-violet' : ''
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: n * 0.2 }}
                        onClick={() => setSelectedResult(n)}
                      >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-card to-accent-violet/10 flex items-center justify-center">
                          {resultUrl ? (
                            <>
                              <img
                                src={resultUrl}
                                alt={`Resultado ${n}`}
                                className="w-full h-full object-contain"
                              />
                              {/* Watermark overlay for non-subscribers */}
                              {hasWatermark && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="text-white/30 text-4xl font-bold rotate-[-30deg] select-none">
                                    OmniPic
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <Sparkles className="w-12 h-12 text-accent-violet/40" />
                          )}
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResult(n);
                            }}
                            className={`text-sm font-medium px-4 py-2 rounded-btn transition-all ${
                              selectedResult === n
                                ? 'bg-gradient-accent text-white'
                                : 'border border-border hover:border-accent-violet/50'
                            }`}
                          >
                            {selectedResult === n ? <Check className="w-4 h-4 inline mr-1" /> : null}
                            {t('chooseThis')}
                          </button>
                          <span className="text-xs text-muted bg-white/5 px-2 py-1 rounded">
                            {t('resolution4K')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Watermark notice for non-subscribers */}
                  {hasWatermark && (
                    <div className="flex items-center gap-3 p-4 bg-accent-violet/10 border border-accent-violet/30 rounded-xl mb-6">
                      <Lock className="w-5 h-5 text-accent-violet flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-accent-violet">Imagem com marca d&apos;agua</p>
                        <p className="text-xs text-muted mt-1">
                          Assine um plano para baixar sem marca d&apos;agua em alta resolucao.
                        </p>
                      </div>
                      <a
                        href={`/${locale}/planos`}
                        className="ml-auto bg-gradient-accent text-white text-sm font-medium px-4 py-2 rounded-btn hover:opacity-90 transition-opacity flex-shrink-0"
                      >
                        Ver Planos
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!hasWatermark ? (
                      <a
                        href={resultUrl || '#'}
                        download="omnipic-resultado.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gradient-accent text-white font-semibold px-8 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-5 h-5" />
                        {t('downloadHD')}
                      </a>
                    ) : (
                      <a
                        href={`/${locale}/planos`}
                        className="flex items-center justify-center gap-2 bg-gradient-accent text-white font-semibold px-8 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
                      >
                        <Lock className="w-5 h-5" />
                        Assinar para Baixar HD
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setCurrentStep(preselectedService ? 1 : 0);
                        setAnswers(preselectedService ? { servico: preselectedService } : {});
                        setFile(null);
                        setDone(false);
                        setSelectedResult(null);
                        setResultUrl(null);
                        setResultError(null);
                        setHasWatermark(true);
                      }}
                      className="flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-btn hover:bg-white/10 transition-colors"
                    >
                      {t('newProject')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-10">
            <button
              onClick={() =>
                setCurrentStep((s) => Math.max(preselectedService ? 1 : 0, s - 1))
              }
              disabled={currentStep === (preselectedService ? 1 : 0)}
              className="flex items-center gap-2 px-6 py-3 border border-border rounded-btn hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('previous')}
            </button>

            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-gradient-accent text-white font-medium px-6 py-3 rounded-btn hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentStep === 3 ? t('processWithAI') : t('next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProcessarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin" />
        </div>
      }
    >
      <ProcessarPageContent />
    </Suspense>
  );
}
'use client';

import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, UserPlus, Eraser, Wand2, Heart,
  Camera, Users, Briefcase, Image, Sun, Moon, CloudSun,
  Zap, Gauge, Smile, Frown, Meh, Eye, Paintbrush,
  ArrowLeft, ArrowRight, Check, Download, Sparkles,
} from 'lucide-react';
import { ServiceType, FlowAnswers } from '@/types';
import { smartFlowServices } from '@/lib/smart-flow';
import { buildPrompt } from '@/lib/prompt-builder';
import UploadZone from '@/components/shared/UploadZone';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Play, Clock, UserPlus, Eraser, Wand2, Heart,
};

const TOTAL_STEPS = 5;

const VALID_SERVICES: ServiceType[] = [
  'video',
  'restauracao',
  'composicao',
  'limpeza',
  'estilizacao',
  'reconstrucao',
];

function ProcessarPageContent() {
  const t = useTranslations('smartflow');
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  // Read the ?service=xxx URL param and validate it
  const preselectedService = useMemo<ServiceType | null>(() => {
    const raw = searchParams?.get('service');
    if (!raw) return null;
    return VALID_SERVICES.includes(raw as ServiceType) ? (raw as ServiceType) : null;
  }, [searchParams]);

  // If we have a preselected service, skip Step 0 and start at Step 1
  const initialStep = preselectedService ? 1 : 0;
  const initialAnswers: Partial<FlowAnswers> = preselectedService
    ? { servico: preselectedService }
    : {};

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [answers, setAnswers] = useState<Partial<FlowAnswers>>(initialAnswers);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  const processingMessages: string[] = t.raw('processingMessages');

  // Keep state in sync if the URL param changes after mount
  useEffect(() => {
    if (preselectedService && answers.servico !== preselectedService) {
      setAnswers((prev) => ({ ...prev, servico: preselectedService }));
      if (currentStep === 0) setCurrentStep(1);
    }
  }, [preselectedService, answers.servico, currentStep]);

  const updateAnswer = useCallback((key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const canNext = useCallback(() => {
    if (currentStep === 0) return !!answers.servico;
    if (currentStep === 1) return !!answers.tipoFoto && !!answers.qualidade && !!answers.iluminacao;
    if (currentStep === 2) return true;
    if (currentStep === 3) return !!file;
    return false;
  }, [currentStep, answers, file]);

  const startProcessing = useCallback(() => {
    setProcessing(true);
    setProgress(0);
    setMsgIndex(0);
    const prompt = buildPrompt(answers as FlowAnswers);
    console.log('Generated AI Prompt:', prompt);
  }, [answers]);

  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setDone(true); setProcessing(false); return 100; }
        return p + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [processing]);

  useEffect(() => {
    if (!processing) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % processingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [processing, processingMessages.length]);

  const handleNext = () => {
    if (currentStep === 3) { setCurrentStep(4); startProcessing(); return; }
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep((s) => s + 1);
  };

  // Option card helper
  const OptionCard = ({ selected, onClick, label, icon: Icon }: {
    selected: boolean; onClick: () => void; label: string; icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-card border transition-all ${
        selected ? 'border-accent-violet bg-accent-violet/20 text-white' : 'border-border bg-card hover:border-accent-violet/50 text-muted'
      }`}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="pt-20 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-3">
            {(() => {
              const allLabels = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5')];
              // When a service is preselected, skip the first label (service picker)
              const visibleLabels = preselectedService ? allLabels.slice(1) : allLabels;
              const offset = preselectedService ? 1 : 0;
              return visibleLabels.map((label, idx) => {
                const stepIndex = idx + offset;
                return (
                  <span
                    key={idx}
                    className={`text-xs font-medium ${
                      stepIndex <= currentStep ? 'text-white' : 'text-muted/50'
                    }`}
                  >
                    {label}
                  </span>
                );
              });
            })()}
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-accent rounded-full"
              animate={{
                width: `${
                  preselectedService
                    ? ((currentStep - 1 + 1) / (TOTAL_STEPS - 1)) * 100
                    : ((currentStep + 1) / TOTAL_STEPS) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: Service Selection */}
          {currentStep === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-8">{t('title')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {smartFlowServices.map((svc) => {
                  const Icon = serviceIcons[svc.icon] || Sparkles;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => updateAnswer('servico', svc.id)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-card border transition-all ${
                        answers.servico === svc.id
                          ? 'border-accent-violet bg-accent-violet/20 text-white shadow-lg shadow-accent-violet/20'
                          : 'border-border bg-card hover:border-accent-violet/50 text-muted'
                      }`}
                    >
                      <Icon className="w-10 h-10" />
                      <span className="text-sm font-semibold text-center">{t(svc.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Universal Context */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">{t('photoType')}</h3>
                <div className="grid grid-cols-4 gap-3">
                  <OptionCard selected={answers.tipoFoto === 'selfie'} onClick={() => updateAnswer('tipoFoto', 'selfie')} label={t('selfie')} icon={Camera} />
                  <OptionCard selected={answers.tipoFoto === 'grupo'} onClick={() => updateAnswer('tipoFoto', 'grupo')} label={t('group')} icon={Users} />
                  <OptionCard selected={answers.tipoFoto === 'profissional'} onClick={() => updateAnswer('tipoFoto', 'profissional')} label={t('professional')} icon={Briefcase} />
                  <OptionCard selected={answers.tipoFoto === 'antiga'} onClick={() => updateAnswer('tipoFoto', 'antiga')} label={t('old')} icon={Image} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('currentQuality')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <OptionCard selected={answers.qualidade === 'baixa'} onClick={() => updateAnswer('qualidade', 'baixa')} label={t('low')} />
                  <OptionCard selected={answers.qualidade === 'media'} onClick={() => updateAnswer('qualidade', 'media')} label={t('medium')} />
                  <OptionCard selected={answers.qualidade === 'alta'} onClick={() => updateAnswer('qualidade', 'alta')} label={t('high')} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">{t('lighting')}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <OptionCard selected={answers.iluminacao === 'escura'} onClick={() => updateAnswer('iluminacao', 'escura')} label={t('dark')} icon={Moon} />
                  <OptionCard selected={answers.iluminacao === 'normal'} onClick={() => updateAnswer('iluminacao', 'normal')} label={t('normal')} icon={CloudSun} />
                  <OptionCard selected={answers.iluminacao === 'clara'} onClick={() => updateAnswer('iluminacao', 'clara')} label={t('bright')} icon={Sun} />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Service-specific questions */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              {answers.servico === 'video' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('motionType')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tipoMovimento === 'natural'} onClick={() => updateAnswer('tipoMovimento', 'natural')} label={t('natural')} />
                      <OptionCard selected={answers.tipoMovimento === 'cinematico'} onClick={() => updateAnswer('tipoMovimento', 'cinematico')} label={t('cinematic')} />
                      <OptionCard selected={answers.tipoMovimento === 'emocional'} onClick={() => updateAnswer('tipoMovimento', 'emocional')} label={t('emotional')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('intensity')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.intensidade === 'suave'} onClick={() => updateAnswer('intensidade', 'suave')} label={t('gentle')} />
                      <OptionCard selected={answers.intensidade === 'media'} onClick={() => updateAnswer('intensidade', 'media')} label={t('moderate')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('expression')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.expressao === 'sorrindo'} onClick={() => updateAnswer('expressao', 'sorrindo')} label={t('smiling')} icon={Smile} />
                      <OptionCard selected={answers.expressao === 'neutro'} onClick={() => updateAnswer('expressao', 'neutro')} label={t('neutral')} icon={Meh} />
                      <OptionCard selected={answers.expressao === 'emocional'} onClick={() => updateAnswer('expressao', 'emocional')} label={t('emotional')} icon={Heart} />
                    </div>
                  </div>
                </>
              )}

              {answers.servico === 'restauracao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('damageLevel')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.nivelDano === 'leve'} onClick={() => updateAnswer('nivelDano', 'leve')} label={t('light')} />
                      <OptionCard selected={answers.nivelDano === 'medio'} onClick={() => updateAnswer('nivelDano', 'medio')} label={t('medium')} />
                      <OptionCard selected={answers.nivelDano === 'alto'} onClick={() => updateAnswer('nivelDano', 'alto')} label={t('heavy')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('keepOriginal')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.manterOriginal === true} onClick={() => updateAnswer('manterOriginal', true)} label={t('yes')} />
                      <OptionCard selected={answers.manterOriginal === false} onClick={() => updateAnswer('manterOriginal', false)} label={t('improveSlightly')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('desiredTone')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.tomDesejado === 'realista'} onClick={() => updateAnswer('tomDesejado', 'realista')} label={t('realistic')} />
                      <OptionCard selected={answers.tomDesejado === 'moderno'} onClick={() => updateAnswer('tomDesejado', 'moderno')} label={t('slightlyModern')} />
                    </div>
                  </div>
                </>
              )}

              {answers.servico === 'composicao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('angle')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.angulo === 'frontal'} onClick={() => updateAnswer('angulo', 'frontal')} label={t('frontal')} />
                      <OptionCard selected={answers.angulo === 'lateral'} onClick={() => updateAnswer('angulo', 'lateral')} label={t('lateral')} />
                      <OptionCard selected={answers.angulo === 'desconhecido'} onClick={() => updateAnswer('angulo', 'desconhecido')} label={t('unknown')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('distance')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.distancia === 'proximo'} onClick={() => updateAnswer('distancia', 'proximo')} label={t('close')} />
                      <OptionCard selected={answers.distancia === 'medio'} onClick={() => updateAnswer('distancia', 'medio')} label={t('medium')} />
                      <OptionCard selected={answers.distancia === 'longe'} onClick={() => updateAnswer('distancia', 'longe')} label={t('far')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('sceneLighting')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.iluminacaoCena === 'quente'} onClick={() => updateAnswer('iluminacaoCena', 'quente')} label={t('warm')} />
                      <OptionCard selected={answers.iluminacaoCena === 'fria'} onClick={() => updateAnswer('iluminacaoCena', 'fria')} label={t('cold')} />
                      <OptionCard selected={answers.iluminacaoCena === 'natural'} onClick={() => updateAnswer('iluminacaoCena', 'natural')} label={t('natural')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('interactionType')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tipoInteracao === 'sem-contato'} onClick={() => updateAnswer('tipoInteracao', 'sem-contato')} label={t('noContact')} />
                      <OptionCard selected={answers.tipoInteracao === 'proximo'} onClick={() => updateAnswer('tipoInteracao', 'proximo')} label={t('nearby')} />
                      <OptionCard selected={answers.tipoInteracao === 'abraco'} onClick={() => updateAnswer('tipoInteracao', 'abraco')} label={t('hug')} />
                    </div>
                  </div>
                </>
              )}

              {answers.servico === 'limpeza' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('bgComplexity')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.complexidadeFundo === 'simples'} onClick={() => updateAnswer('complexidadeFundo', 'simples')} label={t('simple')} />
                      <OptionCard selected={answers.complexidadeFundo === 'medio'} onClick={() => updateAnswer('complexidadeFundo', 'medio')} label={t('medium')} />
                      <OptionCard selected={answers.complexidadeFundo === 'complexo'} onClick={() => updateAnswer('complexidadeFundo', 'complexo')} label={t('complex')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('bgPreference')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.preferenciaFundo === 'recriar'} onClick={() => updateAnswer('preferenciaFundo', 'recriar')} label={t('recreateBg')} />
                      <OptionCard selected={answers.preferenciaFundo === 'limpo'} onClick={() => updateAnswer('preferenciaFundo', 'limpo')} label={t('cleanBg')} />
                    </div>
                  </div>
                </>
              )}

              {answers.servico === 'estilizacao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('baseStyle')}</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <OptionCard selected={answers.estiloBase === 'cinema'} onClick={() => updateAnswer('estiloBase', 'cinema')} label={t('cinema')} />
                      <OptionCard selected={answers.estiloBase === 'estudio'} onClick={() => updateAnswer('estiloBase', 'estudio')} label={t('studio')} />
                      <OptionCard selected={answers.estiloBase === 'instagram'} onClick={() => updateAnswer('estiloBase', 'instagram')} label={t('instagram')} />
                      <OptionCard selected={answers.estiloBase === 'vintage'} onClick={() => updateAnswer('estiloBase', 'vintage')} label={t('vintage')} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('realismLevel')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.nivelRealismo === 'natural'} onClick={() => updateAnswer('nivelRealismo', 'natural')} label={t('natural')} />
                      <OptionCard selected={answers.nivelRealismo === 'estilizado'} onClick={() => updateAnswer('nivelRealismo', 'estilizado')} label={t('stylized')} />
                    </div>
                  </div>
                </>
              )}

              {answers.servico === 'reconstrucao' && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4">{t('estimatedAge')}</h3>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={answers.idadeEstimada || ''}
                      onChange={(e) => updateAnswer('idadeEstimada', parseInt(e.target.value) || undefined)}
                      className="w-32 bg-background border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-accent-violet"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">{t('howToSee')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard selected={answers.comoVer === 'hoje'} onClick={() => updateAnswer('comoVer', 'hoje')} label={t('asToday')} />
                      <OptionCard selected={answers.comoVer === 'idade-especifica'} onClick={() => updateAnswer('comoVer', 'idade-especifica')} label={t('specificAge')} />
                    </div>
                  </div>
                  {answers.comoVer === 'idade-especifica' && (
                    <div>
                      <h3 className="font-semibold mb-4">{t('desiredAge')}</h3>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={answers.idadeDesejada || ''}
                        onChange={(e) => updateAnswer('idadeDesejada', parseInt(e.target.value) || undefined)}
                        className="w-32 bg-background border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-accent-violet"
                        placeholder="60"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-4">{t('emotionalTone')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OptionCard selected={answers.tomEmocional === 'natural'} onClick={() => updateAnswer('tomEmocional', 'natural')} label={t('natural')} icon={Meh} />
                      <OptionCard selected={answers.tomEmocional === 'sorrindo'} onClick={() => updateAnswer('tomEmocional', 'sorrindo')} label={t('smiling')} icon={Smile} />
                      <OptionCard selected={answers.tomEmocional === 'serio'} onClick={() => updateAnswer('tomEmocional', 'serio')} label={t('serious')} icon={Frown} />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 3: Upload */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold mb-8">{t('uploadTitle')}</h2>
              <UploadZone
                onFileSelect={(f) => setFile(f)}
                service={(answers.servico as string) || 'enhance'}
                enableWebhook={true}
              />
            </motion.div>
          )}

          {/* STEP 4: Processing / Results */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {!done ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative w-32 h-32 mb-8">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1F1F1F" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="54" fill="none" stroke="url(#grad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(progress / 100) * 339.292} 339.292`}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="#2563EB" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{progress}%</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium mb-2">{t('processing')}</p>
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-muted"
                  >
                    {processingMessages[msgIndex]}
                  </motion.p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-8">{t('results')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        className={`glass-card overflow-hidden cursor-pointer transition-all ${
                          selectedResult === n ? 'ring-2 ring-accent-violet' : ''
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: n * 0.2 }}
                        onClick={() => setSelectedResult(n)}
                      >
                        <div className="aspect-[4/3] bg-gradient-to-br from-card to-accent-violet/10 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-accent-violet/40" />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedResult(n); }}
                            className={`text-sm font-medium px-4 py-2 rounded-btn transition-all ${
                              selectedResult === n
                                ? 'bg-gradient-accent text-white'
                                : 'border border-border hover:border-accent-violet/50'
                            }`}
                          >
                            {selectedResult === n ? <Check className="w-4 h-4 inline mr-1" /> : null}
                            {t('chooseThis')}
                          </button>
                          <span className="text-xs text-muted bg-white/5 px-2 py-1 rounded">
                            {t('resolution4K')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="flex items-center justify-center gap-2 bg-gradient-accent text-white font-semibold px-8 py-3.5 rounded-btn hover:opacity-90 transition-opacity">
                      <Download className="w-5 h-5" /> {t('downloadHD')}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(preselectedService ? 1 : 0);
                        setAnswers(preselectedService ? { servico: preselectedService } : {});
                        setFile(null);
                        setDone(false);
                        setSelectedResult(null);
                      }}
                      className="flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-btn hover:bg-white/10 transition-colors"
                    >
                      {t('newProject')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-10">
            <button
              onClick={() =>
                setCurrentStep((s) =>
                  Math.max(preselectedService ? 1 : 0, s - 1)
                )
              }
              disabled={currentStep === (preselectedService ? 1 : 0)}
              className="flex items-center gap-2 px-6 py-3 border border-border rounded-btn hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> {t('previous')}
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-gradient-accent text-white font-medium px-6 py-3 rounded-btn hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentStep === 3 ? t('processWithAI') : t('next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProcessarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin" />
        </div>
      }
    >
      <ProcessarPageContent />
    </Suspense>
  );
}
