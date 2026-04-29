// netlify/functions/invitees.js
// GET /api/invitees - Fetch all invitees
// POST /api/invitees - Insert new invitee(s)
// DELETE /api/invitees - Delete invitee by id
const { neon } = require('@neondatabase/serverless');

exports.handler = async function(event, context) {
  const sql = neon(process.env.DATABASE_URL);

  // GET - Fetch all invitees
  if (event.httpMethod === 'GET') {
    try {
      const result = await sql`
        SELECT * FROM invitees ORDER BY created_at DESC
      `;

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: result, error: null })
      };
    } catch (error) {
      console.error('[invitees GET]', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // POST - Insert new invitee(s)
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const invitees = Array.isArray(body) ? body : [body];

      // Validate each invitee
      for (const inv of invitees) {
        if (!inv.full_name || !inv.slug) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields: full_name, slug' })
          };
        }
      }

      // Insert one by one (simpler for now)
      const results = [];
      for (const inv of invitees) {
        const result = await sql`
          INSERT INTO invitees (full_name, slug, status, guest_count)
          VALUES (${inv.full_name}, ${inv.slug}, ${inv.status || 'pending'}, ${inv.guest_count || 1})
          RETURNING *
        `;
        results.push(result[0]);
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: results, error: null })
      };
    } catch (error) {
      console.error('[invitees POST]', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // DELETE - Delete invitee by id
  if (event.httpMethod === 'DELETE') {
    try {
      const { id } = event.queryStringParameters;

      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing id parameter' })
        };
      }

      const result = await sql`
        DELETE FROM invitees WHERE id = ${id} RETURNING *
      `;

      if (result.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Invitee not found' })
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: result[0], error: null })
      };
    } catch (error) {
      console.error('[invitees DELETE]', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
