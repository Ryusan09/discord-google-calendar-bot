# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際に Claude Code (claude.ai/code) が参照するためのガイドです。

## プロジェクト概要

Discord のスラッシュコマンドから Google カレンダーに予定を追加する Node.js ボットです。通常の予定追加に加えて、シフト表 PDF を解析して指定メンバーの早番・遅番をまとめて登録する機能を持ちます。

- ランタイム: Node.js (ESM、`package.json` の `"type": "module"`)
- 主な依存: `discord.js` (v14)、`googleapis`、`luxon`、`pdfjs-dist`、`dotenv`

## よく使うコマンド

```bash
npm install            # 依存をインストール
npm run register       # Discord にスラッシュコマンドを登録 (src/register-commands.js)
npm start              # ボットを起動 (src/index.js)
```

スラッシュコマンドの定義 (`src/commands.js`) を変更したら、必ず `npm run register` を実行して Discord に反映させること。`DISCORD_GUILD_ID` が設定されていればテストサーバーへ即時反映され、未設定だとグローバル登録となり反映が遅くなります。

テストフレームワークやリンターは未導入です。

## アーキテクチャ

エントリーポイントは `src/index.js`。`discord.js` クライアントを `Guilds` intent のみで起動し、`interactionCreate` で 3 つのコマンドを処理します。

- `/add` — 1 つの入力欄に予定名と日時をまとめて入力 (`src/command-input.js` で解析)
- `/schedule-add` — `title` / `start` / `end` / `description` を個別に指定する従来形式
- `/shift-import` — シフト表 PDF を添付し、指定メンバーのシフトを一括登録

モジュールの責務:

- `src/config.js` — 環境変数の読み込みと検証。必須変数が無い、または不正な値だと起動時に例外を投げる。`config` オブジェクトを各所が import する。
- `src/commands.js` — `SlashCommandBuilder` でコマンド定義。`commands` 配列を登録処理が利用。
- `src/register-commands.js` — Discord REST API へコマンドを登録 (guild または global)。
- `src/calendar.js` — Google Calendar API (`events.insert`) で予定を作成。`GoogleAuth` を使い、`calendar.events` スコープのサービスアカウント認証。
- `src/date.js` — `/add` `/schedule-add` 用の日時解析 (`buildEventTimes` / `parseDateTime`)。ISO といくつかの `yyyy-MM-dd HH:mm` 形式を受け付ける。`end` 省略時は `DEFAULT_EVENT_MINUTES` 分の長さにする。
- `src/command-input.js` — `/add` の単一文字列を `title` / `start` / `end` / `description` に分解。`|` 区切りと、正規表現による日時抽出の 2 方式に対応。
- `src/shift-pdf.js` — `pdfjs-dist` でシフト表 PDF を解析。テキストの座標 (x, y) から行・列・セルを再構成し、`①`=早番 / `②`=遅番 のマークと対象者名を含むセルを抽出する。月またぎの日付補正ロジックを含む。
- `src/shift-events.js` — シフト 1 件の開始/終了時刻を `luxon` で算出 (`buildShiftEventTimes`)。
- `src/shift-person.js` — 既定の対象者名を `shift-person.txt` から読み込む (`/shift-import` で `person` 省略時)。

## 設定とシークレット

環境変数は `.env` で管理 (`.env.example` 参照)。主な変数:

- `DISCORD_TOKEN`, `DISCORD_CLIENT_ID` (必須)、`DISCORD_GUILD_ID` (任意)
- `GOOGLE_CALENDAR_ID`, `GOOGLE_APPLICATION_CREDENTIALS` (必須。サービスアカウント JSON のパス)
- `TIME_ZONE` (既定 `Asia/Tokyo`)、`DEFAULT_EVENT_MINUTES` (既定 60)
- `SHIFT_EARLY_START` (既定 `17:30`)、`SHIFT_LATE_START` (既定 `19:30`) — `HH:mm` 形式

以下は `.gitignore` 済みでコミットしないこと: `.env`、`google-service-account.json`、`shift-person.txt`、`node_modules/`。

## 注意点

- ESM のため import には拡張子 `.js` を付けること。
- Discord の応答はすべて `ephemeral` (本人のみ表示) で返している。
- シフト表 PDF の解析は座標ベースのヒューリスティックなので、レイアウトが変わると `src/shift-pdf.js` のしきい値 (行のy差、列のx間隔など) の調整が必要になる可能性がある。
