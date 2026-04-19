# ADR: FTS5 を使った全文検索の導入

## ステータス

採用済み

---

## コンテキスト

Redmine チケット一覧を SQLite3 にインポートした DB（`redmine_tickets` テーブル）において、`subject`（題名）と `description`（説明）に対するキーワード検索を `LIKE '%keyword%'` で実装していた。チケット件数が増加するにつれ、LIKE 検索はインデックスを使えないためフルテーブルスキャンが発生し、検索パフォーマンスが低下した。

---

## 決定事項

SQLite3 の **FTS5 拡張機能** を使用して全文検索インデックスを導入する。

### 採用方式

| 項目 | 内容 |
|------|------|
| FTS5 テーブル種別 | External Content Table |
| トークナイザー | `trigram` |
| インデックス対象カラム | `subject`（題名）、`description`（説明） |
| 元テーブル | `redmine_tickets`（変更なし） |

---

## 理由

### External Content Table を選択した理由

- FTS5 テーブルにデータをコピーせず、元の `redmine_tickets` を参照する形式のため **データの二重保存が不要**
- `redmine_tickets` の全カラム（`tracker`, `status`, `priority` 等）は元テーブルに保持されたまま JOIN で取得できる
- ストレージ使用量を最小限に抑えられる

### trigram トークナイザーを選択した理由

- デフォルトの `unicode61` トークナイザーはスペースや句読点を区切り文字として単語を抽出するが、**日本語はスペース区切りを使わないため機能しない**
- `trigram` トークナイザーは3文字単位でインデックスを作成するため、**日本語の部分一致検索（中間一致）に対応**できる
- `LIKE '%keyword%'` と同等の検索をインデックスで高速化する機能も内包する
- サードパーティのトークナイザー（MeCab 等）を導入せず、標準機能だけで実現できる

### 却下した代替案

| 案 | 却下理由 |
|----|----------|
| unicode61 トークナイザー | 日本語の単語境界を認識できないため不適 |
| ascii トークナイザー | 日本語の非 ASCII 文字をすべてトークンとして扱うが単語分割はできない |
| porter トークナイザー | 英語のステミングのみが目的で日本語には効果なし |
| FTS5 通常テーブル（content 指定なし） | データが二重になりストレージ効率が悪い |
| contentless テーブル | 検索結果から元の列値を取得できず実用性が低い |

---

## 結果

### FTS5 仮想テーブル定義

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS redmine_tickets_fts
USING fts5(
    subject,
    description,
    content='redmine_tickets',
    content_rowid='ticket_id',
    tokenize='trigram'
);
```

### 同期トリガー

`redmine_tickets` への INSERT / UPDATE / DELETE を FTS インデックスに自動反映するトリガーを設置する。

```sql
CREATE TRIGGER IF NOT EXISTS rt_ai AFTER INSERT ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(rowid, subject, description)
  VALUES (new.ticket_id, new.subject, new.description);
END;

CREATE TRIGGER IF NOT EXISTS rt_ad AFTER DELETE ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(redmine_tickets_fts, rowid, subject, description)
  VALUES ('delete', old.ticket_id, old.subject, old.description);
END;

CREATE TRIGGER IF NOT EXISTS rt_au AFTER UPDATE ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(redmine_tickets_fts, rowid, subject, description)
  VALUES ('delete', old.ticket_id, old.subject, old.description);
  INSERT INTO redmine_tickets_fts(rowid, subject, description)
  VALUES (new.ticket_id, new.subject, new.description);
END;
```

### クエリパターン

| 用途 | クエリ例 |
|------|----------|
| 全カラム対象の単語検索 | `WHERE redmine_tickets_fts MATCH 'エラー'` |
| AND 検索 | `WHERE redmine_tickets_fts MATCH 'ログイン AND エラー'` |
| OR 検索 | `WHERE redmine_tickets_fts MATCH 'タイムアウト OR エラー'` |
| subject のみ検索 | `WHERE redmine_tickets_fts MATCH 'subject: エラー'` |
| ヒット箇所のハイライト | `snippet(redmine_tickets_fts, 0, '[', ']', '...', 15)` |
| 関連度順のソート | `ORDER BY rank` |

### パフォーマンス比較

| 比較項目 | LIKE 検索 | FTS5 (trigram) |
|----------|-----------|----------------|
| インデックス活用 | ❌（フルスキャン） | ✅ |
| 日本語対応 | ✅ | ✅ |
| 中間一致 | ✅ | ✅ |
| スコアリング | ❌ | ✅（bm25 / rank） |
| ハイライト表示 | ❌ | ✅（snippet / highlight） |

---

## 参考

- [SQLite FTS5 Extension](https://www.sqlite.org/fts5.html)
- `docs/import-csv-to-sqlite.md` — FTS5 テーブルの作成・クエリ手順
- `scripts/create_fts5.sql` — FTS5 テーブル・トリガー定義 SQL
