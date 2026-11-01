-- D1 SQLite Seed Data for Gen-Z Streetwear & Sneaker Drop Store (tpl-ecom-streetwear)
-- Acid Drop 04 Catalog & Initial Inventory

INSERT OR REPLACE INTO drops (
  id, name, drop_number, slug, status, starts_at, ends_at,
  total_units, released_units, sold_units, velocity_per_min, is_paused, hazard_alert
) VALUES (
  'DROP-04',
  'ACID DROP 04 // NEO-TOKYO PROTOCOL',
  '04',
  'acid-drop-04',
  'active',
  '2026-11-01T00:00:00Z',
  '2026-11-05T23:59:59Z',
  250,
  250,
  168,
  4.2,
  0,
  '⚡ ACID DROP 04 // LIMITED 250 UNITS WORLDWIDE // NO RESTOCKS ⚡'
);

-- 5 Raw Streetwear Items
INSERT OR REPLACE INTO drop_products (
  id, drop_id, name, slug, sku, category, price, retail_price, image_url, spec_badge, description, edition_tag, is_bundle_eligible
) VALUES 
(
  'PRD-01',
  'DROP-04',
  'Heavyweight 450GSM Acid Wash Hoodie',
  'heavyweight-acid-wash-hoodie',
  'VLT-HD-001',
  'hoodie',
  5499,
  7999,
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
  '450GSM FLEECE // ACID WASH',
  'Heavy-gauge custom milled cotton fleece with double-layer oversized hood, raw distressed hem, and heat-embossed industrial serial tag.',
  '1 OF 250 // WORLDWIDE',
  1
),
(
  'PRD-02',
  'DROP-04',
  'Cyber-Goth Tactical Cargos',
  'cyber-goth-tactical-cargos',
  'VLT-CG-002',
  'bottoms',
  4499,
  6499,
  'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
  'CORDURA® RIPSTOP // 8-POCKET',
  'Engineered multi-compartment tactical trousers featuring high-tenacity Cordura panels, detachable webbing straps, and Fidlock magnetic closures.',
  'BATCH 04 // LTD EDITION',
  1
),
(
  'PRD-03',
  'DROP-04',
  'Deconstructed Sneaker v2',
  'deconstructed-sneaker-v2',
  'VLT-SNK-003',
  'footwear',
  8999,
  12999,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'VIBRAM LUG SOLE // EXPOSED FOAM',
  'Hand-distressed technical runner with raw foam tongue, asymmetrical lacing matrix, Vibram rugged megagrip outsole, and acid orange security zip-tie.',
  'COLLAB NO. 04',
  1
),
(
  'PRD-04',
  'DROP-04',
  'Distressed Balaclava',
  'distressed-balaclava',
  'VLT-BCL-004',
  'headwear',
  1499,
  2299,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  '100% COMBED COTTON // MESH BREATHABILITY',
  'Ribbed knit distressed ninja hood balaclava with precision eye aperture, frayed perimeter detailing, and thermal moisture regulation.',
  'ACCESSORY SPECIMEN',
  1
),
(
  'PRD-05',
  'DROP-04',
  'Industrial Utility Belt',
  'industrial-utility-belt',
  'VLT-BLT-005',
  'accessories',
  1299,
  1999,
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
  'HEAVY WEBBING // QUICK RELEASE BUCKLE',
  'High-density jacquard woven webbing belt with safety-orange contrast typography and quick-release aircraft alloy buckle.',
  'ACCESSORY SPECIMEN',
  1
);

-- Size Matrix Allocations with Scarcity
INSERT OR REPLACE INTO size_inventory (id, product_id, size, stock_allocated, stock_available, is_sold_out, badge_state) VALUES
('INV-HD-S', 'PRD-01', 'S', 12, 3, 0, 'critical'),
('INV-HD-M', 'PRD-01', 'M', 20, 0, 1, 'sold_out'),
('INV-HD-L', 'PRD-01', 'L', 25, 5, 0, 'low'),
('INV-HD-XL', 'PRD-01', 'XL', 10, 2, 0, 'critical'),

