import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const databaseDir = join(root, 'data');
mkdirSync(databaseDir, { recursive: true });
const db = new DatabaseSync(join(databaseDir, 'flowmind.sqlite'));
const app = express();
const port = Number(process.env.PORT || 3001);
const ragApiUrl = (process.env.RAG_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

app.use(express.json({ limit: '1mb' }));

db.exec(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL, sender TEXT NOT NULL,
    text TEXT NOT NULL, timestamp TEXT NOT NULL, metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS checklist_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
    item_id TEXT NOT NULL, status TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS lab_bookings (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL, test_title TEXT NOT NULL,
    lab_id TEXT NOT NULL, booking_date TEXT NOT NULL, booking_time TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS product_analyses (
    id TEXT PRIMARY KEY, session_id TEXT NOT NULL, category TEXT NOT NULL,
    product_title TEXT NOT NULL, specifications TEXT NOT NULL, result TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS activity_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const id = (prefix) => `${prefix}-${crypto.randomUUID()}`;
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const required = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
};
const recordActivity = (sessionId, eventType, payload) => {
  db.prepare('INSERT INTO activity_history (session_id, event_type, payload) VALUES (?, ?, ?)')
    .run(sessionId, eventType, JSON.stringify(payload));
};
const saveMessage = (sessionId, message) => {
  db.prepare('INSERT INTO chat_messages (id, session_id, sender, text, timestamp, metadata) VALUES (?, ?, ?, ?, ?, ?)')
    .run(message.id, sessionId, message.sender, message.text || '', message.timestamp, JSON.stringify(message));
};

const ragJson = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${ragApiUrl}${path}`, options);
  } catch {
    throw new Error('BIS RAG service is unavailable. Start it with "uvicorn main:app --reload" inside bis_ai_rag.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || body.error || 'BIS RAG request failed.');
  return body;
};

function createAssistantReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes('cement') || lower.includes('1489')) {
    return { text: 'Auditing cement specification against IS 1489 (Part 1): 2015 (Portland Pozzolana Cement). Chemical and physical benchmarks verified.', standardRef: 'IS 1489 (Part 1): 2015' };
  }
  if (lower.includes('isi') || lower.includes('dimension') || lower.includes('mark')) {
    return { text: 'Under the BIS (Conformity Assessment) Regulations 2018, the Standard Mark consists of the BIS monogram, the relevant Indian Standard number, and a unique License Number (CM/L-XXXXXXX).', standardRef: 'BIS Marking Guidelines' };
  }
  if (lower.includes('crs') || lower.includes('13252')) {
    return { text: 'CRS for electronics under IS 13252 (Part 1) requires testing at BIS-recognized NABL labs before registration. Confirm the applicable safety and marking tests with the chosen laboratory.', standardRef: 'IS 13252 (Part 1): 2010' };
  }
  return { text: `Analysis logged for query: "${text}". Technical clauses were cross-referenced against the BIS standards repository.`, standardRef: undefined };
}

app.get('/api/state/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const messages = db.prepare('SELECT metadata FROM chat_messages WHERE session_id = ? ORDER BY created_at, rowid').all(sessionId)
    .map((row) => JSON.parse(row.metadata));
  const checklist = db.prepare(`SELECT item_id AS itemId, status FROM checklist_history
    WHERE session_id = ? AND id IN (SELECT MAX(id) FROM checklist_history WHERE session_id = ? GROUP BY item_id)`).all(sessionId, sessionId);
  res.json({ messages, checklist });
});

app.post('/api/chat', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const text = required(req.body.text, 'text');
    const user = { id: id('msg'), sender: 'user', text, timestamp: now() };
    ragJson('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: text }) })
      .then(({ response }) => {
        const reply = { id: id('bot'), sender: 'assistant', text: response, timestamp: now() };
        saveMessage(sessionId, user);
        saveMessage(sessionId, reply);
        recordActivity(sessionId, 'rag_chat', { userMessageId: user.id, assistantMessageId: reply.id });
        res.status(201).json({ user, reply });
      }).catch(next);
  } catch (error) { next(error); }
});

app.post('/api/audit', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const query = required(req.body.query, 'query');
    ragJson('/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
      .then(({ data }) => {
        recordActivity(sessionId, 'rag_audit', { query, data });
        res.json({ data });
      }).catch(next);
  } catch (error) { next(error); }
});

app.post('/api/product-lookup', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const query = required(req.body.query, 'query');
    ragJson('/product', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
      .then(({ details }) => {
        recordActivity(sessionId, 'rag_product_lookup', { query, details });
        res.json({ details });
      }).catch(next);
  } catch (error) { next(error); }
});

app.get('/api/rag-labs', (req, res, next) => {
  const sessionId = String(req.query.sessionId || '');
  const category = String(req.query.category || '').trim();
  if (!sessionId || !category) return next(new Error('sessionId and category are required.'));
  ragJson(`/labs?category=${encodeURIComponent(category)}`).then(({ labs }) => {
    recordActivity(sessionId, 'rag_labs_lookup', { category, resultCount: labs.length });
    res.json({ labs });
  }).catch(next);
});

app.post('/api/voice-query', (req, res, next) => {
  const sessionId = String(req.query.sessionId || '');
  if (!sessionId) return next(new Error('sessionId is required.'));
  fetch(`${ragApiUrl}/voice-query`, { method: 'POST', headers: { 'content-type': req.headers['content-type'] || '' }, body: req, duplex: 'half' })
    .then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || 'Voice query failed.');
      const user = { id: id('voice'), sender: 'user', text: body.transcription, timestamp: now() };
      const reply = { id: id('bot'), sender: 'assistant', text: body.response, timestamp: now() };
      saveMessage(sessionId, user); saveMessage(sessionId, reply);
      recordActivity(sessionId, 'rag_voice_query', { userMessageId: user.id, assistantMessageId: reply.id });
      res.status(201).json({ user, reply, transcription: body.transcription });
    }).catch(next);
});

app.post('/api/checklist', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const itemId = required(req.body.itemId, 'itemId');
    const status = required(req.body.status, 'status');
    if (!['pending', 'in_progress', 'complete'].includes(status)) throw new Error('Invalid checklist status.');
    db.prepare('INSERT INTO checklist_history (session_id, item_id, status) VALUES (?, ?, ?)').run(sessionId, itemId, status);
    recordActivity(sessionId, 'checklist_updated', { itemId, status });
    res.status(201).json({ itemId, status });
  } catch (error) { next(error); }
});

app.post('/api/bookings', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const booking = req.body.booking || {};
    const record = { id: id('booking'), sessionId, testTitle: required(booking.testTitle, 'testTitle'), labId: required(booking.labId, 'labId'), date: required(booking.date, 'date'), time: required(booking.time, 'time') };
    db.prepare('INSERT INTO lab_bookings (id, session_id, test_title, lab_id, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?)')
      .run(record.id, sessionId, record.testTitle, record.labId, record.date, record.time);
    recordActivity(sessionId, 'lab_booking_created', record);
    res.status(201).json(record);
  } catch (error) { next(error); }
});

app.post('/api/product-analyses', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const analysis = req.body.analysis || {};
    const record = { id: id('analysis'), sessionId, category: required(analysis.category, 'category'), productTitle: required(analysis.productTitle, 'productTitle'), specifications: required(analysis.specifications, 'specifications'), result: analysis.result || {} };
    db.prepare('INSERT INTO product_analyses (id, session_id, category, product_title, specifications, result) VALUES (?, ?, ?, ?, ?, ?)')
      .run(record.id, sessionId, record.category, record.productTitle, record.specifications, JSON.stringify(record.result));
    recordActivity(sessionId, 'product_analysis_created', { id: record.id, category: record.category, productTitle: record.productTitle });
    res.status(201).json(record);
  } catch (error) { next(error); }
});

app.post('/api/activity', (req, res, next) => {
  try {
    const sessionId = required(req.body.sessionId, 'sessionId');
    const eventType = required(req.body.eventType, 'eventType');
    recordActivity(sessionId, eventType, req.body.payload || {});
    res.status(201).json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/history/:sessionId', (req, res) => {
  const history = db.prepare('SELECT id, event_type AS eventType, payload, created_at AS createdAt FROM activity_history WHERE session_id = ? ORDER BY id DESC').all(req.params.sessionId)
    .map((row) => ({ ...row, payload: JSON.parse(row.payload) }));
  res.json(history);
});

app.use((error, _req, res, _next) => res.status(400).json({ error: error.message || 'Request failed.' }));
app.listen(port, () => console.log(`FlowMind API listening on http://localhost:${port}`));
