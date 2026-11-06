import { getMeetingById } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export interface RouteContext {
  params: Promise<{ id: string }>;
}

export interface ApiErrorResponse {
  error: string;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    const badRequestBody: ApiErrorResponse = {
      error: `Invalid meeting ID "${id}". Expected a positive integer.`,
    };
    return Response.json(badRequestBody, { status: 400 });
  }

  const numericId: number = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    const badRequestBody: ApiErrorResponse = {
      error: `Invalid meeting ID "${id}".`,
    };
    return Response.json(badRequestBody, { status: 400 });
  }

  const meeting: SacramentMeeting | null = getMeetingById(numericId);
  if (!meeting) {
    const notFoundBody: ApiErrorResponse = {
      error: `No sacrament meeting found with ID ${numericId}.`,
    };
    return Response.json(notFoundBody, { status: 404 });
  }

  return Response.json(meeting, { status: 200 });
}
