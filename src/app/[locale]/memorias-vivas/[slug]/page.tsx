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
  Download,
  Share2,
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
    setCarouselIndex((prev) => (prev + 1) % style.exampleImages.length);
  };

  const prevSlide = () => {
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

          {/* Carousel */}
          <div className={`relative rounded-3xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-2xl`}>
            <div className="relative aspect-[3/4] md:aspect-video overflow-hidden bg-gradient-to-br from-slate-900 to-black">
              <motion.img
                key={carouselIndex}
                src={style.exampleImages[carouselIndex]}
                alt={`Example ${carouselIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Carousel controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>

              {/* Carousel indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {style.exampleImages.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
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
        </motion.div>

        {/* Main content grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-12">
          {/* Left: Upload section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 shadow-xl`}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.accent} flex items-center justify-center`}>
                <Upload className="w-5 h-5 text-white" />
              </div>
              Sua Foto
            </h2>

            {!uploadedImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${c.accent} opacity-20 group-hover:opacity-30 transition-opacity mb-4 flex items-center justify-center`}>
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <span className="text-white font-semibold mb-2">
                  Clique para upload
                </span>
                <span className="text-white/50 text-sm">
                  PNG, JPG até 10MB
                </span>
              </button>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
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
                  className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 font-medium"
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
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                Mini Comando
              </h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={style.prompt}
                className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 resize-none"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full mt-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                uploadedImage && !isGenerating
                  ? `bg-gradient-to-r ${c.accent} hover:shadow-lg hover:shadow-violet-500/30 text-white hover:scale-[1.02]`
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
                  <Zap className="w-4 h-4" />
                  Gerar Imagem
                </>
              )}
            </button>
          </motion.div>

          {/* Middle: Tips section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 shadow-xl`}
          >
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.accent} flex items-center justify-center`}>
                <Check className="w-5 h-5 text-white" />
              </div>
              Dicas
            </h3>
            <ul className="space-y-4">
              {style.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${c.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm leading-relaxed">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Generated images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 shadow-xl`}
          >
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.accent} flex items-center justify-center`}>
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              Sua Imagem
            </h3>
            
            {generatedImage ? (
              <div className="space-y-4">
                <motion.div
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-xl object-cover aspect-square"
                  />
                  <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all">
                      <Download className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all">
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </motion.div>

                {additionalImages.length === 0 && (
                  <button
                    onClick={handleGenerateMore}
                    disabled={isGenerating}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm border ${
                      !isGenerating
                        ? 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/40 text-white'
                        : 'bg-white/5 border-white/20 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Gerar Outros Modelos
                      </>
                    )}
                  </button>
                )}

                {additionalImages.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    {additionalImages.map((img, i) => (
                      <motion.div
                        key={i}
                        className="relative group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <img
                          src={img}
                          alt={`Model ${i + 1}`}
                          className="w-full rounded-lg object-cover aspect-square"
                        />
                        <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all">
                            <Download className="w-4 h-4 text-white" />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all">
                            <Share2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                <p className="text-white/50 text-sm text-center">
                  Faça upload e gere<br />sua primeira imagem
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-6">
          {/* Upload section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl`}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Upload className="w-5 h-5" />
              Sua Foto
            </h2>

            {!uploadedImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group`}
              >
                <ImageIcon className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors mb-3" />
                <span className="text-white font-semibold">
                  Clique para upload
                </span>
              </button>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
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
                  className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300"
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
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                Mini Comando
              </h3>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={style.prompt}
                className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/30 transition-all duration-300 resize-none"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                uploadedImage && !isGenerating
                  ? `bg-gradient-to-r ${c.accent} hover:shadow-lg text-white`
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
                  <Zap className="w-4 h-4" />
                  Gerar Imagem
                </>
              )}
            </button>
          </motion.div>

          {/* Dicas */}
          <div className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <Check className="w-5 h-5" />
              Dicas
            </h3>
            <ul className="space-y-3">
              {style.tips.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${c.accent} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Generated images */}
          {generatedImage && (
            <div className={`rounded-2xl border ${c.border} bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-6 shadow-xl`}>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Sua Imagem
              </h3>
              
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
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm border ${
                    !isGenerating
                      ? 'bg-white/5 hover:bg-white/10 border-white/20 text-white'
                      : 'bg-white/5 border-white/20 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Gerar Outros Modelos
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
                      className="w-full rounded-lg object-cover aspect-square"
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
