const http = require('http');

const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

async function testFlow() {
  console.log('1. Creating order with Burger and Cola...');
  const createRes = await request({
    hostname: 'localhost',
    port: 5050,
    path: '/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    items: [
      { productId: 1, qty: 2 },
      { productId: 3, qty: 1 }
    ]
  });
  console.log('Order created:', createRes.data.id, 'Total:', createRes.data.total);

  console.log('\n2. Updating order status to cooking...');
  const updateRes1 = await request({
    hostname: 'localhost',
    port: 5050,
    path: '/api/orders/' + createRes.data.id,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, { status: 'cooking' });
  console.log('Status updated to:', updateRes1.data.status);

  console.log('\n3. Updating order status to ready...');
  const updateRes2 = await request({
    hostname: 'localhost',
    port: 5050,
    path: '/api/orders/' + createRes.data.id,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, { status: 'ready' });
  console.log('Final status:', updateRes2.data.status);
}

testFlow().catch(console.error);
