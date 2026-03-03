// Vercel Serverless Function — proxies quote requests to Warp API
// This bypasses CORS since the call happens server-side

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WARP_API = 'https://gw.wearewarp.com/api/v1/p/customer-cli/freight-quote/search';

  try {
    const response = await fetch(WARP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Forward status code and body
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(502).json({ error: 'Failed to reach Warp API' });
  }
}
