import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.habbo.com.tr/api/public/users?name=${encodeURIComponent(name)}`, {
      headers: {
        'User-Agent': 'HabboZone-App/1.0',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw new Error(`Habbo API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Habbo API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
