import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export async function POST(request: NextRequest) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { sucesso: false, error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      prompt, tipo, servico, email, userId, service,
      imageBase64, flowAnswers, metadata,
      filtro_instagram, aspecto, especificacoes, diretriz_qualidade,
    } = body;

    const n8nPayload: Record<string, unknown> = {
      prompt: prompt || '',
      tipo: tipo || 'imagem',
      servico: servico || service || 'corporativo',
      email: email || userId || '',
      userId: userId || email || '',
    };

    if (imageBase64) n8nPayload.imageBase64 = imageBase64;
    if (flowAnswers) n8nPayload.flowAnswers = flowAnswers;
    if (metadata) n8nPayload.metadata = metadata;
    if (filtro_instagram) n8nPayload.filtro_instagram = filtro_instagram;
    if (aspecto) n8nPayload.aspecto = aspecto;
    if (especificacoes) n8nPayload.especificacoes = especificacoes;
    if (diretriz_qualidade) n8nPayload.diretriz_qualidade = diretriz_qualidade;

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload),
    });

    const responseText = await n8nResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    return NextResponse.json(responseData, {
      status: n8nResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error proxying to n8n:', error);
    return NextResponse.json(
      { sucesso: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
