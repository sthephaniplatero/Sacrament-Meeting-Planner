'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingInDb,
  type MeetingInput,
} from '@/lib/meetings-db';
import type { SpeakerItem } from '@/lib/types';

// ---------- Validación con Zod ----------

const requiredText = (label: string) =>
  z.string().trim().min(1, { error: `${label} is required.` });

const hymnNumber = (label: string) =>
  z.coerce
    .number({ error: `${label} number must be a number.` })
    .int({ error: `${label} number must be a whole number.` })
    .min(1, { error: `Enter the ${label.toLowerCase()} number.` });

// Cada línea: "Nombre | Tema"  o  "Nombre | Tema | musical"
const speakerLinesAreValid = (text: string) =>
  splitLines(text).every((line) => line.split('|')[0].trim().length > 0);

const MeetingFormSchema = z.object({
  date: z.iso.date({ error: 'Please choose a valid meeting date.' }),
  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    error: 'Please select a meeting type.',
  }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  announcements: z.string(),
  openingHymnNumber: hymnNumber('Opening hymn'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  wardBusiness: z.string(),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  speakers: z.string().refine(speakerLinesAreValid, {
    error: 'Write each speaker on its own line as "Name | Topic".',
  }),
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
});

// ---------- Tipos del estado del formulario ----------

export type MeetingFormField = keyof z.infer<typeof MeetingFormSchema>;

export type MeetingFormState = {
  message: string | null;
  errors: Partial<Record<MeetingFormField, string[]>>;
  // Lo que escribió el usuario, para no perderlo si hay errores
  values: Record<string, string>;
};

// ---------- Helpers ----------

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function readFormValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    // Next agrega campos internos que empiezan con "$" — los ignoramos
    if (typeof value === 'string' && !key.startsWith('$')) {
      values[key] = value;
    }
  }
  return values;
}

function parseMeetingForm(values: Record<string, string>) {
  return MeetingFormSchema.safeParse({
    announcements: '',
    wardBusiness: '',
    speakers: '',
    ...values,
    stakeBusiness: values.stakeBusiness === 'on', // checkbox
  });
}

function toMeetingInput(data: z.infer<typeof MeetingFormSchema>): MeetingInput {
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: splitLines(data.announcements),
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: splitLines(data.wardBusiness).map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
    speakers: splitLines(data.speakers).map((line): SpeakerItem => {
      const [name, topic = '', kind = ''] = line.split('|').map((p) => p.trim());
      return {
        name,
        topic,
        type: kind.toLowerCase().startsWith('music') ? 'musical-number' : 'speaker',
      };
    }),
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

function revalidateMeetings() {
  // 'layout' revalida /meetings y todas sus subrutas (/meetings/[id], /meetings/current)
  revalidatePath('/meetings', 'layout');
  revalidatePath('/');
}

// ---------- Server Actions ----------

export async function createMeeting(
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const values = readFormValues(formData);
  const parsed = parseMeetingForm(values);

  if (!parsed.success) {
    return {
      message: 'Please fix the highlighted fields and try again.',
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    await addMeeting(toMeetingInput(parsed.data));
  } catch (error) {
    console.error('createMeeting failed:', error);
    throw new Error('We could not save the meeting. Please try again.');
  }

  revalidateMeetings();
  redirect('/meetings'); // fuera del try: redirect() funciona lanzando un error especial
}

export async function updateMeeting(
  id: number,
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const values = readFormValues(formData);
  const parsed = parseMeetingForm(values);

  if (!parsed.success) {
    return {
      message: 'Please fix the highlighted fields and try again.',
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  let updated;
  try {
    updated = await updateMeetingInDb(id, toMeetingInput(parsed.data));
  } catch (error) {
    console.error(`updateMeeting(${id}) failed:`, error);
    throw new Error('We could not update the meeting. Please try again.');
  }

  if (!updated) {
    throw new Error('This meeting no longer exists.');
  }

  revalidateMeetings();
  redirect('/meetings');
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const parsedId = z.coerce.number().int().positive().safeParse(formData.get('id'));
  if (!parsedId.success) {
    throw new Error('Invalid meeting id.');
  }

  try {
    await deleteMeetingInDb(parsedId.data);
  } catch (error) {
    console.error(`deleteMeeting(${parsedId.data}) failed:`, error);
    throw new Error('We could not delete the meeting. Please try again.');
  }

  revalidateMeetings();
  redirect('/meetings');
}
