-- D1 SQLite Relational Schema for Gen-Z Streetwear & Sneaker Drop Store (tpl-ecom-streetwear)
-- Movement B: Raw Acid Neo-Brutalism (Supreme / Palace / Off-White Awwwards winner aesthetic)

CREATE TABLE IF NOT EXISTS drops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  drop_number TEXT NOT NULL DEFAULT '04',
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'upcoming', 'active', 'paused', 'depleted'
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 250,
  released_units INTEGER NOT NULL DEFAULT 250,
  sold_units INTEGER NOT NULL DEFAULT 168,
  velocity_per_min REAL NOT NULL DEFAULT 4.2,
  is_paused INTEGER NOT NULL DEFAULT 0,
  hazard_alert TEXT DEFAULT '⚡ ACID DROP 04 // LIMITED 250 UNITS WORLDWIDE // NO RESTOCKS ⚡',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drop_products (
  id TEXT PRIMARY KEY,
  drop_id TEXT NOT NULL REFERENCES drops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'hoodie', 'bottoms', 'footwear', 'headwear', 'accessories'
  price INTEGER NOT NULL, -- In INR
  retail_price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  spec_badge TEXT,
  description TEXT,
  edition_tag TEXT NOT NULL DEFAULT 'LIMITED RUN',
  is_bundle_eligible INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS size_inventory (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES drop_products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_allocated INTEGER NOT NULL DEFAULT 10,
  stock_available INTEGER NOT NULL DEFAULT 0,
  is_sold_out INTEGER NOT NULL DEFAULT 0,
  badge_state TEXT DEFAULT 'low', -- 'sold_out', 'critical', 'low', 'available'
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bundle_stashes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  discount_pct REAL NOT NULL DEFAULT 20.0,
  required_item_count INTEGER NOT NULL DEFAULT 3,
  badge_text TEXT NOT NULL DEFAULT '20% STASH BONUS',
  description TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  drop_id TEXT REFERENCES drops(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT,
  items_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  discount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  is_stash_pack INTEGER NOT NULL DEFAULT 0,
  channel TEXT NOT NULL DEFAULT 'online', -- 'online', 'pos_counter'
  payment_method TEXT NOT NULL DEFAULT 'cashfree_upi', -- 'cashfree_upi', 'cash', 'card'
  payment_status TEXT NOT NULL DEFAULT 'paid', -- 'pending', 'paid', 'failed'
  bot_verification_token TEXT,
  drop_pass_token TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_drop ON drop_products(drop_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON size_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_drop ON orders(drop_id);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
