export type Locale = 'pt-BR' | 'en' | 'en-GB' | 'es' | 'es-419' | 'de';

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface ServiceItem {
  slug: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
  category: 'enhancement' | 'generative' | 'video';
  /** Maps this service to a smart-flow ServiceType so processar can skip the picker */
  flowService: 'video' | 'restauracao' | 'composicao' | 'limpeza' | 'estilizacao' | 'reconstrucao';
  /** Accent color key for consistent theming on the service page */
  accent: 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'fuchsia' | 'cyan';
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'business';
  popular?: boolean;
  features: string[];
}

export interface PriceByLocale {
  monthly: number;
  annual: number;
  currency: Currency;
  symbol: string;
}

export interface Testimonial {
  name: string;
  avatar: string;
  platform: string;
  rating: number;
  text: string;
}

export type ServiceType = 'video' | 'restauracao' | 'composicao' | 'limpeza' | 'estilizacao' | 'reconstrucao';

export interface ServiceConfig {
  tipo_saida: 'video' | 'imagem_restaurada' | 'composicao' | 'limpeza' | 'estilizacao' | 'reconstrucao';
  prioridade: 'fidelidade' | 'realismo' | 'estetica' | 'emocao';
  preservar_identidade: 'maximo' | 'alto' | 'medio';
  intensidade_movimento?: 'leve' | 'medio';
  reconstrucao?: 'ativa' | 'contexto';
}

export interface FlowAnswers {
  servico: ServiceType;
  tipoFoto: 'selfie' | 'grupo' | 'profissional' | 'antiga';
  qualidade: 'baixa' | 'media' | 'alta';
  iluminacao: 'escura' | 'normal' | 'clara';
  // Service-specific
  tipoMovimento?: 'natural' | 'cinematico' | 'emocional';
  intensidade?: 'suave' | 'media';
  expressao?: 'sorrindo' | 'neutro' | 'emocional';
  nivelDano?: 'leve' | 'medio' | 'alto';
  manterOriginal?: boolean;
  tomDesejado?: 'realista' | 'moderno';
  angulo?: 'frontal' | 'lateral' | 'desconhecido';
  distancia?: 'proximo' | 'medio' | 'longe';
  iluminacaoCena?: 'quente' | 'fria' | 'natural';
  tipoInteracao?: 'sem-contato' | 'proximo' | 'abraco';
  complexidadeFundo?: 'simples' | 'medio' | 'complexo';
  preferenciaFundo?: 'recriar' | 'limpo';
  estiloBase?: 'cinema' | 'estudio' | 'instagram' | 'vintage';
  nivelRealismo?: 'natural' | 'estilizado';
  idadeEstimada?: number;
  comoVer?: 'hoje' | 'idade-especifica';
  idadeDesejada?: number;
  tomEmocional?: 'natural' | 'sorrindo' | 'serio';
}

export interface SmartFlowStep {
  id: number;
  title: string;
  completed: boolean;
}
