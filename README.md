# Discord Google Calendar Bot

Discord のスラッシュコマンド `/schedule-add` から Google カレンダーに予定を追加する最小実装です。

## できること

- Discord で `/schedule-add` を実行
- `title`, `start`, 任意の `end`, 任意の `description` を受け取る
- Google Calendar API の `events.insert` で予定を作成
- `end` 省略時は `DEFAULT_EVENT_MINUTES` の長さで予定を作成

## セットアップ

### 1. Discord アプリを作成

1. Discord Developer Portal で Application を作成
2. Bot を作成し、Bot Token を取得
3. OAuth2 URL Generator で `bot` と `applications.commands` を付けてサーバーに招待
4. Application ID を `DISCORD_CLIENT_ID` に設定

### 2. Google Calendar API を準備

1. Google Cloud で Calendar API を有効化
2. Service Account を作成
3. JSON キーをダウンロードし、例として `google-service-account.json` として配置
4. 追加先の Google カレンダー設定で、Service Account のメールアドレスに予定変更権限を付与
5. カレンダー ID を `GOOGLE_CALENDAR_ID` に設定

個人の `primary` カレンダーへ直接追加したい場合、サービスアカウントだけでは権限が足りないことがあります。その場合は、対象カレンダーをサービスアカウントに共有するか、OAuth 認証方式に変更してください。

### 3. 環境変数を設定

```bash
cp .env.example .env
```

`.env` を編集します。

```dotenv
DISCORD_TOKEN=your-discord-bot-token
DISCORD_CLIENT_ID=your-discord-application-id
DISCORD_GUILD_ID=your-test-server-id
GOOGLE_CALENDAR_ID=your-calendar-id
GOOGLE_APPLICATION_CREDENTIALS=./google-service-account.json
TIME_ZONE=Asia/Tokyo
DEFAULT_EVENT_MINUTES=60
```

`DISCORD_GUILD_ID` を設定すると、コマンド更新がテストサーバーにすぐ反映されます。未設定の場合はグローバルコマンドとして登録され、反映に時間がかかることがあります。

### 4. 起動

```bash
npm install
npm run register
npm start
```

## 使い方

Discord で以下のように実行します。

```text
/schedule-add title:定例会 start:2026-06-25 19:00 end:2026-06-25 20:00 description:週次ミーティング
```

`start` と `end` は以下の形式を受け付けます。

- `2026-06-25 19:00`
- `2026/06/25 19:00`
- `2026-06-25T19:00:00`

## 実装メモ

- Discord の Application Commands は HTTP API で登録します。
- Google Calendar への追加は Calendar API の `events.insert` を使います。
- Bot が必要とする Discord intent は `Guilds` のみです。
