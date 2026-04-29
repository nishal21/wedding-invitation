// netlify/functions/theme.js
// GET /api/theme - Fetch default theme
// POST /api/theme - Update default theme (admin only)
const { neon } = require('@neondatabase/serverless');

exports.handler = async function(event, context) {
  const sql = neon(process.env.DATABASE_URL);

  // GET - Fetch default theme
  if (event.httpMethod === 'GET') {
    try {
      const result = await sql`
        SELECT default_theme FROM event_settings WHERE id = 1
      `;

      if (result.length === 0) {
        // Initialize with default if not exists
        await sql`
          INSERT INTO event_settings (id, default_theme) 
          VALUES (1, 'kerala') 
          ON CONFLICT (id) DO NOTHING
        `;
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ data: { default_theme: 'kerala' }, error: null })
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
      console.error('[theme GET]', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // POST - Update default theme
  if (event.httpMethod === 'POST') {
    try {
      const { default_theme } = JSON.parse(event.body);

      if (!default_theme || !['kerala', 'western', 'fusion'].includes(default_theme)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid theme value' })
        };
      }

      const result = await sql`
        UPDATE event_settings 
        SET default_theme = ${default_theme}, updated_at = NOW()
        WHERE id = 1
        RETURNING *
      `;

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ data: result[0], error: null })
      };
    } catch (error) {
      console.error('[theme POST]', error);
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
