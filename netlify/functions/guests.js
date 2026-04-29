// netlify/functions/guests.js
// GET /api/guests?slug=xxx - Fetch guest by slug
const { neon } = require('@neondatabase/serverless');

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { slug } = event.queryStringParameters;
  
  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing slug parameter' })
    };
  }

  try {
    const sql = neon(process.env.VITE_DATABASE_URL);
    const result = await sql`
      SELECT * FROM invitees WHERE slug = ${slug}
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
    console.error('[guests function]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
