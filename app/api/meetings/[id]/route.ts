import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById } from '@/lib/meetings-db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  // /api/meetings/abc → 400
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { error: 'Invalid meeting id. It must be a positive integer.' },
      { status: 400 }
    );
  }

  try {
    const meeting = await getMeetingById(id);

    if (!meeting) {
      return NextResponse.json(
        { error: `Meeting ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting.' },
      { status: 500 }
    );
  }
}