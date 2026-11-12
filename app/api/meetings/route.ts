import { NextRequest, NextResponse } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') ?? undefined;

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date. Use format YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  try {
    const meetings = await getMeetings({ date });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings.' },
      { status: 500 }
    );
  }
}