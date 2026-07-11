const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('.supabase_key', 'utf8').trim().split('=')[1];

const tables = ['konsultasi', 'gerai', 'anggota', 'produk', 'transaksi_event', 'sync_queue_item', 'system_state'];
const sql = tables.map(t => 'DROP POLICY IF EXISTS p_select ON ' + t + '; CREATE POLICY p_select ON ' + t + ' FOR SELECT USING (true); DROP POLICY IF EXISTS p_insert ON ' + t + '; CREATE POLICY p_insert ON ' + t + ' FOR INSERT WITH CHECK (true);').join('');

const body = JSON.stringify({ query: sql });
const opts = {
  hostname: 'xdkaivezmwumqfblxbdz.supabase.co',
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Prefer': 'return=minimal'
  }
};

const req = https.request(opts, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Status:', res.statusCode, d.substring(0, 300)));
});
req.on('error', e => console.error('ERR:', e.message));
req.write(body);
req.end();
