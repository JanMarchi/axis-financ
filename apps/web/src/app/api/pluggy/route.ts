import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Token not found' } }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === 'get-connect-token') {
      const response = await fetch(`${API_URL}/pluggy/connect-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Invalid action' } }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to process pluggy request' } },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Token not found' } }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/pluggy/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch pluggy items' } },
      { status: 500 },
    );
  }
}
