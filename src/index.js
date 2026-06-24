import { Client, GatewayIntentBits } from 'discord.js';
import { createCalendarEvent } from './calendar.js';
import { config } from './config.js';
import { buildEventTimes } from './date.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'schedule-add') {
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const title = interaction.options.getString('title', true);
    const startInput = interaction.options.getString('start', true);
    const endInput = interaction.options.getString('end');
    const description = interaction.options.getString('description') || undefined;

    const { start, end } = buildEventTimes({
      startInput,
      endInput,
      timeZone: config.timeZone,
      defaultEventMinutes: config.defaultEventMinutes
    });

    const event = await createCalendarEvent({
      title,
      description,
      start,
      end
    });

    const linkText = event.htmlLink ? `\n${event.htmlLink}` : '';
    await interaction.editReply(`Google カレンダーに追加しました: ${event.summary}${linkText}`);
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      error instanceof Error
        ? `予定を追加できませんでした: ${error.message}`
        : '予定を追加できませんでした'
    );
  }
});

await client.login(config.discordToken);
