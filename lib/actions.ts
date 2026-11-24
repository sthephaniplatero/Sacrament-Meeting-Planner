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
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

// ---------- Validación con Zod ----------

// Las columnas de texto en la BD son varchar(255)
const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required.` })
    .max(255, { error: `${label} must be 255 characters or fewer.` });

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

// La tabla tiene UNIQUE (date): Postgres responde con el código 23505
function isDuplicateDateError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: string }).code === '23505'
  );
}

function duplicateDateState(values: Record<string, string>): MeetingFormState {
  return {
    message: 'Please fix the highlighted fields and try again.',
    errors: { date: ['A meeting is already scheduled for this date.'] },
    values,
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
    if (isDuplicateDateError(error)) return duplicateDateState(values);
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
    if (isDuplicateDateError(error)) return duplicateDateState(values);
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

// ---------- Autenticación ----------

export type LoginState = {
  message: string | null;
  errors: { email?: string[]; password?: string[] };
  email: string; // para no borrar el correo si falla el login
};

// Solo permite regresar a rutas de esta misma app (evita "open redirects")
function safeRedirectPath(target: FormDataEntryValue | null): string {
  if (typeof target !== 'string' || target === '') return '/meetings';
  try {
    const url = new URL(target, 'http://placeholder.local');
    const path = url.pathname + url.search;
    return path.startsWith('/') && !path.startsWith('//') && path !== '/login'
      ? path
      : '/meetings';
  } catch {
    return '/meetings';
  }
}

export async function authenticate(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const errors: LoginState['errors'] = {};
  if (!email) errors.email = ['Email is required.'];
  if (!password) errors.password = ['Password is required.'];
  if (errors.email || errors.password) {
    return { message: 'Please fill in the highlighted fields.', errors, email };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: safeRedirectPath(formData.get('redirectTo')),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message:
          error.type === 'CredentialsSignin'
            ? 'Invalid email or password.'
            : 'Something went wrong. Please try again.',
        errors: {},
        email,
      };
    }
    throw error; // signIn redirige lanzando un error especial: hay que dejarlo pasar
  }

  return { message: null, errors: {}, email };
}
