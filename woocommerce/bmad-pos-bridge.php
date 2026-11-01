<?php
/**
 * Plugin Name: VORTEX ARCHIVE — WooCommerce Blocksy POS & Urgency Bridge
 * Description: Syncs Cloudflare Edge tokens and in-store POS stock matrix with WooCommerce.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) exit;
add_action('wp_head', function() {
  echo '<style>:root { --color-primary: #E11D48; --color-dark: #09090B; }</style>';
});
