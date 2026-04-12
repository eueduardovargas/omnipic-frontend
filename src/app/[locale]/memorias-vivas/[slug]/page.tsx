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
  ChevronLeft,
  ChevronRight,
  Wand2,
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
  exampleImages: string[];
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
    ],
    exampleImages: [
      'https://placehold.co/600x700/0e1a2e/4a90e2?text=Corporativo+1',
      'https://placehold.co/600x700/0e1a2e/4a90e2?text=Corporativo+2',
      'https://placehold.co/600x700/0e1a2e/4a90e2?text=Corporativo+3',
      'https://placehold.co/600x700/0e1a2e/4a90e2?text=Corporativo+4',
      'https://placehold.co/600x700/0e1a2e/4a90e2?text=Corporativo+5',
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
    ],
    exampleImages: [
      'https://placehold.co/600x700/2e0e1a/e24a90?text=Fashion+1',
      'https://placehold.co/600x700/2e0e1a/e24a90?text=Fashion+2',
      'https://placehold.co/600x700/2e0e1a/e24a90?text=Fashion+3',
      'https://placehold.co/600x700/2e0e1a/e24a90?text=Fashion+4',
      'https://placehold.co/600x700/2e0e1a/e24a90?text=Fashion+5',
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
    ],
    exampleImages: [
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Cinema+1',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Cinema+2',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Cinema+3',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Cinema+4',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Cinema+5',
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
    tips: ['Faça upload de uma selfie', 'Descreva como quer a imagem', 'Deixe a IA gerar'],
    exampleImages: [
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Exemplo+1',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Exemplo+2',
      'https://placehold.co/600x700/0e1a2e/7c3aed?text=Exemplo+3',
    ]
  };

  const c = colorStyles[style.color];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
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
      setGeneratedImage('https://placehold.co/400x500/1a1a2e/7C3AED?text=Gerado');
      setAdditionalImages([]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    // Simulate AI generation for 3 more images
    setTimeout(() => {
      setAdditionalImages([
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Modelo+1',
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Modelo+2',
        'https://placehold.co/400x500/1a1a2e/7C3AED?text=Modelo+3',
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % style.exampleImages.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + style.exampleImages.length) % style.exampleImages.length);
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

        {/* Small description */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-3 h-3 rounded-full ${c.dot} animate-pulse`} />
            <span className={`text-sm uppercase tracking-wider font-bold ${c.text}`}>
              AI Style
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            {style.name}
          </h1>
          <p className="text-white/60 text-base">
            {style.fullDescription}
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className={`relative rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl overflow-hidden mb-12`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative aspect-[3/4] md:aspect-video overflow-hidden">
            <img
              src={style.exampleImages[carouselIndex]}
              alt={`Example ${carouselIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Carousel controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {style.exampleImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === carouselIndex
                      ? 'bg-white w-6'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main content - Desktop layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {/* Left: Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Sua foto
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

            {/* Mini prompt */}
            <div className="mt-6">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Mini comando
              </h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={style.prompt}
                className="w-full h-16 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full mt-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                uploadedImage && !isGenerating
                  ? `bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white`
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Gerar Imagem
                </>
              )}
            </button>
          </motion.div>

          {/* Middle: Dicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}
          >
            <h3 className="text-lg font-bold mb-6">Dicas para melhor resultado</h3>
            <ul className="space-y-4">
              {style.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Generated images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-8`}
          >
            <h3 className="text-lg font-bold mb-6">Sua imagem gerada</h3>
            
            {generatedImage ? (
              <div className="space-y-4">
                <motion.img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                />

                {additionalImages.length === 0 && (
                  <button
                    onClick={handleGenerateMore}
                    disabled={isGenerating}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                      !isGenerating
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Gerar outros modelos
                      </>
                    )}
                  </button>
                )}

                {additionalImages.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {additionalImages.map((img, i) => (
                      <motion.img
                        key={i}
                        src={img}
                        alt={`Model ${i + 1}`}
                        className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                <p className="text-white/50 text-sm text-center">
                  Faça upload e gere sua primeira imagem
                </p>
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
              Sua foto
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

            {/* Mini prompt */}
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Mini comando
              </h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={style.prompt}
                className="w-full h-16 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full mt-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                uploadedImage && !isGenerating
                  ? `bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white`
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Gerar Imagem
                </>
              )}
            </button>
          </div>

          {/* Dicas */}
          <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-6`}>
            <h3 className="text-lg font-bold mb-4">Dicas para melhor resultado</h3>
            <ul className="space-y-3">
              {style.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Generated images */}
          {generatedImage && (
            <div className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-xl p-6`}>
              <h3 className="text-lg font-bold mb-4">Sua imagem gerada</h3>
              
              <motion.img
                src={generatedImage}
                alt="Generated"
                className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              />

              {additionalImages.length === 0 && (
                <button
                  onClick={handleGenerateMore}
                  disabled={isGenerating}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm ${
                    !isGenerating
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Gerar outros modelos
                    </>
                  )}
                </button>
              )}

              {additionalImages.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  {additionalImages.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`Model ${i + 1}`}
                      className="w-full rounded-lg object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
