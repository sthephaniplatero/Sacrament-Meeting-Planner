import { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export async function GET(request: NextRequest): Promise<Response> {
  const date: string | null = request.nextUrl.searchParams.get('date');
  const meetings: SacramentMeeting[] = getMeetings(date);
  return Response.json(meetings, { status: 200 });
}
