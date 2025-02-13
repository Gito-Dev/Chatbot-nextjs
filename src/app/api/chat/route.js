import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Log the incoming request
    console.log('Incoming request:', {
      message: body.message,
      session_id: body.session_id
    });

    // Prepare the request for the external API
    const requestBody = {
      user_query: body.message,
      session_id: body.session_id,
      chat_history: body.chat_history?.map(msg => ({
        content: msg.text || msg.content,
        role: msg.sender === 'user' ? 'user' : 'assistant'
      })) || []
    };

    // Try up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt} to call external API`);
        
        const response = await fetch('https://sportensclad-agent-latest.onrender.com/run_agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer f16a1765-1d86-412b-8b40-28e32e419e3f'
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(60000) // Increased to 60 seconds
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

    const data = await response.json();

    // Extract product information from API response
    const productInfo = data.agent_response?.product_information;
    
    // Prepare the response data
    const responseData = {
      message: data.agent_response?.messages[data.agent_response?.messages.length - 1]?.content || 'No response received',
      displayChoice: productInfo?.display_choice || false,
      hasOneProduct: !!data.product_1_title,
      hasTwoProducts: !!data.product_2_title,
      hasThreeProducts: !!data.product_3_title,
      product1Title: data.product_1_title || '',
      product1Image1: data.product_1_image_1 || '',
      product1Price: data.product_1_price || '',
      product1Url: data.product_1_url || '',
      product2Title: data.product_2_title || '',
      product2Image1: data.product_2_image_1 || '',
      product2Price: data.product_2_price || '',
      product2Url: data.product_2_url || '',
      product3Title: data.product_3_title || '',
      product3Image1: data.product_3_image_1 || '',
      product3Price: data.product_3_price || '',
      product3Url: data.product_3_url || ''
    };

    return NextResponse.json(responseData);
      } catch (error) {
        if (attempt === 3) throw error; // Throw on final attempt
        console.log(`Attempt ${attempt} failed, retrying...`);
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        message: "The service is taking longer than expected. Please try again in a moment (the server might need to wake up).",
        error: true,
        details: error.message
      },
      { status: 504 }
    );
  }
}

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