import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export async function POST(request: NextRequest) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { success: false, error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, tipo, servico, email } = body;

    if (!email || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Email and prompt are required' },
        { status: 400 }
      );
    }

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt || '',
        tipo: tipo || 'imagem',
        servico: servico || 'corporativo',
        email: email,
        filtro_instagram: body.filtro_instagram || 'natural',
        aspecto: body.aspecto || '1:1',
        especificacoes: body.especificacoes || {},
        diretriz_qualidade: body.diretriz_qualidade || '',
      }),
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
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
