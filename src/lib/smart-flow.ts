import { ServiceConfig, ServiceType, FlowAnswers } from '@/types';

export function getServiceConfig(service: ServiceType): ServiceConfig {
  const configs: Record<ServiceType, ServiceConfig> = {
    video: {
      tipo_saida: 'video',
      prioridade: 'realismo',
      preservar_identidade: 'maximo',
      intensidade_movimento: 'leve',
    },
    restauracao: {
      tipo_saida: 'imagem_restaurada',
      prioridade: 'fidelidade',
      preservar_identidade: 'maximo',
    },
    composicao: {
      tipo_saida: 'composicao',
      prioridade: 'realismo',
      preservar_identidade: 'alto',
    },
    limpeza: {
      tipo_saida: 'limpeza',
      prioridade: 'estetica',
      preservar_identidade: 'medio',
    },
    estilizacao: {
      tipo_saida: 'estilizacao',
      prioridade: 'estetica',
      preservar_identidade: 'medio',
    },
    reconstrucao: {
      tipo_saida: 'reconstrucao',
      prioridade: 'emocao',
      preservar_identidade: 'maximo',
      reconstrucao: 'ativa',
    },
  };
  return configs[service];
}

export const smartFlowServices = [
  { id: 'video' as ServiceType, icon: 'Play', labelKey: 'bringToLife' },
  { id: 'restauracao' as ServiceType, icon: 'Clock', labelKey: 'restoreOld' },
  { id: 'composicao' as ServiceType, icon: 'UserPlus', labelKey: 'addPeople' },
  { id: 'limpeza' as ServiceType, icon: 'Eraser', labelKey: 'removeObjects' },
  { id: 'estilizacao' as ServiceType, icon: 'Wand2', labelKey: 'filtersEffects' },
  { id: 'reconstrucao' as ServiceType, icon: 'Heart', labelKey: 'livingMemories' },
] as const;
