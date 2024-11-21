import Database from 'better-sqlite3';

const db = new Database('models.db', { verbose: console.log });

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    train_data TEXT,
    test_data TEXT,
    model_params TEXT
  )
`);

export default db;