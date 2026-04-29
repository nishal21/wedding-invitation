// netlify/functions/rsvp.js
// POST /api/rsvp - Update guest RSVP status
const { neon } = require('@neondatabase/serverless');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { slug, status, guest_count } = JSON.parse(event.body);

    if (!slug || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: slug, status' })
      };
    }

    if (!['pending', 'attending', 'declined'].includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid status value' })
      };
    }

    const sql = neon(process.env.VITE_DATABASE_URL);
    const result = await sql`
      UPDATE invitees 
      SET status = ${status}, guest_count = ${guest_count || 0}
      WHERE slug = ${slug}
      RETURNING *
    `;

    if (result.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Guest not found' })
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
    console.error('[rsvp function]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
