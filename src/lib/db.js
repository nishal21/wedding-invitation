// src/lib/db.js
// ------------------------------------------------------------------
// Neon Serverless Postgres client.
// Exposes a thin helper `db` with the same { data, error } return
// shape the app already uses — so no component changes are needed.
//
// Setup:
//   1. Copy .env.local.example → .env.local
//   2. Set VITE_DATABASE_URL to your Neon connection string
//      (Project → Connection Details → choose "Pooled connection")
// ------------------------------------------------------------------
import { neon } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[db] Missing VITE_DATABASE_URL. ' +
    'Copy .env.local.example → .env.local and add your Neon connection string.'
  );
}

// `sql` is a tagged-template function that executes queries against Neon.
const sql = neon(connectionString ?? '');

// ------------------------------------------------------------------
// Helper: wrap a query promise into { data, error } to keep the
// existing component code unchanged.
// ------------------------------------------------------------------
async function query(promise) {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (err) {
    console.error('[db]', err);
    return { data: null, error: err };
  }
}

// ------------------------------------------------------------------
// `db` – minimal query API mirroring the Supabase client patterns
// used in this app.
//
// Supported operations:
//   db.from('table').select('*').order('col', { ascending })
//   db.from('table').select('*').eq('col', value).single()
//   db.from('table').insert(rowOrRows)
//   db.from('table').update(fields).eq('col', value)
//   db.from('table').delete().eq('col', value)
// ------------------------------------------------------------------
export const db = {
  from(table) {
    return new QueryBuilder(table);
  },
};

class QueryBuilder {
  constructor(table) {
    this._table   = table;
    this._op      = null;   // 'select' | 'insert' | 'update' | 'delete'
    this._cols    = '*';
    this._where   = null;   // { col, val }
    this._order   = null;   // { col, ascending }
    this._single  = false;
    this._data    = null;   // payload for insert / update
  }

  /* ── Builder methods ─────────────────────────────────────────── */

  select(cols = '*') {
    this._op   = 'select';
    this._cols = cols;
    return this;
  }

  insert(payload) {
    this._op   = 'insert';
    this._data = payload;
    return this;
  }

  update(payload) {
    this._op   = 'update';
    this._data = payload;
    return this;
  }

  delete() {
    this._op = 'delete';
    return this;
  }

  eq(col, val) {
    this._where = { col, val };
    return this;
  }

  order(col, { ascending = true } = {}) {
    this._order = { col, ascending };
    return this;
  }

  single() {
    this._single = true;
    return this; // returns a thenable (Promise) via then()
  }

  /* ── Execute (thenable so callers can await directly) ────────── */

  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }

  async _execute() {
    const t = this._table;

    /* SELECT */
    if (this._op === 'select') {
      let q;
      if (this._where) {
        const orderClause = this._order
          ? ` ORDER BY ${this._order.col} ${this._order.ascending ? 'ASC' : 'DESC'}`
          : '';
        q = sql`SELECT * FROM ${sql.unsafe(t)} WHERE ${sql.unsafe(this._where.col)} = ${this._where.val}${sql.unsafe(orderClause)}`;
      } else {
        const orderClause = this._order
          ? ` ORDER BY ${this._order.col} ${this._order.ascending ? 'ASC' : 'DESC'}`
          : '';
        q = sql`SELECT * FROM ${sql.unsafe(t)}${sql.unsafe(orderClause)}`;
      }
      const result = await query(q);
      if (this._single) {
        return { data: result.data?.[0] ?? null, error: result.error };
      }
      return result;
    }

    /* INSERT */
    if (this._op === 'insert') {
      const rows = Array.isArray(this._data) ? this._data : [this._data];
      // Build a multi-row INSERT
      try {
        for (const row of rows) {
          await sql`
            INSERT INTO invitees (full_name, slug, status, guest_count)
            VALUES (${row.full_name}, ${row.slug}, ${row.status ?? 'pending'}, ${row.guest_count ?? 1})
          `;
        }
        return { data: null, error: null };
      } catch (err) {
        console.error('[db insert]', err);
        return { data: null, error: err };
      }
    }

    /* UPDATE */
    if (this._op === 'update') {
      const entries = Object.entries(this._data);
      if (entries.length === 0) return { data: null, error: new Error('No data to update') };
      
      const whereCol = this._where?.col ?? 'id';
      const whereVal = this._where?.val;
      
      try {
        // Build raw query string with proper escaping
        const setClause = entries.map(([col, val]) => {
          const escapedVal = String(val).replace(/'/g, "''");
          return `"${col}" = '${escapedVal}'`;
        }).join(', ');
        
        const escapedWhereVal = String(whereVal).replace(/'/g, "''");
        const rawQuery = `UPDATE "${t}" SET ${setClause} WHERE "${whereCol}" = '${escapedWhereVal}'`;
        
        console.log('[db update query]', rawQuery);
        const result = await sql.query(rawQuery);
        return { data: result, error: null };
      } catch (err) {
        console.error('[db update]', err);
        return { data: null, error: err };
      }
    }

    /* DELETE */
    if (this._op === 'delete') {
      return query(sql`
        DELETE FROM invitees
        WHERE ${sql.unsafe(this._where.col)} = ${this._where.val}
      `);
    }

    return { data: null, error: new Error(`Unknown operation: ${this._op}`) };
  }
}
