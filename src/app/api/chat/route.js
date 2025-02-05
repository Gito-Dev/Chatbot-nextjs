import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Received request body:', body); 

    const sessionId = body.session_id || crypto.randomUUID();
    const requestBody = {
      user_query: body.message,
      session_id: sessionId,
      agent_history: body.chat_history || []
    };

    console.log('Sending to external API:', requestBody);

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
    console.log('External API response:', data);

    // Extract the last message from agent_response.messages
    const messages = data.agent_response?.messages || [];
    const lastMessage = messages[messages.length - 1]?.content || '';

    // Transform the API response to include product information
    const responseData = {
      message: lastMessage, // Use the last message from the conversation
      messages: messages.map(msg => ({
        content: msg.content,
        role: msg.role || 'assistant'
      })),
      displayChoice: data.agent_response?.product_information?.display_choice === 'yes',
      hasOneProduct: data.has_one_product === 'yes',
      hasTwoProducts: data.has_two_products === 'yes',
      hasThreeProducts: data.has_three_products === 'yes',
      product1Title: data.product1Title || '',
      product1Image1: data.product1Image1 || '',
      product1Price: data.product1Price || '',
      product1Url: data.product1Url || '',
      product2Title: data.product2Title || '',
      product2Image1: data.product2Image1 || '',
      product2Price: data.product2Price || '',
      product2Url: data.product2Url || '',
      product3Title: data.product3Title || '',
      product3Image1: data.product3Image1 || '',
      product3Price: data.product3Price || '',
      product3Url: data.product3Url || '',
    };

    console.log('Response data:', responseData);

    return NextResponse.json(responseData, {
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
      { 
        error: 'Failed to fetch response', 
        details: error.message,
        message: 'I apologize, but I encountered an error. Could you please try again?' 
      },
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
