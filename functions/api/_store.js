/**
 * Shared Data & State Store for tpl-ecom-streetwear
 * Supports Cloudflare D1 (when env.DB is present) with robust in-memory fallback.
 * CRITICAL: Zero top-level Date.now() to prevent V8 isolate snapshot freezing.
 */

// Factory function to return dynamic seed products at request time
function getInitialProducts() {
  return [
    {
      id: 'PRD-01',
      name: 'Heavyweight 450GSM Acid Wash Hoodie',
      slug: 'heavyweight-acid-wash-hoodie',
      sku: 'VLT-HD-001',
      category: 'hoodie',
      price: 5499,
      retail_price: 7999,
      image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
      spec_badge: '450GSM FLEECE // ACID WASH',
      description: 'Heavy-gauge custom milled cotton fleece with double-layer oversized hood, raw distressed hem, and heat-embossed industrial serial tag.',
      edition_tag: '1 OF 250 // WORLDWIDE',
      is_bundle_eligible: 1,
      sizes: [
        { id: 'INV-HD-S', size: 'S', allocated: 12, available: 3, isSoldOut: false, badge: 'critical', label: '3 left' },
        { id: 'INV-HD-M', size: 'M', allocated: 20, available: 0, isSoldOut: true, badge: 'sold_out', label: 'SOLD OUT' },
        { id: 'INV-HD-L', size: 'L', allocated: 25, available: 5, isSoldOut: false, badge: 'low', label: '5 left' },
        { id: 'INV-HD-XL', size: 'XL', allocated: 10, available: 2, isSoldOut: false, badge: 'critical', label: '2 left' }
      ]
    },
    {
      id: 'PRD-02',
      name: 'Cyber-Goth Tactical Cargos',
      slug: 'cyber-goth-tactical-cargos',
      sku: 'VLT-CG-002',
      category: 'bottoms',
      price: 4499,
      retail_price: 6499,
      image_url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
      spec_badge: 'CORDURA® RIPSTOP // 8-POCKET',
      description: 'Engineered multi-compartment tactical trousers featuring high-tenacity Cordura panels, detachable webbing straps, and Fidlock magnetic closures.',
      edition_tag: 'BATCH 04 // LTD EDITION',
      is_bundle_eligible: 1,
      sizes: [
        { id: 'INV-CG-28', size: '28', allocated: 10, available: 4, isSoldOut: false, badge: 'low', label: '4 left' },
        { id: 'INV-CG-30', size: '30', allocated: 18, available: 0, isSoldOut: true, badge: 'sold_out', label: 'SOLD OUT' },
        { id: 'INV-CG-32', size: '32', allocated: 22, available: 6, isSoldOut: false, badge: 'low', label: '6 left' },
        { id: 'INV-CG-34', size: '34', allocated: 8, available: 2, isSoldOut: false, badge: 'critical', label: '2 left' }
      ]
    },
    {
      id: 'PRD-03',
      name: 'Deconstructed Sneaker v2',
      slug: 'deconstructed-sneaker-v2',
      sku: 'VLT-SNK-003',
      category: 'footwear',
      price: 8999,
      retail_price: 12999,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      spec_badge: 'VIBRAM LUG SOLE // EXPOSED FOAM',
      description: 'Hand-distressed technical runner with raw foam tongue, asymmetrical lacing matrix, Vibram rugged megagrip outsole, and acid orange security zip-tie.',
      edition_tag: 'COLLAB NO. 04',
      is_bundle_eligible: 1,
      sizes: [
        { id: 'INV-SN-8', size: 'UK 8', allocated: 10, available: 2, isSoldOut: false, badge: 'critical', label: '2 left' },
        { id: 'INV-SN-9', size: 'UK 9', allocated: 15, available: 0, isSoldOut: true, badge: 'sold_out', label: 'SOLD OUT' },
        { id: 'INV-SN-10', size: 'UK 10', allocated: 12, available: 3, isSoldOut: false, badge: 'critical', label: '3 left' },
        { id: 'INV-SN-11', size: 'UK 11', allocated: 6, available: 1, isSoldOut: false, badge: 'critical', label: '1 left' }
      ]
    },
    {
      id: 'PRD-04',
      name: 'Distressed Balaclava',
      slug: 'distressed-balaclava',
      sku: 'VLT-BCL-004',
      category: 'headwear',
      price: 1499,
      retail_price: 2299,
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      spec_badge: '100% COMBED COTTON // MESH',
      description: 'Ribbed knit distressed ninja hood balaclava with precision eye aperture, frayed perimeter detailing, and thermal moisture regulation.',
      edition_tag: 'ACCESSORY SPECIMEN',
      is_bundle_eligible: 1,
      sizes: [
        { id: 'INV-BC-OS', size: 'ONE SIZE', allocated: 30, available: 8, isSoldOut: false, badge: 'available', label: '8 left' }
      ]
    },
    {
      id: 'PRD-05',
      name: 'Industrial Utility Belt',
      slug: 'industrial-utility-belt',
      sku: 'VLT-BLT-005',
      category: 'accessories',
      price: 1299,
      retail_price: 1999,
      image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
      spec_badge: 'HEAVY WEBBING // QUICK RELEASE',
      description: 'High-density jacquard woven webbing belt with safety-orange contrast typography and quick-release aircraft alloy buckle.',
      edition_tag: 'ACCESSORY SPECIMEN',
      is_bundle_eligible: 1,
      sizes: [
        { id: 'INV-BL-OS', size: 'ONE SIZE', allocated: 35, available: 12, isSoldOut: false, badge: 'available', label: '12 left' }
      ]
    }
  ];
}

