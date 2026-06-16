/* Abra demo analytics — anonymous per-page hit counter.
 *
 * Purpose: tell us whether a business we messaged actually OPENS its demo link
 * (we get no read receipts on WhatsApp from a personal number — D35/D41).
 *
 * Privacy: no cookies, no PII, no fingerprinting. One counterapi.dev counter
 * "bump" per page, per browser session (deduped via sessionStorage). The counter
 * is keyed only by the page's own slug — nothing about the visitor is sent.
 *
 * Robustness: fail-safe — wrapped in try/catch and fired as an <img> beacon, so
 * it can NEVER block or break a demo page even if the counter service is down.
 *
 * Swappable: this is the ONLY place the provider lives. To change provider or
 * namespace, edit NS / the endpoint URL below and redeploy. No account, $0.
 * Read counts (non-incrementing):  GET https://api.counterapi.dev/v1/<NS>/<key>/
 */
(function () {
  try {
    var NS = "abra-demos-r7k2q9";
    var path = location.pathname.replace(/index\.html?$/i, "");
    path = path.replace(/^\/+|\/+$/g, "").replace(/^abra-demos\/?/, "");
    var key = (path || "home")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64);
    if (!key) return;
    try {
      var sk = "abra_hit_" + key;
      if (sessionStorage.getItem(sk)) return; // one count per session per page
      sessionStorage.setItem(sk, "1");
    } catch (e) {}
    var img = new Image();
    img.onload = img.onerror = function () {};
    img.src = "https://api.counterapi.dev/v1/" + NS + "/" + key + "/up?t=" + Date.now();
  } catch (e) {}
})();
