module.exports = async function handler(req, res) {
  const sku = String((req.query && req.query.sku) || 'SP17961').replace(/[^A-Za-z0-9]/g, '');
  try {
    const feed = await fetch('https://sanaplant.sk/feed/cena/' + sku, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SanaplantMailPreview/1.0)' }
    });
    const xml = await feed.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.status(feed.ok ? 200 : 502).send(xml);
  } catch (err) {
    res.status(502).json({ error: 'feed_unavailable' });
  }
};
