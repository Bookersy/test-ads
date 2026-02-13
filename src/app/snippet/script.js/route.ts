import { NextResponse } from "next/server";

export async function GET() {
  const script = `
(function() {
  var scripts = document.getElementsByTagName('script');
  var src = '';
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.indexOf('snippet/script.js') !== -1) {
      src = scripts[i].src;
      break;
    }
  }
  var idx = src ? src.indexOf('/snippet/script.js') : -1;
  var base = idx >= 0 ? src.substring(0, idx) : '';

  function loadAds() {
    if (!base) return;
    var hostname = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '';
    var adflowHost = '';
    try {
      var a = document.createElement('a');
      a.href = base;
      adflowHost = (a.hostname || '').toLowerCase();
    } catch (e) {}
    if (hostname && hostname.toLowerCase() !== adflowHost) {
      fetch(base + '/api/sites/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: hostname })
      }).catch(function() {});
    }
    fetch(base + '/api/ads/fetch')
      .then(function(r) { return r.json(); })
      .then(function(ads) {
        if (!ads || ads.length === 0) return;
        var ad = ads[0];
        var container = document.getElementById('adflow-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'adflow-container';
          container.style.cssText = 'max-width:300px;margin:16px auto;font-family:system-ui,sans-serif;';
          var target = document.querySelector('[data-adflow]') || document.body;
          target.appendChild(container);
        }
        var a = document.createElement('a');
        a.href = ad.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.cssText = 'display:block;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;border:1px solid #334155;';
        a.onclick = function() {
          fetch(base + '/api/ads/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: ad.id })
          });
        };
        var img = document.createElement('img');
        img.src = ad.imageUrl;
        img.alt = ad.name;
        img.style.cssText = 'width:100%;height:auto;display:block;';
        var span = document.createElement('span');
        span.textContent = ad.name;
        span.style.cssText = 'display:block;padding:8px 12px;font-size:14px;background:#1e293b;color:#e2e8f0;';
        a.appendChild(img);
        a.appendChild(span);
        container.innerHTML = '';
        container.appendChild(a);
      })
      .catch(function() {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAds);
  } else {
    loadAds();
  }
})();
`;
  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
