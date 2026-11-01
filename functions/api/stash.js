import { getStashConfig, calculateStashDiscount } from './_store.js';

export async function onRequestGet(context) {
  try {
    const config = getStashConfig();
    return new Response(JSON.stringify({ success: true, stash: config }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const items = body.items || [];
    const evaluation = calculateStashDiscount(items);

    let subtotal = 0;
    if (Array.isArray(items)) {
      subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
    }
    const discountAmount = evaluation.eligible ? Math.round(subtotal * (evaluation.discountPct / 100)) : 0;
    const finalAmount = Math.max(0, subtotal - discountAmount);

    return new Response(JSON.stringify({
      success: true,
      eligible: evaluation.eligible,
      requiredCount: evaluation.requiredCount,
      discountPct: evaluation.discountPct,
      badgeText: evaluation.badgeText,
      subtotal,
      discountAmount,
      finalAmount
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
