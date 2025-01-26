import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received request body:', body); // Debug log

    const sessionId = body.session_id || crypto.randomUUID();
    const requestBody = {
      user_query: body.message,
      session_id: sessionId,
      agent_history: body.chat_history || []
    };

    console.log('Sending to external API:', requestBody); // Debug log

    const response = await fetch('https://sportensclad-agent-latest.onrender.com/run_agent', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer f16a1765-1d86-412b-8b40-28e32e419e3f',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('External API response:', data); // Debug log

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response', details: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
} 