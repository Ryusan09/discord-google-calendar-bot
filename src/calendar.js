import { google } from 'googleapis';
import { config } from './config.js';

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar.events']
});

const calendar = google.calendar({ version: 'v3', auth });

export async function createCalendarEvent({ title, description, start, end }) {
  const response = await calendar.events.insert({
    calendarId: config.googleCalendarId,
    requestBody: {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: config.timeZone
      },
      end: {
        dateTime: end,
        timeZone: config.timeZone
      }
    }
  });

  return response.data;
}