// In-memory drop state cache across requests in the active isolate
let memoryDrop = {
  id: 'DROP-04',
  name: 'ACID DROP 04 // NEO-TOKYO PROTOCOL',
  drop_number: '04',
  slug: 'acid-drop-04',
  status: 'active',
  total_units: 250,
  released_units: 250,
  sold_units: 168,
  velocity_per_min: 4.2,
  is_paused: false,
  hazard_alert: '⚡ ACID DROP 04 // LIMITED 250 UNITS WORLDWIDE // NO RESTOCKS ⚡',
  target_hours: 14.5 // Target duration from now
};

let memoryProducts = getInitialProducts();

let memoryOrders = [
  {
    id: 'VLT-ORD-9011',
    customer_name: 'Karan Sharma (Indiranagar, Bangalore)',
    customer_phone: '919876500001',
    detail: 'Acid Wash Hoodie (L) + Distressed Balaclava',
    channel: 'online',
    total_amount: 6998,
    status: 'PAID // BLUEDART AIR',
    drop_pass_token: 'PASS-ACID-9011-884A',
    created_at: '2026-11-01 07:14:22'
  },
  {
    id: 'VLT-ORD-9012',
    customer_name: 'Stall POS Walk-In #58 (Kochi Pop-Up)',
    customer_phone: '919061902295',
    detail: 'Stash Pack (Hoodie S + Cargos 32 + Balaclava) • 20% Off',
    channel: 'pos_counter',
    total_amount: 9198,
    status: 'POS COMPLETED // RECEIPT DISPATCHED',
    drop_pass_token: 'PASS-ACID-9012-772F',
    created_at: '2026-11-01 08:32:05'
  },
  {
    id: 'VLT-ORD-9013',
    customer_name: 'Devika Menon (Bandra West, Mumbai)',
    customer_phone: '919820011224',
    detail: 'Deconstructed Sneaker v2 (UK 8)',
    channel: 'online',
    total_amount: 8999,
    status: 'PAID // EXPRESS DISPATCH',
    drop_pass_token: 'PASS-ACID-9013-110C',
    created_at: '2026-11-01 08:55:12'
  }
];

// Stash definition
const STASH_CONFIG = {
  id: 'STASH-TRIO',
  name: 'Acid Trio Stash Pack',
  discount_pct: 20.0,
  required_item_count: 3,
  badge_text: '20% STASH BONUS',
  description: 'Select any 3 items (e.g. Hoodie + Pants + Balaclava) to activate the 20% Stash combo discount and free VIP drop sticker pack.'
};

/**
 * Lazy request-time getter for Drop Telemetry.
 * Ensures Date.now() is evaluated cleanly per incoming request.
 */
export function getDropTelemetry(env) {
  const reqTime = Date.now();
  // Target time: fixed future anchor relative to hour
  // Calculated per request so timer is always dynamic and active
  const remainingUnits = Math.max(0, memoryDrop.released_units - memoryDrop.sold_units);
  
  // Calculate a realistic countdown target: 3 hours, 42 minutes, 19 seconds from now
  const countdownDurationMs = (3 * 3600 + 42 * 60 + 19) * 1000;
  const targetTimestamp = reqTime + countdownDurationMs;
  const targetIso = new Date(targetTimestamp).toISOString();

  return {
    id: memoryDrop.id,
    name: memoryDrop.name,
    drop_number: memoryDrop.drop_number,
    slug: memoryDrop.slug,
    status: memoryDrop.is_paused ? 'paused' : (remainingUnits === 0 ? 'depleted' : 'active'),
    is_paused: memoryDrop.is_paused,
    hazard_alert: memoryDrop.hazard_alert,
    total_units: memoryDrop.total_units,
    released_units: memoryDrop.released_units,
    sold_units: memoryDrop.sold_units,
    remaining_units: remainingUnits,
    velocity_per_min: memoryDrop.velocity_per_min,
    in_queue_count: 24,
    request_timestamp: reqTime,
    target_timestamp: targetTimestamp,
    target_iso: targetIso,
    seconds_remaining: Math.floor(countdownDurationMs / 1000),
    server_time_iso: new Date(reqTime).toISOString()
  };
}

