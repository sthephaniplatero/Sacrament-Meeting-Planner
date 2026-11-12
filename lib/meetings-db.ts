import { neon } from '@neondatabase/serverless';
import type {
  SacramentMeeting,
  MeetingType,
  Hymn,
  SpeakerItem,
  WardBusinessItem,
} from '@/lib/types'; 

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Run `vercel env pull .env.local`.');
}


const sql = neon(process.env.DATABASE_URL);

export const ITEMS_PER_PAGE = 5;


type MeetingRow = {
  id: number;
  date: string;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[] | null;
  stake_business: boolean | null;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[] | null;
  closing_hymn: Hymn;
  closing_prayer: string;
};


function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

export interface MeetingFilters {
  query?: string; // busca en tipo, presiding, conducting y oradores
  date?: string;  // 'YYYY-MM-DD'
  page?: number;  // si no se envía, devuelve todos (útil para la API)
}

export async function getMeetings(
  filters: MeetingFilters = {}
): Promise<SacramentMeeting[]> {
  const query = filters.query?.trim() ?? '';
  const pattern = `%${query}%`;
  const date = filters.date ?? null;
  const page = filters.page && filters.page > 0 ? filters.page : null;
  const limit = page ? ITEMS_PER_PAGE : null; // LIMIT NULL = sin límite
  const offset = page ? (page - 1) * ITEMS_PER_PAGE : 0;

  const rows = await sql`
    SELECT id,
           to_char(date, 'YYYY-MM-DD') AS date,
           meeting_type, presiding, conducting, announcements,
           opening_hymn, opening_prayer, ward_business, stake_business,
           sacrament_hymn, speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE (${query} = ''
           OR meeting_type ILIKE ${pattern}
           OR presiding    ILIKE ${pattern}
           OR conducting   ILIKE ${pattern}
           OR speakers::text ILIKE ${pattern})
      AND (${date}::date IS NULL OR meetings.date = ${date}::date)
    ORDER BY meetings.date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return (rows as MeetingRow[]).map(toMeeting);
}

export async function getMeetingsTotalPages(
  query = '',
  date?: string
): Promise<number> {
  const q = query.trim();
  const pattern = `%${q}%`;
  const d = date ?? null;

  const rows = await sql`
    SELECT COUNT(*)::int AS count
    FROM meetings
    WHERE (${q} = ''
           OR meeting_type ILIKE ${pattern}
           OR presiding    ILIKE ${pattern}
           OR conducting   ILIKE ${pattern}
           OR speakers::text ILIKE ${pattern})
      AND (${d}::date IS NULL OR meetings.date = ${d}::date)
  `;

  const count = (rows[0]?.count as number) ?? 0;
  return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | undefined> {
  const rows = await sql`
    SELECT id,
           to_char(date, 'YYYY-MM-DD') AS date,
           meeting_type, presiding, conducting, announcements,
           opening_hymn, opening_prayer, ward_business, stake_business,
           sacrament_hymn, speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE id = ${id}
  `;

  const row = rows[0] as MeetingRow | undefined;
  return row ? toMeeting(row) : undefined;
}



export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  void data;
  throw new Error('addMeeting: not implemented until Week 04');
}

export async function updateMeeting(
  id: number,
  data: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting | undefined> {
  void id;
  void data;
  throw new Error('updateMeeting: not implemented until Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error('deleteMeeting: not implemented until Week 04');
}