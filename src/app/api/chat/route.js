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

    // Make the external API call
    const response = await fetch('https://sportensclad-agent-latest.onrender.com/run_agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer f16a1765-1d86-412b-8b40-28e32e419e3f'
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    // Always get the latest message from the response
    const messages = data.agent_response?.messages || [];
    const messageContent = messages[messages.length - 1]?.content || 
                         'No response received';

    // Extract product information from API response
    const productInfo = data.agent_response?.product_information;
    
    // Prepare the response data
    const responseData = {
      message: messageContent,
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

    // Debug logs
    console.log('Product data from API:', {
      product1: {
        title: data.product_1_title,
        image: data.product_1_image_1,
        price: data.product_1_price,
        url: data.product_1_url
      },
      product2: {
        title: data.product_2_title,
        image: data.product_2_image_1,
        price: data.product_2_price,
        url: data.product_2_url
      },
      product3: {
        title: data.product_3_title,
        image: data.product_3_image_1,
        price: data.product_3_price,
        url: data.product_3_url
      }
    });
    
    console.log('Final response data:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      {
        message: "I apologize, but I encountered an error. Please try again.",
        error: true,
        details: error.message
      },
      { status: 200 } 
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