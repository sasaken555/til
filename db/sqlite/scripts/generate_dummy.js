const fs = require('fs');

const trackers = ['バグ', '機能', 'サポート', 'タスク'];
const statuses = ['新規', '進行中', '解決', 'フィードバック', '却下', '終了'];
const priorities = ['低め', '通常', '高め', '急いで', '今すぐ'];
const assignees = ['山田 太郎', '鈴木 花子', '田中 一郎', '佐藤 美咲', '伊藤 健二', '渡辺 由美'];

const bugTitles = [
  'ログイン画面でエラーが発生する',
  'パスワードリセットが機能しない',
  'セッションタイムアウト後にリダイレクトされない',
  '検索結果が正しく表示されない',
  'ファイルアップロードが500エラーになる',
  'メール通知が送信されない',
  'CSVエクスポートで文字化けが発生',
  'ページネーションが正しく動作しない',
  'ソート順が保持されない',
  'フォームバリデーションが機能しない',
];

const featureTitles = [
  'ダッシュボードに集計グラフを追加',
  'API認証にOAuthを実装',
  '多言語対応（英語）',
  'バッチ処理の進捗表示機能',
  'ユーザー権限管理の強化',
  'レポート自動生成機能',
  '通知設定のカスタマイズ',
  'スマートフォン対応レイアウト',
  'CSVインポート機能の追加',
  '監査ログ機能の実装',
];

const taskTitles = [
  'データベースのインデックス最適化',
  'サーバー証明書の更新',
  '依存ライブラリのアップデート',
  'テスト環境の構築',
  'ドキュメントの更新',
  'コードレビューの実施',
  'パフォーマンス計測',
  'セキュリティ診断の依頼',
  'バックアップ設定の確認',
  'デプロイ手順書の整備',
];

const supportTitles = [
  'ユーザーからのログイン問い合わせ対応',
  'データ移行支援',
  '権限設定の変更依頼',
  'レポート出力の説明',
  'API仕様の問い合わせ',
];

const descriptions = [
  '再現手順：1. トップページにアクセス 2. ログインボタンをクリック 3. エラーメッセージが表示される',
  '期待動作：正常に処理が完了すること。実際の動作：500エラーが返却される。',
  'ユーザーからの要望に基づく機能追加。詳細は添付の要件定義書を参照。',
  '定期メンテナンスの一環として実施する。影響範囲を事前に確認すること。',
  '優先度高のため早急な対応が必要。関連チームへの連絡も忘れずに。',
  '設計書に基づき実装を進める。テストケースも合わせて作成すること。',
  'ステージング環境で確認後、本番環境へ適用する。',
  '詳細は別途Wikiページにまとめること。',
  '対応完了後、QAチームへ通知すること。',
  '',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${dd}`;
}

function formatDatetime(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${dd} ${hh}:${mm}:${ss}`;
}

function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const projectStart = new Date('2024-01-01');
const projectEnd = new Date('2026-04-19');

const rows = [];
// header
rows.push(['チケット番号', 'トラッカー', 'ステータス', '優先度', '題名', '説明', '担当者', '期日', '作成日時', '更新日時'].join(','));

for (let i = 1; i <= 200; i++) {
  const tracker = randomItem(trackers);
  const status = randomItem(statuses);
  const priority = randomItem(priorities);

  let title;
  if (tracker === 'バグ') title = randomItem(bugTitles) + ` #${i}`;
  else if (tracker === '機能') title = randomItem(featureTitles) + ` #${i}`;
  else if (tracker === 'タスク') title = randomItem(taskTitles) + ` #${i}`;
  else title = randomItem(supportTitles) + ` #${i}`;

  const description = randomItem(descriptions);
  const assignee = randomItem(assignees);

  const createdAt = randomDate(projectStart, projectEnd);
  const updatedAt = randomDate(createdAt, projectEnd);

  // 期日: 未設定の場合あり (20%の確率で空)
  let dueDate = '';
  if (Math.random() > 0.2) {
    const due = randomDate(createdAt, new Date(projectEnd.getTime() + 30 * 24 * 60 * 60 * 1000));
    dueDate = formatDate(due);
  }

  const row = [
    i,
    escapeCSV(tracker),
    escapeCSV(status),
    escapeCSV(priority),
    escapeCSV(title),
    escapeCSV(description),
    escapeCSV(assignee),
    dueDate,
    formatDatetime(createdAt),
    formatDatetime(updatedAt),
  ].join(',');

  rows.push(row);
}

const content = rows.join('\n') + '\n';
fs.writeFileSync('redmine_tickets_dummy.csv', content, { encoding: 'utf8' });
console.log('生成完了: redmine_tickets_dummy.csv (200件)');
