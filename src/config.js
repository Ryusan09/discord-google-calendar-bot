import 'dotenv/config';

const required = [
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID',
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_APPLICATION_CREDENTIALS'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID || null,
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID,
  timeZone: process.env.TIME_ZONE || 'Asia/Tokyo',
  defaultEventMinutes: Number.parseInt(process.env.DEFAULT_EVENT_MINUTES || '60', 10)
};

if (!Number.isFinite(config.defaultEventMinutes) || config.defaultEventMinutes <= 0) {
  throw new Error('DEFAULT_EVENT_MINUTES must be a positive number');
}
