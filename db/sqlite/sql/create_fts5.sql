-- FTS5 External Content テーブルの作成
-- trigramトークナイザーを使用（日本語中間一致対応）
CREATE VIRTUAL TABLE IF NOT EXISTS redmine_tickets_fts
USING fts5(
    subject,
    description,
    content='redmine_tickets',
    content_rowid='ticket_id',
    tokenize='trigram'
);

-- 既存データを一括投入してインデックスを構築
INSERT INTO redmine_tickets_fts(rowid, subject, description)
SELECT ticket_id, subject, description FROM redmine_tickets;

-- redmine_tickets と FTS5 インデックスの同期トリガー

-- INSERT後
CREATE TRIGGER IF NOT EXISTS rt_ai AFTER INSERT ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(rowid, subject, description)
  VALUES (new.ticket_id, new.subject, new.description);
END;

-- DELETE後（元データが消える前にFTSから削除）
CREATE TRIGGER IF NOT EXISTS rt_ad AFTER DELETE ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(redmine_tickets_fts, rowid, subject, description)
  VALUES ('delete', old.ticket_id, old.subject, old.description);
END;

-- UPDATE後（旧エントリ削除 → 新エントリ追加）
CREATE TRIGGER IF NOT EXISTS rt_au AFTER UPDATE ON redmine_tickets BEGIN
  INSERT INTO redmine_tickets_fts(redmine_tickets_fts, rowid, subject, description)
  VALUES ('delete', old.ticket_id, old.subject, old.description);
  INSERT INTO redmine_tickets_fts(rowid, subject, description)
  VALUES (new.ticket_id, new.subject, new.description);
END;
