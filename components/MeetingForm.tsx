'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { MeetingFormField, MeetingFormState } from '@/lib/actions';
import type { SacramentMeeting } from '@/lib/types';

type MeetingFormAction = (
  prevState: MeetingFormState,
  formData: FormData
) => Promise<MeetingFormState>;

interface MeetingFormProps {
  readonly action: MeetingFormAction;
  readonly meeting?: SacramentMeeting;
  readonly submitLabel: string;
}

// Convierte una reunión existente en los valores de texto del formulario
function meetingToValues(meeting?: SacramentMeeting): Record<string, string> {
  if (!meeting) return {};
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join('\n'),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join('\n'),
    stakeBusiness: meeting.stakeBusiness ? 'on' : '',
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers
      .map((s) =>
        s.type === 'musical-number'
          ? `${s.name} | ${s.topic} | musical`
          : `${s.name} | ${s.topic}`
      )
      .join('\n'),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

const inputClass =
  'mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[invalid=true]:border-red-700';
const labelClass = 'block text-sm font-medium text-foreground';
const fieldsetClass = 'space-y-4 rounded-lg border border-border bg-surface p-5';
const legendClass = 'px-1 text-base font-semibold text-foreground';

// Contenedor de errores: SIEMPRE se renderiza para que aria-live funcione
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

interface TextFieldProps {
  readonly name: MeetingFormField;
  readonly label: string;
  readonly values: Record<string, string>;
  readonly errors?: string[];
  readonly type?: 'text' | 'date' | 'number';
  readonly required?: boolean;
}

function TextField({ name, label, values, errors, type = 'text', required = true }: TextFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="text-muted"> (required)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={type === 'number' ? 1 : undefined}
        defaultValue={values[name] ?? ''}
        aria-required={required}
        aria-invalid={errors ? true : undefined}
        aria-describedby={errorId}
        className={inputClass}
      />
      <FieldError id={errorId} errors={errors} />
    </div>
  );
}

interface TextAreaFieldProps {
  readonly name: MeetingFormField;
  readonly label: string;
  readonly hint: string;
  readonly values: Record<string, string>;
  readonly errors?: string[];
}

function TextAreaField({ name, label, hint, values, errors }: TextAreaFieldProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <p id={hintId} className="text-xs text-muted">
        {hint}
      </p>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={values[name] ?? ''}
        aria-invalid={errors ? true : undefined}
        aria-describedby={`${hintId} ${errorId}`}
        className={inputClass}
      />
      <FieldError id={errorId} errors={errors} />
    </div>
  );
}

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
  const initialState: MeetingFormState = {
    message: null,
    errors: {},
    values: meetingToValues(meeting),
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const { errors, values } = state;

  return (
    // noValidate: dejamos que valide el SERVIDOR (Zod) y muestre sus mensajes
    <form action={formAction} noValidate className="space-y-6">
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Meeting details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="date" label="Date" type="date" values={values} errors={errors.date} />
          <div>
            <label htmlFor="meetingType" className={labelClass}>
              Meeting type<span className="text-muted"> (required)</span>
            </label>
            <select
              id="meetingType"
              name="meetingType"
              defaultValue={values.meetingType ?? ''}
              aria-required
              aria-invalid={errors.meetingType ? true : undefined}
              aria-describedby="meetingType-error"
              className={inputClass}
            >
              <option value="">Select a type…</option>
              <option value="regular">Regular Service</option>
              <option value="testimony">Fast &amp; Testimony</option>
              <option value="stake">Stake Conference</option>
              <option value="general">General Conference</option>
            </select>
            <FieldError id="meetingType-error" errors={errors.meetingType} />
          </div>
          <TextField name="presiding" label="Presiding" values={values} errors={errors.presiding} />
          <TextField name="conducting" label="Conducting" values={values} errors={errors.conducting} />
        </div>
        <TextAreaField
          name="announcements"
          label="Announcements"
          hint="Optional. One announcement per line."
          values={values}
          errors={errors.announcements}
        />
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Opening</legend>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <TextField name="openingHymnNumber" label="Opening hymn number" type="number" values={values} errors={errors.openingHymnNumber} />
          <TextField name="openingHymnTitle" label="Opening hymn title" values={values} errors={errors.openingHymnTitle} />
        </div>
        <TextField name="openingPrayer" label="Opening prayer" values={values} errors={errors.openingPrayer} />
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Business</legend>
        <TextAreaField
          name="wardBusiness"
          label="Ward business"
          hint="Optional. One item per line (releases, sustainings, etc.)."
          values={values}
          errors={errors.wardBusiness}
        />
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness === 'on'}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium text-foreground">
            Stake business will be conducted
          </label>
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Sacrament</legend>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <TextField name="sacramentHymnNumber" label="Sacrament hymn number" type="number" values={values} errors={errors.sacramentHymnNumber} />
          <TextField name="sacramentHymnTitle" label="Sacrament hymn title" values={values} errors={errors.sacramentHymnTitle} />
        </div>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Program</legend>
        <TextAreaField
          name="speakers"
          label="Speakers and musical numbers"
          hint='One per line as "Name | Topic". For a musical number add "| musical" at the end.'
          values={values}
          errors={errors.speakers}
        />
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Closing</legend>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <TextField name="closingHymnNumber" label="Closing hymn number" type="number" values={values} errors={errors.closingHymnNumber} />
          <TextField name="closingHymnTitle" label="Closing hymn title" values={values} errors={errors.closingHymnTitle} />
        </div>
        <TextField name="closingPrayer" label="Closing prayer" values={values} errors={errors.closingPrayer} />
      </fieldset>

      {/* Mensaje general del formulario */}
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {state.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
