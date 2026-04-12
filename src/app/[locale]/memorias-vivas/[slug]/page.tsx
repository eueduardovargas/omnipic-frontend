'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Upload,
  Sparkles,
  ArrowLeft,
  Check,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

type ColorKey = 'blue' | 'fuchsia' | 'violet' | 'amber' | 'emerald' | 'rose';

const colorStyles: Record<
  ColorKey,
  { gradient: string; bg: string; border: string; text: string; dot: string }
> = {
  blue: {
    gradient: 'from-blue-500/30 to-cyan-500/10',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    text: 'text-blue-200',
    dot: 'bg-blue-400',
  },
  fuchsia: {
    gradient: 'from-fuchsia-500/30 to-pink-500/10',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-400/30',
    text: 'text-fuchsia-200',
    dot: 'bg-fuchsia-400',
  },
  violet: {
    gradient: 'from-violet-500/30 to-purple-500/10',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/30',
    text: 'text-violet-200',
    dot: 'bg-violet-400',
  },
  amber: {
    gradient: 'from-amber-500/30 to-orange-500/10',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    text: 'text-amber-200',
    dot: 'bg-amber-400',
  },
  emerald: {
    gradient: 'from-emerald-500/30 to-teal-500/10',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    text: 'text-emerald-200',
    dot: 'bg-emerald-400',
  },
  rose: {
    gradient: 'from-rose-500/30 to-pink-500/10',
    bg: 'bg-rose-500/10',
    border: 'border-rose-400/30',
    text: 'text-rose-200',
    dot: 'bg-rose-400',
  },
};

const styleDetails: Record<string, {
  name: string;
  description: string;
  color: ColorKey;
  fullDescription: string;
  prompt: string;
  tips: string[];
}> = {
  'corporativo': {
    name: 'Corporativo',
    description: 'LinkedIn profissional',
    color: 'blue',
    fullDescription: 'Retratos profissionais para LinkedIn, CVs e websites corporativos. Iluminação de estúdio, fundo neutro e expressão profissional.',
    prompt: 'Professional corporate headshot, studio lighting, neutral background, sharp focus, business attire',
    tips: [
      'Use roupas formais (blazer, camisa)',
      'Fundo neutro ou desfocado',
      'Expressão neutra ou sorriso leve',
      'Iluminação frontal e equilibrada'
    ]
  },
  'fashion-editorial': {
    name: 'Fashion Editorial',
    description: 'Capa de revista',
    color: 'fuchsia',
    fullDescription: 'Ensaios de moda com iluminação cinematográfica. Roupas elegantes, poses dinâmicas e cenários sofisticados.',
    prompt: 'High-fashion editorial portrait, cinematic lighting, elegant clothing, dynamic pose, luxury aesthetic',
    tips: [
      'Roupas de alta moda ou designer',
      'Poses dinâmicas e elegantes',
      'Cenários sofisticados',
      'Maquiagem profissional'
    ]
  },
  'cinematográfico': {
    name: 'Cinematográfico',
    description: 'Estilo Hollywood',
    color: 'violet',
    fullDescription: 'Retratos com iluminação cinematográfica profissional. Efeitos de luz dramática, cores vibrantes e composição artística.',
    prompt: 'Cinematic portrait, Hollywood lighting, dramatic shadows, vibrant colors, professional composition',
    tips: [
      'Iluminação lateral ou contra luz',
      'Cores vibrantes e contrastadas',
      'Composição artística',
      'Efeitos de luz especiais'
    ]
  },
};

export default function StyleDetailPage() {
  const params = useParams();
  const slug = (params.slug as string).replace(/-/g, ' ');
  const locale = params.locale as string;
  
  const style = styleDetails[slug.toLowerCase().replace(/\s+/g, '-')] || {
    name: slug,
    description: 'Estilo IA',
    color: 'violet' as ColorKey,
    fullDescription: 'Crie fotos profissionais com IA',
    prompt: 'Professional portrait',
    tips: ['Faça upload de uma selfie', 'Descreva como quer a imagem', 'Deixe a IA gerar']
  };

  const c = colorStyles[style.color];
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('Por favor, faça upload de uma imagem primeiro');
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedImages([
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Gerado+1',
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Gerado+2',
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Gerado+3',
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="pt-20 min-h-screen pb-20">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          aria-hidden
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${c.gradient} blur-[120px] opacity-40`}
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-fuchsia-500/20 blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Back button */}
        <Link
          href={`/${locale}/memorias-vivas`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-3 h-3 rounded-full ${c.dot} animate-pulse`} />
            <span className={`text-sm uppercase tracking-wider font-bold ${c.text}`}>
              AI Style
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            {style.name}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            {style.fullDescription}
          </p>
        </motion.div>

        {/* Main content - Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Upload and instructions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Upload section */}
            <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Faça upload da sua foto
              </h2>

              {!uploadedImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full aspect-square rounded-xl border-2 border-dashed ${c.border} bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer group`}
                >
                  <ImageIcon className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors mb-3" />
                  <span className="text-white/60 group-hover:text-white/80 transition-colors text-sm font-medium">
                    Clique para fazer upload
                  </span>
                  <span className="text-white/40 text-xs mt-1">
                    PNG, JPG até 10MB
                  </span>
                </button>
              ) : (
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      fileInputRef.current!.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Trocar
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Custom prompt */}
            <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Mini comando (opcional)
              </h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={style.prompt}
                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
              <p className="text-white/50 text-xs mt-2">
                Descreva como você gostaria que a imagem ficasse (ex: "com óculos", "em preto e branco")
              </p>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                uploadedImage && !isGenerating
                  ? `bg-gradient-to-r ${c.gradient.replace('from-', 'from-').replace('to-', 'to-')} hover:opacity-90`
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Gerar Imagens
                </>
              )}
            </button>
          </motion.div>

          {/* Right: Tips and info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Tips */}
            <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}>
              <h3 className="text-lg font-bold mb-6">Dicas para melhor resultado</h3>
              <ul className="space-y-4">
                {style.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Generated images */}
            {generatedImages.length > 0 && (
              <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}>
                <h3 className="text-lg font-bold mb-6">Imagens geradas</h3>
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`Generated ${i + 1}`}
                      className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-6">
          {/* Upload section */}
          <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-6`}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Faça upload
            </h2>

            {!uploadedImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square rounded-xl border-2 border-dashed ${c.border} bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer group`}
              >
                <ImageIcon className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors mb-3" />
                <span className="text-white/60 group-hover:text-white/80 transition-colors text-sm font-medium">
                  Clique para upload
                </span>
              </button>
            ) : (
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    fileInputRef.current!.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  Trocar
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Custom prompt */}
          <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-6`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mini comando
            </h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={style.prompt}
              className="w-full h-20 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!uploadedImage || isGenerating}
            className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              uploadedImage && !isGenerating
                ? `bg-gradient-to-r ${c.gradient.replace('from-', 'from-').replace('to-', 'to-')} hover:opacity-90`
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Gerar Imagens
              </>
            )}
          </button>

          {/* Generated images */}
          {generatedImages.length > 0 && (
            <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-6`}>
              <h3 className="text-lg font-bold mb-4">Imagens geradas</h3>
              <div className="space-y-3">
                {generatedImages.map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt={`Generated ${i + 1}`}
                    className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