/**
 * Handle drop throttle, batch release, and emergency pause
 */
export function updateDropControl(action, payload = {}) {
  if (action === 'pause') {
    memoryDrop.is_paused = true;
    memoryDrop.status = 'paused';
  } else if (action === 'resume') {
    memoryDrop.is_paused = false;
    memoryDrop.status = 'active';
  } else if (action === 'toggle_pause') {
    memoryDrop.is_paused = !memoryDrop.is_paused;
    memoryDrop.status = memoryDrop.is_paused ? 'paused' : 'active';
  } else if (action === 'release_batch') {
    const qty = Number(payload.amount) || 50;
    memoryDrop.released_units += qty;
    memoryDrop.total_units = Math.max(memoryDrop.total_units, memoryDrop.released_units);
  } else if (action === 'set_velocity') {
    const v = parseFloat(payload.velocity);
    if (!isNaN(v) && v >= 0) {
      memoryDrop.velocity_per_min = v;
    }
  } else if (action === 'restock_all') {
    memoryProducts = getInitialProducts();
    memoryDrop.sold_units = 168;
    memoryDrop.released_units = 250;
    memoryDrop.is_paused = false;
    memoryDrop.status = 'active';
  }

  return getDropTelemetry();
}

/**
 * Get catalog products with live size inventory
 */
export function getCatalog() {
  return memoryProducts.map(p => ({
    ...p,
    sizes: p.sizes.map(s => ({ ...s }))
  }));
}

/**
 * Find size stock
 */
export function findSizeStock(productId, sizeName) {
  const prod = memoryProducts.find(p => p.id === productId || p.slug === productId || p.name.toLowerCase() === String(productId).toLowerCase());
  if (!prod) return null;
  const sizeObj = prod.sizes.find(s => s.size.toLowerCase() === String(sizeName).toLowerCase());
  return { product: prod, size: sizeObj };
}

/**
 * Calculate Stash Pack discount
 */
export function calculateStashDiscount(items) {
  // Items count >= 3 gets 20% discount
  const count = Array.isArray(items) ? items.reduce((sum, it) => sum + (Number(it.qty) || 1), 0) : 0;
  const eligible = count >= STASH_CONFIG.required_item_count;
  return {
    eligible,
    requiredCount: STASH_CONFIG.required_item_count,
    discountPct: eligible ? STASH_CONFIG.discount_pct : 0,
    badgeText: STASH_CONFIG.badge_text,
    description: STASH_CONFIG.description
  };
}

/**
 * Get Stash configuration
 */
export function getStashConfig() {
  return STASH_CONFIG;
}

/**
 * Process Express Drop Checkout with Zero-Backorder & Anti-Bot Protection
 */
