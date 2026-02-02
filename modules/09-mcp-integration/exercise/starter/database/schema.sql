-- SQLite schema for issue analysis results
-- Run this to set up the database schema

-- Main table for issue snapshots
CREATE TABLE IF NOT EXISTS issue_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    repo_owner TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    total_issues INTEGER,
    open_issues INTEGER,
    closed_issues INTEGER
);

-- Detailed issue records
CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot_id INTEGER,
    github_issue_id INTEGER,
    title TEXT,
    state TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    closed_at TIMESTAMP,
    labels TEXT,  -- JSON array
    priority_score INTEGER,  -- Calculated: 0-100
    age_days INTEGER,
    FOREIGN KEY (snapshot_id) REFERENCES issue_snapshots(id)
);

-- Label summary
CREATE TABLE IF NOT EXISTS label_summary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot_id INTEGER,
    label_name TEXT,
    issue_count INTEGER,
    avg_age_days REAL,
    FOREIGN KEY (snapshot_id) REFERENCES issue_snapshots(id)
);

-- Analysis metadata
CREATE TABLE IF NOT EXISTS analysis_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snapshot_id INTEGER,
    analysis_duration_ms INTEGER,
    errors TEXT,  -- JSON array of errors
    slack_notification_sent BOOLEAN DEFAULT FALSE,
    slack_channel TEXT,
    FOREIGN KEY (snapshot_id) REFERENCES issue_snapshots(id)
);

-- Sample queries for reference

-- Get latest snapshot
SELECT * FROM issue_snapshots 
ORDER BY snapshot_date DESC 
LIMIT 1;

-- Get high priority issues (older than 30 days)
SELECT * FROM issues 
WHERE age_days > 30 AND state = 'open'
ORDER BY age_days DESC;

-- Get label distribution
SELECT label_name, issue_count, avg_age_days 
FROM label_summary 
WHERE snapshot_id = (SELECT MAX(id) FROM issue_snapshots)
ORDER BY issue_count DESC;
