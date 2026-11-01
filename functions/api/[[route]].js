import { getCatalog, getOrders, getDropTelemetry } from './_store.js';

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/^\/api\/?/, '').toLowerCase();
  const method = context.request.method;

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // Lazy request timestamp
  const now = Date.now();

  // /api/health
  if (path === 'health' || path === '') {
    return new Response(JSON.stringify({
      service: 'tpl-ecom-streetwear',
      movement: 'Movement B: Raw Acid Neo-Brutalism',
      status: 'ok',
      timestamp: new Date(now).toISOString(),
      epoch_ms: now,
      version: '2.4.0',
      routes: ['/api/drop', '/api/checkout', '/api/stash', '/api/catalog', '/api/orders', '/api/health']
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // /api/catalog
  if (path === 'catalog' || path === 'products') {
    const catalog = getCatalog();
    return new Response(JSON.stringify({
      success: true,
      count: catalog.length,
      products: catalog,
      drop: getDropTelemetry()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=15',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // /api/orders
  if (path === 'orders' || path === 'records') {
    const orders = getOrders();
    return new Response(JSON.stringify({
      service: 'tpl-ecom-streetwear',
      status: 'ok',
      count: orders.length,
      items: orders
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 404 for unknown endpoints under /api/
  return new Response(JSON.stringify({
    error: 'NOT_FOUND',
    message: `API endpoint /api/${path} does not exist.`,
    availableEndpoints: ['/api/drop', '/api/checkout', '/api/stash', '/api/catalog', '/api/orders', '/api/health']
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
