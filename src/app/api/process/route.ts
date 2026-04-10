import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  // Mock processing endpoint
  return NextResponse.json({
    success: true,
    results: [
      { id: '1', url: 'https://placehold.co/800x600/141414/7C3AED?text=Result+1', label: 'Variation 1' },
      { id: '2', url: 'https://placehold.co/800x600/141414/2563EB?text=Result+2', label: 'Variation 2' },
      { id: '3', url: 'https://placehold.co/800x600/141414/10B981?text=Result+3', label: 'Variation 3' },
    ],
    prompt: body.prompt || '',
    processingTime: '5.2s',
  });
}
