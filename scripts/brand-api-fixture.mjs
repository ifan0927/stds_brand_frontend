import { createServer } from 'node:http';

const port = Number.parseInt(process.env.PORT || '4177', 10);
const host = '127.0.0.1';

const fixtures = {
  '/api/v1/public/brand/profile': {
    profile: {
      brand_name: '奕德不動產',
      contact_phone: '06-123-4567',
      contact_email: 'hello@example.com',
      contact_address: '台南市東區測試路 1 號',
      updated_at: '2026-05-16T00:00:00Z',
    },
  },
  '/api/v1/public/brand/faqs': {
    items: [
      {
        question: '包租代管適合誰？',
        answer: '適合希望降低管理成本並穩定出租流程的房東。',
        sort_order: 1,
      },
    ],
  },
  '/api/v1/public/properties/availability': {
    items: [
      {
        property_id: 'fixture-property-1',
        property_public_name: '東區寓所',
        address: '台南市東區測試路 1 號',
        has_vacant_room: true,
      },
      {
        property_id: 'fixture-property-2',
        property_public_name: '中西區寓所',
        address: '台南市中西區測試路 2 號',
        has_vacant_room: false,
      },
    ],
  },
};

const server = createServer((request, response) => {
  const path = new URL(request.url || '/', `http://${host}:${port}`).pathname;
  const payload = fixtures[path];

  if (!payload) {
    response.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'not_found' }));
    return;
  }

  response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
});

server.listen(port, host, () => {
  console.log(`Brand API fixture listening at http://${host}:${port}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