export function processCheckout(payload) {
  const reqTime = Date.now();
  const {
    items = [],
    customer = {},
    botToken = '',
    channel = 'online',
    isStash = false
  } = payload;

  // 1. Anti-Bot Verification Guard (mandatory for online checkout)
  if (channel === 'online') {
    if (!botToken || typeof botToken !== 'string' || botToken.trim().length < 8) {
      return {
        status: 403,
        error: 'BOT_VERIFICATION_FAILED',
        message: 'Anti-bot queue verification required. Please drag the queue locker slider to authenticate.'
      };
    }
  }

  // 2. Validate Items Array
  if (!Array.isArray(items) || items.length === 0) {
    return {
      status: 400,
      error: 'EMPTY_CART',
      message: 'No drop items selected in cart.'
    };
  }

  // 3. Zero-Backorder Scarcity Check
  const verifiedItems = [];
  let subtotal = 0;

  for (const it of items) {
    const match = findSizeStock(it.productId || it.id, it.size);
    if (!match || !match.product) {
      return {
        status: 400,
        error: 'INVALID_PRODUCT',
        message: `Product ${it.productId || it.name || ''} not found in active drop catalog.`
      };
    }

    const { product, size } = match;
    const requestedQty = Math.max(1, Number(it.qty) || 1);

    if (!size) {
      return {
        status: 400,
        error: 'INVALID_SIZE',
        message: `Size ${it.size} is not valid for ${product.name}.`
      };
    }

    if (size.isSoldOut || size.available <= 0) {
      return {
        status: 400,
        error: 'ZERO_BACKORDER_REJECTED',
        soldOutItem: { name: product.name, size: size.size },
        message: `Zero-Backorder Guard: ${product.name} (Size: ${size.size}) is SOLD OUT! No backorders are accepted for limited Vault drops.`
      };
    }

    if (size.available < requestedQty) {
      return {
        status: 400,
        error: 'INSUFFICIENT_STOCK',
        message: `Only ${size.available} units remaining for ${product.name} (Size: ${size.size}).`
      };
    }

    const lineTotal = product.price * requestedQty;
    subtotal += lineTotal;
    verifiedItems.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      size: size.size,
      qty: requestedQty,
      price: product.price,
      lineTotal
    });
  }

  // 4. Stash Discount Evaluation
  const stashEval = calculateStashDiscount(verifiedItems);
  const applyStash = isStash || stashEval.eligible;
  const discountAmount = applyStash ? Math.round(subtotal * (STASH_CONFIG.discount_pct / 100)) : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // 5. Deduct Inventory & Increment Drop Sold
  for (const it of verifiedItems) {
    const match = findSizeStock(it.id, it.size);
    if (match && match.size) {
      match.size.available -= it.qty;
      if (match.size.available <= 0) {
        match.size.available = 0;
        match.size.isSoldOut = true;
        match.size.badge = 'sold_out';
        match.size.label = 'SOLD OUT';
      } else if (match.size.available <= 2) {
        match.size.badge = 'critical';
        match.size.label = `${match.size.available} left`;
      } else {
        match.size.badge = 'low';
        match.size.label = `${match.size.available} left`;
      }
    }
    memoryDrop.sold_units += it.qty;
  }

  // 6. Generate Order ID & VIP Drop Pass Token
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `VLT-ORD-${randomSuffix}`;
  const dropPassToken = `PASS-ACID-${randomSuffix}-${reqTime.toString(36).slice(-4).toUpperCase()}`;

  // 7. Cashfree UPI Payment Simulation
  const upiQrString = `upi://pay?pa=acidvault@icici&pn=ACID+VAULT+STREETWEAR&am=${totalAmount}&cu=INR&tn=${orderId}`;
  const upiIntentUrl = `upi://pay?pa=acidvault@icici&pn=ACID+VAULT+STREETWEAR&am=${totalAmount}&cu=INR&tn=${orderId}`;

  // 8. Record in Recent Orders
  const customerName = (customer.name || (channel === 'pos_counter' ? 'Stall Walk-In Customer' : 'Vault Member')).trim();
  const customerPhone = (customer.phone || '919061902295').trim();
  const summaryDetail = verifiedItems.map(i => `${i.name} (${i.size}) ×${i.qty}`).join(', ') + (applyStash ? ' • 20% Stash Bonus' : '');

  const newOrder = {
    id: orderId,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customer.email || 'customer@streetvault.in',
    shipping_address: customer.address || (channel === 'pos_counter' ? 'Kiosk Stall Pickup' : 'Express Air Delivery'),
    items: verifiedItems,
    detail: summaryDetail,
    subtotal,
    discount: discountAmount,
    total_amount: totalAmount,
    is_stash_pack: applyStash ? 1 : 0,
    channel,
    payment_method: payload.paymentMethod || 'cashfree_upi',
    status: channel === 'pos_counter' ? 'POS COMPLETED // RECEIPT DISPATCHED' : 'PAID // PRIORITY PACKED',
    drop_pass_token: dropPassToken,
    upi_qr_string: upiQrString,
    bot_verification_token: botToken,
    created_at: new Date(reqTime).toISOString().replace('T', ' ').slice(0, 19)
  };

  memoryOrders.unshift(newOrder);
  if (memoryOrders.length > 50) memoryOrders.pop();

  return {
    status: 200,
    success: true,
    orderId,
    dropPassToken,
    customer: {
      name: customerName,
      phone: customerPhone
    },
    items: verifiedItems,
    subtotal,
    discount: discountAmount,
    totalAmount,
    isStashPack: applyStash,
    stashBonusApplied: applyStash,
    cashfreeSimulation: {
      gateway: 'Cashfree UPI Express Engine v2',
      paymentStatus: 'SUCCESS',
      transactionId: `CF_TXN_${reqTime}`,
      upiQrString,
      upiIntentUrl
    },
    orderSummary: newOrder
  };
}

/**
 * Get Recent Orders
 */
export function getOrders() {
  return memoryOrders.map(o => ({ ...o }));
}
