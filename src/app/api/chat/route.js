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

    // Extract product information
    const productInfo = data.agent_response?.product_information;
    
    // Prepare the response data
    const responseData = {
      message: messageContent,
      displayChoice: true,
      hasOneProduct: true, // Set to true if we have product info
      hasTwoProducts: false,
      hasThreeProducts: false,
      // Product details
      product1Title: "Adjustable Bodyflex Dumbbell 15kg",
      product1Description: "Includes multiple weight plates (2x1kg, 2x1.25kg, 4x2.5kg)\nAnti-slip rubber grip\nVinyl-coated plates\nAdjustable weight system",
      product1Image1: data.product_1_image_1 || "https://sportensklad.bg/image/catalog/FITNES_UREDI/tejesti-lostove-stoiki/dumbeli/profesionalen-gumiran-dymbel-spartan-profi-12-5.jpg",
      product1Price: "89.99 лв",
      product1Url: data.product_1_url || "https://sportensklad.bg/bodyflex-dumbbell-15kg"
    };

    console.log('Sending response data:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      {
        message: "I apologize, but I encountered an error. Please try again.",
        error: true,
        details: error.message
      },
      { status: 200 } // Return 200 to handle the error gracefully on the client
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
