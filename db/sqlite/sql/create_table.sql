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
