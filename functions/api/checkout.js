import { processCheckout } from './_store.js';

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json().catch(() => ({}));
    const result = processCheckout(payload);

    if (result.status && result.status !== 200) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error,
        message: result.message,
        soldOutItem: result.soldOutItem || null
      }), {
        status: result.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: 'CHECKOUT_EXCEPTION',
      message: err.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
