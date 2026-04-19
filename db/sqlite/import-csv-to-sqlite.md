# SQLiteサンプル - Redmine CSV → SQLite インポート手順

## 前提条件

`sqlite3` コマンドが利用可能であること。

```bash
sqlite3 --version
```

---

## 1. CSVのサンプリング確認

インポート前にCSVの先頭行（ヘッダー）とデータ行を確認する。

```bash
# ヘッダー行を確認
head -1 inputs/redmine_tickets_dummy.csv

# 先頭5件を確認
head -6 inputs/redmine_tickets_dummy.csv
```

**CSVカラム構成（順序通り）:**

| 列番号 | CSVカラム名 | DBカラム名    | 型      | 備考 |
|--------|------------|--------------|---------|------|
| 1      | チケット番号 | ticket_id   | INTEGER | PK |
| 2      | トラッカー   | tracker     | TEXT    | CHECK制約あり |
| 3      | ステータス   | status      | TEXT    | CHECK制約あり |
| 4      | 優先度       | priority    | TEXT    | CHECK制約あり |
| 5      | 題名         | subject     | TEXT    | |
| 6      | 説明         | description | TEXT    | 空あり |
| 7      | 担当者       | assignee    | TEXT    | |
| 8      | 期日         | due_date    | TEXT    | 空あり (YYYY/MM/DD) |
| 9      | 作成日時     | created_at  | TEXT    | (YYYY/MM/DD HH:MM:SS) |
| 10     | 更新日時     | updated_at  | TEXT    | (YYYY/MM/DD HH:MM:SS) |

---

## 2. DBファイルとテーブルの作成

SQLファイルを用意してテーブルを定義する。

```bash
cat << 'EOF' > scripts/create_table.sql
CREATE TABLE IF NOT EXISTS redmine_tickets (
    ticket_id   INTEGER PRIMARY KEY,
    tracker     TEXT NOT NULL CHECK(tracker  IN ('バグ', '機能', 'サポート', 'タスク')),
    status      TEXT NOT NULL CHECK(status   IN ('新規', '進行中', '解決', 'フィードバック', '却下', '終了')),
    priority    TEXT NOT NULL CHECK(priority IN ('低め', '通常', '高め', '急いで', '今すぐ')),
    subject     TEXT NOT NULL,
    description TEXT,
    assignee    TEXT,
    due_date    TEXT,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
EOF
```

DBファイルを作成しテーブル定義を適用する。

```bash
sqlite3 db/redmine.db < scripts/create_table.sql
```

テーブルが作成されたことを確認する。

```bash
sqlite3 db/redmine.db ".schema redmine_tickets"
```

---

## 3. CSVインポート

`sqlite3` の `.import` コマンドを使い、CSVをテーブルにインポートする。  
`--skip 1` オプションでヘッダー行をスキップする。

```bash
sqlite3 db/redmine.db \
  ".separator ," \
  ".import --csv --skip 1 inputs/redmine_tickets_dummy.csv redmine_tickets"
```

---

## 4. インポート結果の検証

### 件数確認

```bash
sqlite3 db/redmine.db "SELECT COUNT(*) FROM redmine_tickets;"
```

期待値: `200`

### 先頭5件の確認

```bash
sqlite3 -header -column db/redmine.db \
  "SELECT ticket_id, tracker, status, priority, subject FROM redmine_tickets LIMIT 5;"
```

### トラッカー別件数

```bash
sqlite3 -header -column db/redmine.db \
  "SELECT tracker, COUNT(*) AS cnt FROM redmine_tickets GROUP BY tracker ORDER BY cnt DESC;"
```

### ステータス別件数

```bash
sqlite3 -header -column db/redmine.db \
  "SELECT status, COUNT(*) AS cnt FROM redmine_tickets GROUP BY status ORDER BY cnt DESC;"
```

### 期日が空のチケット数

```bash
sqlite3 db/redmine.db \
  "SELECT COUNT(*) FROM redmine_tickets WHERE due_date = '';"
```

---

## 5. FTS5 全文検索インデックスの構築

> 詳細な設計判断は `docs/adr-full-text-search.md` を参照。

### FTS5 仮想テーブルとトリガーの作成

`scripts/create_fts5.sql` を DB に適用する。  
`subject`（題名）と `description`（説明）を対象に、trigram トークナイザーで External Content FTS5 テーブルを作成し、既存データを一括インデックス化する。

```bash
sqlite3 db/redmine.db < scripts/create_fts5.sql
```

### 作成されたオブジェクトの確認

```bash
sqlite3 db/redmine.db ".tables"
```

期待値（FTS5 関連テーブルが追加されていること）:

```
redmine_tickets              redmine_tickets_fts_data
redmine_tickets_fts          redmine_tickets_fts_docsize
redmine_tickets_fts_config   redmine_tickets_fts_idx
```

### インデックス件数の確認

```bash
sqlite3 -header -column db/redmine.db \
  "SELECT COUNT(*) AS fts_count FROM redmine_tickets_fts;"
```

期待値: `200`

---

## 6. FTS5 全文検索クエリの実行

### 基本検索（全カラム対象）

`subject` または `description` のどちらかに含むチケットを関連度順で返す。

```bash
sqlite3 -header -column db/redmine.db "
SELECT t.ticket_id, t.tracker, t.status, t.subject
FROM redmine_tickets_fts f
JOIN redmine_tickets t ON f.rowid = t.ticket_id
WHERE redmine_tickets_fts MATCH 'エラー'
ORDER BY rank
LIMIT 10;
"
```

### AND 検索（複数キーワード）

```bash
sqlite3 -header -column db/redmine.db "
SELECT t.ticket_id, t.subject
FROM redmine_tickets_fts f
JOIN redmine_tickets t ON f.rowid = t.ticket_id
WHERE redmine_tickets_fts MATCH 'ログイン AND エラー'
ORDER BY rank
LIMIT 10;
"
```

### カラムフィルター検索（subject のみ）

```bash
sqlite3 -header -column db/redmine.db "
SELECT t.ticket_id, t.subject
FROM redmine_tickets_fts f
JOIN redmine_tickets t ON f.rowid = t.ticket_id
WHERE redmine_tickets_fts MATCH 'subject: エラー'
ORDER BY rank
LIMIT 10;
"
```

### snippet() によるヒット箇所のハイライト表示

第2引数はカラムインデックス（0 = subject, 1 = description）。

```bash
sqlite3 -header -column db/redmine.db "
SELECT
  t.ticket_id,
  snippet(redmine_tickets_fts, 0, '[', ']', '...', 15) AS subject_snippet
FROM redmine_tickets_fts f
JOIN redmine_tickets t ON f.rowid = t.ticket_id
WHERE redmine_tickets_fts MATCH 'subject: エラー'
ORDER BY rank
LIMIT 5;
"
```
