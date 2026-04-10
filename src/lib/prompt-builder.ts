import { FlowAnswers, ServiceType } from '@/types';

function getTaskDescription(service: ServiceType): string {
  const tasks: Record<ServiceType, string> = {
    video: 'Animate photo with subtle realistic motion, preserving facial identity',
    restauracao: 'Restore damaged/aged photograph to pristine condition while preserving original appearance',
    composicao: 'Seamlessly composite additional person into existing photo scene',
    limpeza: 'Remove unwanted objects and reconstruct background naturally',
    estilizacao: 'Apply professional-grade visual filter/effect while maintaining realism',
    reconstrucao: 'Age-progress or reconstruct facial features based on family resemblance with emotional sensitivity',
  };
  return tasks[service];
}

function getEnhancements(answers: FlowAnswers): string {
  const enhancements: string[] = [];

  if (answers.qualidade === 'baixa') enhancements.push('upscale to 4K, denoise, sharpen');
  if (answers.qualidade === 'media') enhancements.push('upscale to 4K, light sharpen');
  if (answers.iluminacao === 'escura') enhancements.push('exposure correction, shadow recovery');
  if (answers.iluminacao === 'clara') enhancements.push('highlight recovery, balanced exposure');

  switch (answers.servico) {
    case 'video':
      if (answers.tipoMovimento === 'cinematico') enhancements.push('cinematic camera motion');
      if (answers.tipoMovimento === 'emocional') enhancements.push('gentle emotional movement');
      if (answers.expressao === 'sorrindo') enhancements.push('natural smile expression');
      if (answers.intensidade === 'suave') enhancements.push('subtle animation, 2-3 seconds');
      break;
    case 'restauracao':
      if (answers.nivelDano === 'alto') enhancements.push('heavy scratch removal, tear repair, color restoration');
      if (answers.nivelDano === 'medio') enhancements.push('moderate scratch removal, color correction');
      if (answers.nivelDano === 'leve') enhancements.push('light restoration, color enhancement');
      if (answers.manterOriginal) enhancements.push('strict original appearance preservation');
      if (answers.tomDesejado === 'moderno') enhancements.push('slight modern color grading');
      break;
    case 'composicao':
      if (answers.angulo) enhancements.push(`match ${answers.angulo} camera angle`);
      if (answers.distancia) enhancements.push(`${answers.distancia} distance placement`);
      if (answers.iluminacaoCena) enhancements.push(`${answers.iluminacaoCena} lighting match`);
      if (answers.tipoInteracao === 'abraco') enhancements.push('natural embrace pose');
      break;
    case 'limpeza':
      if (answers.complexidadeFundo === 'complexo') enhancements.push('advanced inpainting for complex background');
      if (answers.preferenciaFundo === 'limpo') enhancements.push('clean uniform background');
      break;
    case 'estilizacao':
      if (answers.estiloBase) enhancements.push(`${answers.estiloBase} style filter`);
      if (answers.nivelRealismo === 'estilizado') enhancements.push('artistic stylization');
      break;
    case 'reconstrucao':
      if (answers.comoVer === 'hoje') enhancements.push('age to present day');
      if (answers.comoVer === 'idade-especifica' && answers.idadeDesejada) enhancements.push(`age to approximately ${answers.idadeDesejada} years`);
      if (answers.tomEmocional === 'sorrindo') enhancements.push('warm smile expression');
      enhancements.push('maximum family resemblance preservation');
      break;
  }

  return enhancements.join(', ');
}

function getLens(answers: FlowAnswers): string {
  if (answers.tipoFoto === 'selfie') return '35mm lens, shallow depth of field';
  if (answers.tipoFoto === 'grupo') return '50mm lens, medium depth of field';
  if (answers.tipoFoto === 'profissional') return '85mm portrait lens, bokeh background';
  return '50mm standard lens, natural perspective';
}

function getConstraints(answers: FlowAnswers): string {
  const constraints = [
    'no distortion',
    'no artificial faces',
    'no extra fingers',
    'no blur artifacts',
    'preserve original identity',
  ];

  if (answers.servico === 'reconstrucao') {
    constraints.push('respectful reconstruction', 'family resemblance priority');
  }
  if (answers.servico === 'composicao') {
    constraints.push('consistent lighting', 'natural shadow placement', 'seamless edges');
  }

  return constraints.join(', ');
}

export function buildPrompt(answers: FlowAnswers): string {
  return `Ultra realistic photo transformation.
Context: [${answers.tipoFoto}, ${answers.qualidade} quality, ${answers.iluminacao} lighting]
Task: ${getTaskDescription(answers.servico)}
Enhancements: ${getEnhancements(answers)}
Style: DSLR photo, ${getLens(answers)}, cinematic realism.
Constraints: ${getConstraints(answers)}.`;
}
