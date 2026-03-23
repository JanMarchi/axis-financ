import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    // Forward cookies from API to client
    const res = NextResponse.json(data);
    const cookies = response.headers.getSetCookie();
    cookies.forEach((cookie) => {
      res.headers.append('Set-Cookie', cookie);
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Erro ao fazer login' } },
      { status: 500 },
    );
  }
}
