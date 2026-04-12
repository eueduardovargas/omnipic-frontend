'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Download,
  Share2,
  Pause,
  Play,
} from 'lucide-react';
import Link from 'next/link';

type ColorKey = 'blue' | 'fuchsia' | 'violet' | 'amber' | 'emerald' | 'rose';

const colorStyles: Record<
  ColorKey,
  { gradient: string; bg: string; border: string; text: string; dot: string; accent: string }
> = {
  blue: {
    gradient: 'from-blue-600/40 to-cyan-600/20',
    bg: 'bg-blue-600/10',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    dot: 'bg-blue-500',
    accent: 'from-blue-500 to-cyan-500',
  },
  fuchsia: {
    gradient: 'from-fuchsia-600/40 to-pink-600/20',
    bg: 'bg-fuchsia-600/10',
    border: 'border-fuchsia-500/30',
    text: 'text-fuchsia-300',
    dot: 'bg-fuchsia-500',
    accent: 'from-fuchsia-500 to-pink-500',
  },
  violet: {
    gradient: 'from-violet-600/40 to-purple-600/20',
    bg: 'bg-violet-600/10',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
    dot: 'bg-violet-500',
    accent: 'from-violet-500 to-purple-500',
  },
  amber: {
    gradient: 'from-amber-600/40 to-orange-600/20',
    bg: 'bg-amber-600/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    dot: 'bg-amber-500',
    accent: 'from-amber-500 to-orange-500',
  },
  emerald: {
    gradient: 'from-emerald-600/40 to-teal-600/20',
    bg: 'bg-emerald-600/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-500',
    accent: 'from-emerald-500 to-teal-500',
  },
  rose: {
    gradient: 'from-rose-600/40 to-pink-600/20',
    bg: 'bg-rose-600/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    dot: 'bg-rose-500',
    accent: 'from-rose-500 to-pink-500',
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
    fullDescription: 'Ensaios de moda com iluminação cinematográfica profissional. Roupas elegantes, poses dinâmicas e cenários sofisticados.',
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
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % style.exampleImages.length);
    }, 4000); // Change image every 4 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, style.exampleImages.length]);

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
    setTimeout(() => {
      setGeneratedImage('https://placehold.co/400x500/1a1a2e/7C3AED?text=Gerado');
      setAdditionalImages([]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
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
    setIsAutoPlay(false);
    setCarouselIndex((prev) => (prev + 1) % style.exampleImages.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCarouselIndex((prev) => (prev - 1 + style.exampleImages.length) % style.exampleImages.length);
  };

  return (
    <div className="pt-20 min-h-screen pb-20 bg-gradient-to-b from-black via-slate-950 to-black">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          aria-hidden
          className={`absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${c.gradient} blur-3xl opacity-30`}
        />
        <div
          aria-hidden
          className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${c.gradient} blur-3xl opacity-20`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Link
            href={`/${locale}/memorias-vivas`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
        </motion.div>

        {/* Hero section with carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          {/* Title and description */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${c.dot}`} />
              <span className={`text-xs uppercase tracking-widest font-bold ${c.text}`}>
                AI Style
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
              {style.name}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {style.fullDescription}
            </p>
          </div>

          {/* Stories-style carousel feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main carousel - Stories Feed */}
            <div className="lg:col-span-2">
              <div className={`relative rounded-3xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-2xl`}>
                {/* Carousel container */}
                <div className="relative aspect-[9/16] md:aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-900 to-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={style.exampleImages[carouselIndex]}
                        alt={`Example ${carouselIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${c.accent}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isAutoPlay ? '100%' : `${((carouselIndex + 1) / style.exampleImages.length) * 100}%` }}
                      transition={{ duration: isAutoPlay ? 4 : 0.3 }}
                    />
                  </div>

                  {/* Navigation buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group z-20"
                  >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group z-20"
                  >
                    <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Play/Pause button */}
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/30 z-20"
                  >
                    {isAutoPlay ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-6 left-6 text-white/80 text-sm font-medium z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    {carouselIndex + 1} / {style.exampleImages.length}
                  </div>
                </div>

                {/* Carousel indicators - dots */}
                <div className="flex items-center justify-center gap-2 p-6 bg-gradient-to-r from-white/5 to-white/[0.02] border-t border-white/10">
                  {style.exampleImages.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setIsAutoPlay(false);
                        setCarouselIndex(i);
                      }}
                      className={`rounded-full transition-all duration-300 ${
                        i === carouselIndex
                          ? `bg-gradient-to-r ${c.accent} w-8 h-2`
                          : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar - Upload and tips */}
            <div className="space-y-6">
              {/* Upload section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl`}
              >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5" />
                  Sua Foto
                </h2>

                {!uploadedImage ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full aspect-square rounded-xl border-2 border-dashed ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group`}
                  >
                    <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors mb-2" />
                    <span className="text-white font-semibold text-sm">Upload</span>
                  </button>
                ) : (
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
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
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-xs transition-all"
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
                  <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-white">
                    <Sparkles className="w-3 h-3" />
                    Mini Comando
                  </h3>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={style.prompt}
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/40 focus:outline-none focus:border-white/30 transition-all resize-none"
                  />
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || isGenerating}
                  className={`w-full mt-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-xs ${
                    uploadedImage && !isGenerating
                      ? `bg-gradient-to-r ${c.accent} text-white hover:shadow-lg`
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
                      <Zap className="w-3 h-3" />
                      Gerar
                    </>
                  )}
                </button>
              </motion.div>

              {/* Tips section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl`}
              >
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Dicas
                </h3>
                <ul className="space-y-2">
                  {style.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${c.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-white/80">{tip}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Generated image */}
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-4 shadow-xl`}
                >
                  <h3 className="text-sm font-bold mb-3 text-white">Gerada</h3>
                  <motion.img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg object-cover aspect-square mb-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />

                  {additionalImages.length === 0 && (
                    <button
                      onClick={handleGenerateMore}
                      disabled={isGenerating}
                      className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-xs border ${
                        !isGenerating
                          ? 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                          : 'bg-white/5 border-white/20 text-white/50 cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3" />
                          Mais Modelos
                        </>
                      )}
                    </button>
                  )}

                  {additionalImages.length > 0 && (
                    <div className="space-y-2">
                      {additionalImages.map((img, i) => (
                        <motion.img
                          key={i}
                          src={img}
                          alt={`Model ${i + 1}`}
                          className="w-full rounded-lg object-cover aspect-square"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
