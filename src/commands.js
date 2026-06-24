import { SlashCommandBuilder } from 'discord.js';

export const scheduleAddCommand = new SlashCommandBuilder()
  .setName('schedule-add')
  .setDescription('Discord から Google カレンダーに予定を追加します')
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('予定名')
      .setRequired(true)
      .setMaxLength(200)
  )
  .addStringOption((option) =>
    option
      .setName('start')
      .setDescription('開始日時。例: 2026-06-25 19:00 または 2026-06-25T19:00:00')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('end')
      .setDescription('終了日時。省略時は既定の長さで作成')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('説明')
      .setRequired(false)
      .setMaxLength(1000)
  );

export const commands = [scheduleAddCommand.toJSON()];