('INV-CG-28', 'PRD-02', '28', 10, 4, 0, 'low'),
('INV-CG-30', 'PRD-02', '30', 18, 0, 1, 'sold_out'),
('INV-CG-32', 'PRD-02', '32', 22, 6, 0, 'low'),
('INV-CG-34', 'PRD-02', '34', 8, 2, 0, 'critical'),

('INV-SN-8', 'PRD-03', 'UK 8', 10, 2, 0, 'critical'),
('INV-SN-9', 'PRD-03', 'UK 9', 15, 0, 1, 'sold_out'),
('INV-SN-10', 'PRD-03', 'UK 10', 12, 3, 0, 'critical'),
('INV-SN-11', 'PRD-03', 'UK 11', 6, 1, 0, 'critical'),

('INV-BC-OS', 'PRD-04', 'ONE SIZE', 30, 8, 0, 'available'),
('INV-BL-OS', 'PRD-05', 'ONE SIZE', 35, 12, 0, 'available');

-- Bundle Stash Definition
INSERT OR REPLACE INTO bundle_stashes (id, name, slug, discount_pct, required_item_count, badge_text, description, is_active) VALUES
(
  'STASH-TRIO',
  'Acid Trio Stash Pack',
  'stash-trio',
  20.0,
  3,
  '20% STASH BONUS',
  'Lock in any 3 drop pieces (Hoodie + Cargo + Balaclava / Accessories) to immediately trigger a 20% off Stash Combo Bonus with free Express Air Courier.',
  1
);

-- Seed Orders (Online Drop + Pop-Up Counter POS)
INSERT OR REPLACE INTO orders (
  id, drop_id, customer_name, customer_phone, customer_email, shipping_address,
  items_json, subtotal, discount, total_amount, is_stash_pack, channel, payment_method, payment_status,
  bot_verification_token, drop_pass_token, created_at
) VALUES
(
  'VLT-ORD-9011',
  'DROP-04',
  'Karan Sharma (Indiranagar, Bangalore)',
  '919876500001',
  'karan.sharma@streethype.in',
  '402, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
  '[{"id":"PRD-01","name":"Heavyweight 450GSM Acid Wash Hoodie","size":"L","qty":1,"price":5499},{"id":"PRD-04","name":"Distressed Balaclava","size":"ONE SIZE","qty":1,"price":1499}]',
  6998,
  0,
  6998,
  0,
  'online',
  'cashfree_upi',
  'paid',
  'BOT-VERIFIED-HUMAN-9011',
  'PASS-ACID-9011-884A',
  '2026-11-01 07:14:22'
),
(
  'VLT-ORD-9012',
  'DROP-04',
  'Stall POS Walk-In #58 (Kochi Pop-Up)',
  '919061902295',
  'pos-stall@kakabyeliza.com',
  'Counter Stall POS #01, Streetwear Con Kochi',
  '[{"id":"PRD-01","name":"Heavyweight 450GSM Acid Wash Hoodie","size":"S","qty":1,"price":5499},{"id":"PRD-02","name":"Cyber-Goth Tactical Cargos","size":"32","qty":1,"price":4499},{"id":"PRD-04","name":"Distressed Balaclava","size":"ONE SIZE","qty":1,"price":1499}]',
  11497,
  2299,
  9198,
  1,
  'pos_counter',
  'cashfree_upi',
  'paid',
  'POS-KIOSK-AUTH',
  'PASS-ACID-9012-772F',
  '2026-11-01 08:32:05'
),
(
  'VLT-ORD-9013',
  'DROP-04',
  'Devika Menon (Bandra West, Mumbai)',
  '919820011224',
  'devika.menon@artcore.co',
  'Flat 8B, Hill Road Apartments, Bandra West, Mumbai 400050',
  '[{"id":"PRD-03","name":"Deconstructed Sneaker v2","size":"UK 8","qty":1,"price":8999}]',
  8999,
  0,
  8999,
  0,
  'online',
  'cashfree_upi',
  'paid',
  'BOT-VERIFIED-HUMAN-9013',
  'PASS-ACID-9013-110C',
  '2026-11-01 08:55:12'
);
