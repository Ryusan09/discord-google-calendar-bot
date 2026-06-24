import { DateTime } from 'luxon';

const INPUT_FORMATS = [
  'yyyy-MM-dd HH:mm',
  'yyyy-MM-dd H:mm',
  'yyyy/MM/dd HH:mm',
  'yyyy/MM/dd H:mm'
];

export function parseDateTime(input, timeZone) {
  const trimmed = input.trim();

  const iso = DateTime.fromISO(trimmed, { zone: timeZone });
  if (iso.isValid) {
    return iso;
  }

  for (const format of INPUT_FORMATS) {
    const parsed = DateTime.fromFormat(trimmed, format, { zone: timeZone });
    if (parsed.isValid) {
      return parsed;
    }
  }

  throw new Error(`日時の形式を解釈できません: ${input}`);
}

export function buildEventTimes({ startInput, endInput, timeZone, defaultEventMinutes }) {
  const start = parseDateTime(startInput, timeZone);
  const end = endInput
    ? parseDateTime(endInput, timeZone)
    : start.plus({ minutes: defaultEventMinutes });

  if (end <= start) {
    throw new Error('終了日時は開始日時より後にしてください');
  }

  return {
    start: start.toISO(),
    end: end.toISO()
  };
}
