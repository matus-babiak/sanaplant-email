function extractItemTitle(xml) {
  const item = xml.match(/<item>[\s\S]*?<\/item>/);
  if (!item) return null;
  const title = item[0].match(/<title>([^<]+)<\/title>/);
  return title ? title[1].trim() : null;
}

module.exports = async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const htmlRes = await fetch(proto + '://' + host + '/sanaplant-email-2.html');
  let html = await htmlRes.text();

  try {
    const feedRes = await fetch('https://sanaplant.sk/feed/cena/SP17961', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SanaplantMailPreview/1.0)' }
    });
    const price = extractItemTitle(await feedRes.text());
    if (price) {
      html = html.replace(/\*\|FEEDBLOCK:[\s\S]*?\*\|END:FEEDBLOCK\|\*/g, price);
    }
  } catch (err) {}

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
  res.status(200).send(html);
};
