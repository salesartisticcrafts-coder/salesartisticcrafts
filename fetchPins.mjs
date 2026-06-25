import https from 'https';

const urls = [
  'https://in.pinterest.com/pin/4606056601640819328/',
  'https://in.pinterest.com/pin/10625749111324840/',
  'https://in.pinterest.com/pin/294282156922723543/',
  'https://in.pinterest.com/pin/1477812368956752/',
  'https://in.pinterest.com/pin/4611334291917437696/',
  'https://in.pinterest.com/pin/4081455906553626/',
  'https://in.pinterest.com/pin/4593742105178260608/',
  'https://in.pinterest.com/pin/4592405117681318528/'
];

urls.forEach((url, i) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<meta\s+property="og:image"\s+name="og:image"\s+content="([^"]+)"/i) || data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
      if(match) {
        console.log(`[${i}] Title: ${titleMatch ? titleMatch[1] : 'Unknown'}`);
        console.log(`[${i}] URL: ${match[1]}\n`);
      }
    });
  });
});
