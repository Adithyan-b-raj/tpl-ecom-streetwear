export async function onRequest() {
  return new Response(JSON.stringify({ service: 'tpl-ecom-streetwear', status: 'ok', items: [{"id":"ORD-7701","name":"Aakash Nair (Bangalore)","phone":"919847011223","detail":"Acid-Wash Hoodie (L) + Ripstop Cargo (32) • Prepaid UPI","status":"PACKED // BLUEDART","amount":"₹6,358"},{"id":"ORD-7702","name":"Popup Counter POS — Walk-In #44","phone":"919447022334","detail":"Cyber-Sigilism Tee (M) + Trucker Cap • Scanned UPI QR at Stall","status":"POS COMPLETED","amount":"₹2,448"},{"id":"ORD-7703","name":"Zoya Khan (Mumbai)","phone":"919895033445","detail":"Varsity Jacket (M) • Collector Number #42/100","status":"DISPATCHED","amount":"₹6,490"}] }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' }
  });
}
