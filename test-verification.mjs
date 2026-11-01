/**
 * Automated Verification Test Suite for Ticket 5.1
 * Repository: tpl-ecom-streetwear
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('=== 1. SCHEMA & SEED VERIFICATION ===');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');

  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS drops'), 'schema.sql defines drops table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS drop_products'), 'schema.sql defines drop_products table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS size_inventory'), 'schema.sql defines size_inventory table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS bundle_stashes'), 'schema.sql defines bundle_stashes table');
  assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS orders'), 'schema.sql defines orders table');

  assert(seedSql.includes('Heavyweight 450GSM Acid Wash Hoodie'), 'seed.sql seeds Heavyweight 450GSM Acid Wash Hoodie');
  assert(seedSql.includes('Cyber-Goth Tactical Cargos'), 'seed.sql seeds Cyber-Goth Tactical Cargos');
  assert(seedSql.includes('Deconstructed Sneaker v2'), 'seed.sql seeds Deconstructed Sneaker v2');
  assert(seedSql.includes('Distressed Balaclava'), 'seed.sql seeds Distressed Balaclava');
  assert(seedSql.includes('Industrial Utility Belt'), 'seed.sql seeds Industrial Utility Belt');
  assert(seedSql.includes('STASH-TRIO'), 'seed.sql seeds bundle stash config');

  console.log('\n=== 2. CLOUDFLARE FUNCTIONS API & LAZY FACTORY GETTERS ===');
  const storeModule = await import('./functions/api/_store.js');
  
  // Test Drop Telemetry
  const drop1 = storeModule.getDropTelemetry();
  assert(drop1.id === 'DROP-04', 'Drop ID is DROP-04');
  assert(drop1.velocity_per_min === 4.2, 'Depletion velocity is 4.2 units/min');
  assert(typeof drop1.request_timestamp === 'number', 'Request timestamp is evaluated dynamically');
  assert(drop1.target_timestamp > drop1.request_timestamp, 'Target countdown timestamp is in future');

  // Test Pause / Control
  const pausedDrop = storeModule.updateDropControl('pause');
  assert(pausedDrop.is_paused === true && pausedDrop.status === 'paused', 'Drop control: emergency pause');
  const resumedDrop = storeModule.updateDropControl('resume');
  assert(resumedDrop.is_paused === false && resumedDrop.status === 'active', 'Drop control: resume active');

  // Test Batch Release
  const beforeReleased = resumedDrop.released_units;
  const batchDrop = storeModule.updateDropControl('release_batch', { amount: 50 });
  assert(batchDrop.released_units === beforeReleased + 50, 'Drop control: release batch (+50 units)');

  // Test Catalog
  const catalog = storeModule.getCatalog();
  assert(catalog.length === 5, 'Catalog has exactly 5 raw streetwear items');
  const hoodie = catalog.find(p => p.sku === 'VLT-HD-001');
  assert(hoodie && hoodie.sizes.length === 4, 'Heavyweight Hoodie has 4 size options (S, M, L, XL)');
  const soldOutM = hoodie.sizes.find(s => s.size === 'M');
  assert(soldOutM && soldOutM.isSoldOut === true, 'Heavyweight Hoodie size M is SOLD OUT in seed');

  // Test Stash Discount calculation
  const stash3 = storeModule.calculateStashDiscount([{ qty: 1 }, { qty: 1 }, { qty: 1 }]);
  assert(stash3.eligible === true && stash3.discountPct === 20, 'Stash Pack calculation: 3 items gives 20% discount');
  const stash2 = storeModule.calculateStashDiscount([{ qty: 1 }, { qty: 1 }]);
  assert(stash2.eligible === false && stash2.discountPct === 0, 'Stash Pack calculation: 2 items is not eligible');

  // Test Anti-Bot Guard in Checkout
  const botFailResult = storeModule.processCheckout({
    channel: 'online',
    botToken: '', // empty token
    items: [{ productId: 'PRD-01', size: 'S', qty: 1 }]
  });
  assert(botFailResult.status === 403 && botFailResult.error === 'BOT_VERIFICATION_FAILED', 'Checkout: rejects empty bot token with 403');

  // Test Zero-Backorder Guard in Checkout
  const backorderResult = storeModule.processCheckout({
    channel: 'online',
    botToken: 'BOT-PASS-VERIFIED-123456',
    items: [{ productId: 'PRD-01', size: 'M', qty: 1 }] // Size M is SOLD OUT
  });
  assert(backorderResult.status === 400 && backorderResult.error === 'ZERO_BACKORDER_REJECTED', 'Checkout: rejects SOLD OUT size with ZERO_BACKORDER_REJECTED');

  // Test Successful Express Checkout with Stash Bonus & Cashfree UPI
  const successResult = storeModule.processCheckout({
    channel: 'online',
    botToken: 'BOT-PASS-VERIFIED-123456',
    isStash: true,
    items: [
      { productId: 'PRD-01', size: 'S', qty: 1 },
      { productId: 'PRD-02', size: '32', qty: 1 },
      { productId: 'PRD-04', size: 'ONE SIZE', qty: 1 }
    ],
    customer: {
      name: 'Adithyan Raj',
      phone: '919061902295',
      address: 'Kochi Hub 682001'
    }
  });
  assert(successResult.success === true, 'Checkout: successful express checkout');
  assert(successResult.isStashPack === true && successResult.discount > 0, 'Checkout: applied 20% stash bonus');
  assert(successResult.dropPassToken && successResult.dropPassToken.startsWith('PASS-ACID-'), 'Checkout: issued valid VIP Drop Pass token');
  assert(successResult.cashfreeSimulation.upiQrString.includes('upi://pay'), 'Checkout: Cashfree UPI simulated QR string returned');

  console.log('\n=== 3. HTML ARCHETYPE & DOM BLUEPRINTS ===');
  const indexHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
  const adminHtml = fs.readFileSync(path.join(__dirname, 'public', 'admin.html'), 'utf-8');

  assert(indexHtml.includes('data-layout-archetype="acid-neobrutalism-drop"'), 'index.html has data-layout-archetype="acid-neobrutalism-drop"');
  assert(indexHtml.includes('⚡ ACID DROP 04 // LIMITED 250 UNITS WORLDWIDE // NO RESTOCKS ⚡'), 'index.html has diagonal scrolling hazard marquee tape');
  assert(indexHtml.includes('id="flipClock"'), 'index.html has live flip-clock countdown timer');
  assert(indexHtml.includes('id="antiBotContainer"'), 'index.html has Anti-Bot Queue Locker Slider widget');
  assert(indexHtml.includes('id="stash-builder"'), 'index.html has Interactive Stash Pack bundle builder');
  assert(indexHtml.includes('id="checkoutDrawer"'), 'index.html has Sticky Express Checkout Drawer');
  assert(indexHtml.includes('whitelabel.js'), 'index.html imports whitelabel.js');
  assert(indexHtml.includes('data-wl-brand'), 'index.html has [data-wl-brand]');
  assert(indexHtml.includes('data-wl-tagline'), 'index.html has [data-wl-tagline]');
  assert(indexHtml.includes('id="floatingWaBtn"'), 'index.html has #floatingWaBtn');

  assert(adminHtml.includes('data-layout-archetype="drop-quota-admin"'), 'admin.html has data-layout-archetype="drop-quota-admin"');
  assert(adminHtml.includes('gaugeSpeed'), 'admin.html has Real-time velocity gauge');
  assert(adminHtml.includes('executeBatchRelease'), 'admin.html has Release batch throttler');
  assert(adminHtml.includes('toggleDropPause'), 'admin.html has Emergency Drop Pause button');
  assert(adminHtml.includes('barcodeInput'), 'admin.html has Barcode scanner input');
  assert(adminHtml.includes('pos-tap-grid'), 'admin.html has 1-tap item POS intake buttons');
  assert(adminHtml.includes('chargeAndPrintReceipt'), 'admin.html has 80mm thermal receipt trigger');
  assert(adminHtml.includes('whitelabel.js'), 'admin.html imports whitelabel.js');

  console.log('\n=== 4. WHITELABEL & GITIGNORE ===');
  const whitelabelJs = fs.readFileSync(path.join(__dirname, 'public', 'whitelabel.js'), 'utf-8');
  assert(whitelabelJs.includes("params.has('phone')"), 'whitelabel.js supports ?phone= override');
  assert(whitelabelJs.includes("params.has('wa')"), 'whitelabel.js supports ?wa= override');
  assert(whitelabelJs.includes("params.has('brand')"), 'whitelabel.js supports ?brand= override');
  assert(whitelabelJs.includes("params.has('primary')"), 'whitelabel.js supports ?primary= override');

  const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf-8');
  assert(gitignore.includes('.wrangler/'), '.gitignore ignores .wrangler/');
  assert(gitignore.includes('node_modules/'), '.gitignore ignores node_modules/');
  assert(gitignore.includes('*.log'), '.gitignore ignores *.log');

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${testsPassed} passed, ${testsFailed} failed.`);
  console.log(`========================================`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
